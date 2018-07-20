// var popupS = require('popups');
module.exports = function(app, fs, db, upload){

  app.get('/tax_invoice_companies', (req,res) => {
    db.manyOrNone("Select * from items order by invoice_type, print_number")
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
      res.render('tax_invoice_companies', {
        title: "세금계산서 발행 업체 리스트",
        maintenance: maintenance,
        fee: fee,
        expressFlash: req.flash('success')
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });
  app.get('/tax_invoice_companies/delete/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.none('delete from items where id = ' + invoice_id)
     .then(() => {
       res.redirect('back')
     })

  })

  app.get('/tax_invoice_company/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.oneOrNone('select * from items where id = ' + invoice_id)
     .then((data) => {
       res.render('new_tax_invoice_company', {title: '업체 등록', company: data})
     }).catch( (err) => {
          res.send(err)
         console.log("Error: ", err);
     });

  })
  app.get('/tax_invoice_companies/new', (req,res) => {
    res.render('new_tax_invoice_company', {title: '신규 업체 등록'})

  })
  app.post('/tax_invoice_company/:id',upload.single('userfile'), (req,res) => {
    let company = req.body;
    let company_id = req.params.id
    console.log(company);
    if(req.file){
      query_string = `update items set company_name = '${company.company_name}',item_name='${company.item_name}',
      sent_by='${company.sent_by}', best_match='${company.best_match}',total_price= ${company.total_price}, report_filename='${req.file.filename}'  where id = ${company_id}`;
      //console.log(query_string);
    }else{
      query_string = `update items set company_name = '${company.company_name}',item_name='${company.item_name}',
      sent_by='${company.sent_by}', best_match='${company.best_match}',total_price= ${company.total_price}  where id = ${company_id}`;
    }

    db.none(query_string).then( () => {
      req.flash('success', '변경성공.')
      res.redirect('/tax_invoice_companies')
    }).catch((err) => {
      //console.error( "등록실패:" ,err);
      res.send({result:err});
    });


  })
  app.post('/tax_invoice_companies', upload.single('userfile'), (req,res) =>{
      //console.log(req);
      let company = req.body;

      console.log(company);
      if(req.file){
        query_string = `insert into items (invoice_type, print_number, company_name, item_name, sent_by, best_match, total_price, report_filename ) Values (
           '${company.invoice_type}',${company.print_number},'${company.company_name}','${company.item_name}','${company.sent_by}', '${company.best_match}', ${company.total_price}, '${req.file.filename}')`;
        //console.log(query_string);
      }else{
        query_string = `insert into items (invoice_type, print_number, company_name, item_name, sent_by, best_match, total_price ) Values (
           '${company.invoice_type}',${company.print_number},'${company.company_name}','${company.item_name}','${company.sent_by}', '${company.best_match}', ${company.total_price})`;
      }
      db.none(query_string).then( () => {
        //console.log( "등록성공");
        res.redirect('/tax_invoice_companies')
      }).catch((err) => {
        console.error( "등록실패:" ,err);
        res.send({result:err});
      });

    });


}
