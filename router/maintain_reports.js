// var popupS = require('popups');
module.exports = function(app, fs, db, upload){


  app.get('/maintain_reports', (req,res) => {

    req.session.origin = 'maintain_reports'
    let is_archive = req.query.is_archive
    let search = req.query.search

    let query_string = null
    if (is_archive === 'on'){
      query_string = "Select  * from maintain_reports where 1 = 1"
    }else{
      query_string = "Select  * from maintain_reports where confirmed = false"
    }

    if(search){
      query_string = query_string + ` and (company_name like '%${search}%' or item_name like '%${search}%' or subject like '%${search}%')`
    }
    query_string = query_string + ' order by id desc'

    db.manyOrNone(query_string)
    .then((data) => {
      res.render('maintain_reports', {
        title: "유지보수확인서 수신함",
        data: data,
        is_archive: is_archive

      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
    });

  })
  app.get('/maintain_reports/back', (req,res) => {

    data = req.session
    if(req.session.origin === 'monthly_reports'){
      res.redirect(`/monthly_reports?invoice_type=${data.invoice_type}&month=${data.month}&year=${data.year}`)
    }else{
      res.redirect("/maintain_reports")
    }


  });


  app.get('/maintain_reports/defined', (req,res) => {
    console.log(req.query)
    let year = req.query.year || new Date().format('yyyy')
    let month = req.query.month || new Date().format('mm')
    req.session.origin = 'maintain_reports'
    if( year && month){
      db.manyOrNone(`Select  tc.print_number as print_number,mr.id as id  , tc.company_name as company_name, tc.item_name as item_name,
        mr.sender as sender, mr.subject as subject, mr.filepath as filepath , mr.received_at as received_at
        from items as tc left outer join ( select * from maintain_reports where year = '${year}' and month like '%${month}%' and confirmed= true) mr on tc.id = mr.tax_invoice_company_id
        where tc.invoice_type = 'maintenance'  order by print_number`)
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
    } else {
      db.manyOrNone(`Select  mr.id as id  , tc.company_name as company_name, tc.item_name as item_name,
        mr.sender as sender, mr.subject as subject, mr.filepath as filepath , mr.received_at as received_at
        from items as tc join ( select * from maintain_reports where confirmed = false) mr on tc.id = mr.tax_invoice_company_id
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
     console.log(req.headers.referer)
     report_id = req.params.id


     query_string = `select * from maintain_reports where id = ${report_id}`
     db.oneOrNone(query_string)
     .then((data) => {
       console.log(__dirname)

       if(data.filepath){
         let filename = __dirname + "/../public/maintain_reports/" + data.filepath.split('\\').pop()
         fs.stat(filename, (err, stats) => {
           if(err){
             console.log(err);
           } else{
             fs.unlink( filename, (err) => {
               if(err){
                  console.log(err);
               }else{
                 console.log(`${filename} has been deleted`)
               }
             })
           }

         })
       }
       console.log(data)

       db.none('delete from maintain_reports where id = ' + report_id)
       .then(() => {
         req.flash('success', '삭제성공.')
         if(req.session.origin === "monthly_reports"){
           res.redirect(`/monthly_reports?invoice_type=maintenance&month=${data.month}&year=${data.year}`)
         } else if (req.headers.referer.includes("maintain_reports") ) {
           res.redirect(req.headers.referer)
         }else {
           res.redirect("/maintain_reports")
         }

       })
       .catch( (err) => {
         console.log("Error: ", err);
         res.send(err)
       });
     })
  })
  app.get('/maintain_report/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.oneOrNone('select * from maintain_reports where id = ' + invoice_id)
     .then((data) => {
       console.log(data)
       db.oneOrNone(`select * from items where id = ${data.tax_invoice_company_id}`)
       .then((data2) =>{
         db.manyOrNone(`select * from companies where id in (select id from items where invoice_type = 'maintenance') order by company_name`)
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
    report = req.body
    if(report.confirmed === 'on'){
      report.confirmed = true
    } else {
      report.confirmed = false
    }
    if(report.item_id){
      db.none(`update maintain_reports set tax_invoice_company_id = ${report.item_id}, month= '${report.bill_month}',year= '${report.bill_year}', confirmed= ${report.confirmed}   where id = ${invoice_id}`)
      .then(() => {
        req.flash('success', '수정성공')
        res.redirect('back')
      })
      .catch( (err) => {
        console.log("Error: ", err);
        res.send(err)
        res.end()
      });
    } else {

        db.none(`update maintain_reports set month= '${report.bill_month}',year= '${report.bill_year}', confirmed= ${report.confirmed} where id = ${invoice_id}`)
        .then(() => {
          req.flash('success', '수정성공')
          res.redirect('back')
        })

    }

  })
  app.get('/maintain_reports/new', (req,res) => {
    data = req.query
    tax_invoice_company = null
    res.render('new_maintain_report', {title: '신규 업체 등록', data, tax_invoice_company })

  })

  app.post('/maintain_reports', upload.single('userfile'), (req,res) =>{
      //console.log(req)
      let company = req.body;
      console.log(company)
      query_string = `insert into maintain_reports (company_name, tax_invoice_company_id, item_name,year, month, filepath, confirmed ) Values (
         '${company.company_name}',${company.tax_invoice_company_id},'${company.item_name}','${company.bill_year}',
         '${company.bill_month}','${req.file.filename}',`;
      if(company.confirmed === 'on'){
        query_string = query_string + "true)"
      }else {
        query_string = query_string + "false)"
      }
      db.none(query_string).then( () => {
        console.log( "등록성공");

        query_string = `select id from maintain_reports where company_name = '${company.company_name}' and item_name = '${company.item_name}' and year= '${company.bill_year}' and month = '${company.bill_month}'`
        db.manyOrNone(query_string).then((data2) => {
          res.redirect(`/monthly_reports?invoice_type=maintenance&year=${company.bill_year}&month=${company.bill_month}`)
        }).catch((err) => {
          console.error( "등록실패:" ,err);
          res.send({result:err});
          res.end()
        })

      }).catch((err) => {
        console.log(query_string)
        console.error( "등록실패:" ,err);
        res.send({result:err});
      });

    });


}
