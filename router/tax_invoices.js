// var popupS = require('popups');
module.exports = function(app, fs, db,upload, companies_map){
  console.log(upload)
  var companies = []
  var issuers = []
  db.manyOrNone("Select * from companies order by company_name")
  .then((data) => {
    for(var i =0, len=data.length; i <len;i++){
        companies.push(data[i])
      }
  })
  .catch( (err) => {
    res.send(err)
    console.log("Error: ", err);
  });
  db.manyOrNone("Select * from tax_invoice_issuers order by issuer_name")
  .then((data) => {
    for(var i =0, len=data.length; i <len;i++){
        issuers.push(data[i])
      }
  })
  .catch( (err) => {
    res.send(err)
    console.log("Error: ", err);
  });
  app.get('/tax_invoices', (req,res) => {
    req.session.origin = 'tax_invoices'
    console.log(req.query)
    let invoice_type = req.query.invoice_type
    let month= req.query.month
    let year = req.query.year
    let is_archive = req.query.is_archive
    let search = req.query.search
    let query_string = null
    if (is_archive === 'on'){
      query_string = "Select  * from tax_invoices where 1 = 1"
    }else{
      query_string = "Select  * from tax_invoices where confirmed = false"
    }

    if(search){
      query_string = query_string + ` and (company like '%${search}%' or item_name like '%${search}%')`
    }
    query_string = query_string + ' order by id desc'
    console.log(query_string)
    db.manyOrNone(query_string)
    .then((data) => {
      res.render('full_tax_invoices', {
        title: "세금계산서 수신 리스트",
        data: data,
        expressFlash: req.flash('success'),
        is_archive: is_archive
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });


  });
  app.get('/tax_invoices/back', (req,res) => {
    data = req.session
    if(req.session.origin === 'monthly_reports'){
      res.redirect(`/monthly_reports?invoice_type=${data.invoice_type}&month=${data.month}&year=${data.year}`)
    }else{
      res.redirect("/tax_invoices")
    }


  });
  app.get('/tax_invoices/:invoice_type/:year/:month', (req,res) => {

    invoice_type = req.params.invoice_type
    month= req.params.month
    year = req.params.year
    console.log(req.params)
    if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
      db.manyOrNone(`Select ti.id as id, tc.sent_by as sent_by , tc.print_number as print_number , tc.company_name as company_name, tc.item_name as item_name, tc.total_price as total_price, \
       ti.company as invoice_company_name, ti.item_name as invoice_item_name, ti.month as invoice_month, \
       ti.day as invoice_day, ti.price as invoice_price, ti.tax as invoice_tax, ti.total_price as invoice_total_price, (tc.total_price - ti.total_price) as diff_price , \
       ti.filepath as filepath, ti.id as invoice_id \
       from items as tc left outer join tax_invoices as ti on tc.id = ti.tax_invoice_company_id \
       where tc.invoice_type = '${invoice_type}' order by print_number`)
      .then((data) => {

        res.render('tax_invoices', {
          title: invoice_type,
          data: data
        });
      })
      .catch( (err) => {
        console.log("Error: ", err);
      });
    } else {
        db.manyOrNone("Select  * \
         from tax_invoices")
        .then((data) => {

          res.render('full_tax_invoices', {
            title: "세금계산서 수신 리스트",
            data: data,
            expressFlash: req.flash('success')
          });
        })
        .catch( (err) => {
          console.log("Error: ", err);
        });

    }


  });
  app.get('/tax_invoices/delete/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     console.log(req.session)

     query_string = `select * from tax_invoices where id = ${invoice_id}`
     db.oneOrNone(query_string)
     .then((data) => {
       console.log(__dirname)

       if(data.filepath){
         let filename = __dirname + "/../public/pdf/" + data.filepath.split('\\').pop()
         fs.stat(filename, (err, stats) => {
           if(err){
             return console.log(err);
           }
           fs.unlink( filename, (err) => {
             if(err){
               return console.log(err);
             }
             console.log(`${filename} has been deleted`)
           })
         })
       }
       query_string = `select * from items where id = ${data.tax_invoice_company_id}`
       console.log(query_string)
       db.oneOrNone(query_string)
       .then((data2) => {
         db.none('delete from tax_invoices where id = ' + invoice_id)
         .then(() => {
           console.log(req.session)
           console.log(data2)
           req.flash('success', '삭제 완료')
           if(req.session.origin === "monthly_reports"){
             res.redirect(`/monthly_reports?invoice_type=${data2.invoice_type}&month=${data.bill_month}&year=${data.bill_year}`)
           }else {
             res.redirect('/tax_invoices')
           }
         })
       })

     })


  })
  app.get('/tax_invoice/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     console.log(req.session)
     db.oneOrNone('select * from tax_invoices where id = ' + invoice_id)
     .then((data) => {
       console.log(data)
       db.oneOrNone(`select items.id as id, * from items left join companies on items.company_id = companies.id where items.id = ${data.tax_invoice_company_id}`)
       .then((data2) =>{
         console.log(data2)
         db.manyOrNone('select distinct invoice_type from items')
         .then((data3) => {

           res.render('tax_invoice', {
             title: "세금계산서수정",
             data: data ,
             tax_invoice_company: data2,
             invoice_type: data3,
           });
         });
       });
     })
     .catch( (err) => {
       console.log("Error: ", err);
     });

  })

  app.put('/tax_invoice/:id', (req,res) =>{
    invoice_id  = req.params.id
    console.log(req.body)
    invoice = req.body
    if(invoice.confirmed === 'on'){
      invoice.confirmed = true
    } else{
      invoice.confirmed = false
    }
    if(invoice.item_id){
      db.none(`update tax_invoices set evidence_date = '${invoice.evidence_date}',tax_invoice_company_id = ${invoice.item_id},  price = ${invoice.price}, tax= ${invoice.tax}, total_price= ${invoice.total_price},
        bill_year= '${invoice.bill_year}', bill_month= '${invoice.bill_month}', confirmed = ${invoice.confirmed} where id = ${invoice_id}`)
      .then(() => {
         req.flash('success', '수정 완료')
        res.redirect('back')
      })
      .catch( (err) => {
        console.log("Error: ", err);
        res.send(err)
        res.end()
      });

    }else{
      db.none(`update tax_invoices set evidence_date = '${invoice.evidence_date}', price = ${invoice.price}, tax= ${invoice.tax}, total_price= ${invoice.total_price},
        bill_year= ${invoice.bill_year}, bill_month= ${invoice.bill_month} , confirmed = ${invoice.confirmed}  where id = ${invoice_id}`)
      .then(() => {
         req.flash('success', '수정 완료')
         res.redirect('back')
      }).catch( (err) => {
        console.log("Error: ", err);
        res.send(err)
        res.end()
      });
    }
  })
  app.get('/tax_invoices/new', (req,res) => {
    data = req.query
    tax_invoice_company = null
    res.render('new_tax_invoice', {title: '신규 업체 등록', data, companies:companies, issuers:issuers, tax_invoice_company })

  })

  app.post('/tax_invoices', upload.single('userfile'), (req,res) =>{
      //console.log(req)
      let company = req.body;
      console.log(company)
      query_string = `insert into tax_invoices (company, tax_invoice_company_id, item_name,item_name_alias, bill_year, bill_month, evidence_date, price, tax, total_price, filepath, mgmt_id,confirmed ) Values (
         '${company.company_name}',${company.tax_invoice_company_id},'${company.item_name}','${company.item_name.replace(/d+/g,'.').trim()}','${company.bill_year}',
         '${company.bill_month}', '${company.evidence_date}',${company.price},${company.tax},${company.total_price},'${req.file.filename}','${company.mgmt_id}',`;
      if(company.confirmed === 'on'){
        query_string = query_string + "true)"
      }else {
        query_string = query_string + "false)"
      }
      db.none(query_string).then( () => {
        console.log( "등록성공");

        query_string = `select id from tax_invoices where company = '${company.company_name}' and item_name = '${company.item_name}' and bill_year= '${company.bill_year}' and bill_month = '${company.bill_month}' and mgmt_id = '${company.mgmt_id}'`
        db.manyOrNone(query_string).then((data2) => {
          res.redirect(`/monthly_reports?invoice_type=${company.invoice_type}&year=${company.bill_year}&month=${company.bill_month}`)
        }).catch((err) => {
          cosole.log(query_string)
          console.error( "등록실패:" ,err);
          res.send({result:err});
          res.end()
        })

      }).catch((err) => {
        console.error( "등록실패:" ,err);
        res.send({result:err});
      });

    });

}
