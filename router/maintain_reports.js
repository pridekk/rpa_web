// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/maintain_reports', (req,res) => {
    console.log(req.query)
    let year = req.query.year
    let month = req.query.month
    if( !year && !month){
      let now = new Date()
      let last_month = new Date(now.getFullYear(), now.getMonth() -1, 1);
      year = last_month.getFullYear()
      month = last_month.getMonth() +1
    }

    console.log(year, month)
    // console.log(new Date().getFullYear())
    if(req.query.displaymode === "on"){
      db.manyOrNone(`select * from maintain_reports where tax_invoice_company_id is null`)
      .then((data) => {
        res.render('maintain_reports', {
          title: "유지보수확인서 수신함",
          data: data,
          year: year,
          month: month
        });
      })
      .catch( (err) => {
        console.log("Error: ", err);
        res.send(err)
      });

    }else{
      db.manyOrNone(`Select  tc.print_number as print_number,mr.id as id  , tc.company_name as company_name, tc.item_name as item_name,
        mr.sender as sender, mr.subject as subject, mr.filepath as filepath , mr.received_at as received_at
        from items as tc left outer join ( select * from maintain_reports where year = '${year}' and month like '%${month}%' ) mr on tc.id = mr.tax_invoice_company_id
        where tc.invoice_type = 'maintenance' order by print_number`)
      .then((data) => {
        res.render('maintain_reports', {
          title: "유지보수확인서 수신함",
          data: data,
          year: year,
          month: month
        });
      })
      .catch( (err) => {
        console.log("Error: ", err);
        res.send(err)
      });
    }


  });
  app.get('/maintain_reports/delete/:id', (req,res) => {
     console.log(req.params.id)
     report_id = req.params.id
     db.none('delete from maintain_reports where id = ' + report_id)
     .then(() => {
       req.flash('success', '삭제성공.')
       res.redirect('back')
     })
     .catch( (err) => {
       console.log("Error: ", err);
       res.send(err)
     });
  })
  app.get('/maintain_report/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.oneOrNone('select * from maintain_reports where id = ' + invoice_id)
     .then((data) => {
       console.log(data)
       db.oneOrNone(`select * from items where id = ${data.tax_invoice_company_id}`)
       .then((data2) =>{
         db.manyOrNone(`select distinct company_name from items where invoice_type = 'maintenance' order by company_name`)
         .then((data3) => {
           res.render('maintain_report', {
             title: "유지보수확인서",
             data: data ,
             maintain_report_company: data2,
             companies: data3,
             expressFlash: req.flash('success')
           });
         })
       })

     })
     .catch( (err) => {
       console.log("Error: ", err);
     });

  })

  app.put('/maintain_report/:id', (req,res) =>{
    invoice_id  = req.params.id
    console.log(req.body)
    maintain_report_company = req.body
    let query_string = `select id from items where company_name = '${maintain_report_company.company_name}' and item_name =
      '${maintain_report_company.item_name}'`
    console.log(query_string)
    db.oneOrNone(query_string)
    .then((data) => {
      console.log(data)
      db.none(`update maintain_reports set tax_invoice_company_id = ${data.id} where id = ${invoice_id}`)
      .then(() => {
        req.flash('success', '수정성공')
        res.redirect('back')
      })
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
      res.end()
    });
  })

}
