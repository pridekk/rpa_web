// var popupS = require('popups');
module.exports = function(app, fs, db, upload){
  var companies_map = {}
  var issuers_map = {}
  var companies_list = []
  var issuers_list = []
  db.manyOrNone("Select * from companies order by company_name")
  .then((data) => {
    for(var i =0, len=data.length; i <len;i++){
        companies_map[data[i].id] = data[i]
        companies_list.push(data[i])
      }
  })
  .catch( (err) => {
    //res.send(err)
    console.log("Error: ", err);
  });
  db.manyOrNone("Select * from tax_invoice_issuers order by issuer_name")
  .then((data) => {
    for(var i =0, len=data.length; i <len;i++){
        issuers_map[data[i].id] = data[i]
        issuers_list.push(data[i])
      }
  })
  .catch( (err) => {
    //res.send(err)
    console.log("Error: ", err);
  });
  app.get('/items', (req,res) => {
    db.manyOrNone("Select * from items where disabled = false order by invoice_type, print_number")
    .then((data) => {
      maintenance = []
      fee = []

      for(var i =0, len=data.length; i <len;i++){
        if (data[i].invoice_type=== "maintenance"){
          maintenance.push(data[i])
        }else{
          fee.push(data[i])
        }
      }
      res.render('items', {
        title: "세금계산서 발행 업체 리스트",
        maintenance: maintenance,
        fee: fee,
        companies: companies_map,
        issuers: issuers_map,
        expressFlash: req.flash('success')
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });
  app.get('/items/delete/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.none('update items set disabled = true where id = ' + invoice_id)
     .then(() => {

       res.redirect('back')
     })

  })

  app.get('/item/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.oneOrNone('select * from items where id = ' + invoice_id)
     .then((data) => {
       res.render('item', {title: '업체 수정', item: data, companies:companies_list, issuers: issuers_list})
     }).catch( (err) => {
          res.send(err)
         console.log("Error: ", err);
     });

  })
  app.get('/items/new', (req,res) => {
    res.render('new_items', {title: '신규 업체 등록', companies:companies_list, issuers:issuers_list})

  })
  app.post('/item/:id',upload.single('userfile'), (req,res) => {
    let company = req.body;
    let company_id = req.params.id
    console.log(company);
    if(req.file){
      query_string = `update items set code='${company.code}', company_id = ${company.company_id},item_name='${company.item_name}',
      issuer_id=${company.issuer_id}, best_match='${company.best_match}',total_price= ${company.total_price}, report_filename='${req.file.filename}'  where id = ${company_id}`;
      //console.log(query_string);
    }else{
      query_string = `update items set code='${company.code}',company_id = ${company.company_id},item_name='${company.item_name}',
      issuer_id=${company.issuer_id}, best_match='${company.best_match}',total_price= ${company.total_price}  where id = ${company_id}`;
    }
    console.log(query_string)
    db.none(query_string).then( () => {
      req.flash('success', '변경성공.')
      res.redirect('/items')
    }).catch((err) => {
      //console.error( "등록실패:" ,err);
      res.send({result:err});
    });


  })
  app.post('/items', upload.single('userfile'), (req,res) =>{
      //console.log(req);
      let company = req.body;

      console.log(req.file)
      console.log(company);
      if(req.file){
        query_string = `insert into items (invoice_type, print_number, company_id, item_name, issuer_id, best_match, total_price, report_filename, code ) Values (
           '${company.invoice_type}',${company.print_number},${company.company_id},'${company.item_name}',${company.issuer_id}, '${company.best_match}', ${company.total_price}, '${req.file.filename}','${company.code}')`;
        //console.log(query_string);
      }else{
        query_string = `insert into items (invoice_type, print_number, company_id, item_name, issuer_id, best_match, total_price ,code) Values (
           '${company.invoice_type}',${company.print_number},${company.company_id},'${company.item_name}',${company.issuer_id}, '${company.best_match}', ${company.total_price},'${company.code}')`;
      }
      db.none(query_string).then( () => {
        //console.log( "등록성공");
        res.redirect('/items')
      }).catch((err) => {
        console.error( "등록실패:" ,err);
        res.send({result:err});
      });

    });

    app.get('/items/:invoice_type/:year/:month', (req,res) =>{
      invoice_type = req.params.invoice_type
      month= req.params.month
      year = req.params.year
      console.log(req.params)
      if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
        db.manyOrNone(`select code print_number, tic.company_name, tic.item_name, total_price, diff_price,filepath as ti_file,tid, mr.id as mid, mr.filepath as mr_file, company_number
          from ( Select tc.code as code, tc.id as c_id, ti.id as tid, tc.print_number as print_number , tc.company_name as company_name, tc.item_name as item_name, tc.total_price as total_price,
	          (ti.total_price - tc.total_price ) as diff_price, company_number, filepath from items as tc left outer join
            (select * from tax_invoices where confirmed = true and bill_month like '%${month}%' and bill_year like '%${year}%') as ti
            on tc.id = ti.tax_invoice_company_id where tc.invoice_type = '${invoice_type}') as tic
            left outer join (select * from maintain_reports where confirmed = true and month like '%${month}%' and year like '%${year}%') as mr on tic.c_id = mr.tax_invoice_company_id order by print_number`)
        .then((data) => {
          res.render('monthly_reports', {
            title: invoice_type,
            data: data
          });
        })
        .catch( (err) => {
          console.log("Error: ", err);
        });
      } else {
          res.render("/items/:invoice_type/:year/:month 형식 오류")
      }

    });


}
