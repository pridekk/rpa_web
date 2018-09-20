// var popupS = require('popups');
module.exports = function(app, fs, db,upload){

  app.get('/apis/payment_invoices/:id', (req,res) => {
    let id = req.params.id
    let bill_month = req.query.month
    let bill_year = req.query.year

    console.log(req.query)

    db.manyOrNone(`select tx.item_name,tx.bill_month, tx.bill_year, tx.filepath from tax_invoices as tx join (select items.id from items where payment_id = ${id}) as items on tx.tax_invoice_company_id = items.id where bill_month like '%${bill_month}%' and bill_year like '%${bill_year}%' and confirmed = true`)
    .then(( data ) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err)
    });
 })
  app.get('/apis/payment_maintains/:id', (req,res) => {
    let id = req.params.id
    let bill_month = req.query.month
    let bill_year = req.query.year

    console.log(req.query)

    db.manyOrNone(`select tx.item_name,tx.month, tx.year, tx.filepath from maintain_reports as tx join (select items.id from items where payment_id = ${id}) as items on tx.tax_invoice_company_id = items.id where month like '%${bill_month}%' and year like '%${bill_year}%' and confirmed = true`)
    .then(( data ) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err)
    });
 })
  app.get('/apis/company_names', (req,res) => {
    invoice_type = req.query.invoice_type
    company_id = req.query.company_id
    console.log(req.query)

    if(company_id){
        db.manyOrNone(`Select distinct * from items where invoice_type = '${invoice_type}' and company_id = ${company_id} order by item_name`)
        .then((data) => {
          console.log(data)
          res.send(data);
          res.end()
        })
        .catch( (err) => {
          console.log("Error: ", err);
        });
    }else{
      db.manyOrNone(`select * from companies where id in (Select company_id from items where invoice_type = '${invoice_type}') order by company_name`)
      .then((data) => {
        res.send(data);
        res.end()
      })
      .catch( (err) => {
        console.log("Error: ", err);
      });
    }

  });
  app.post('/apis/update_company_orders', (req,res) => {
    let orders = req.body
    console.log(req.body)

    for(var i =0,len = orders["maintenance"].length; i < len;i++){
        db.none(`update items set print_number = ${i+1} where id =${orders["maintenance"][i]}`)
        .then(() =>{
        }).catch( (err) => {
          console.log("Error: ", err);
        });
    }
    for(var i =0,len = orders["fee"].length; i < len;i++){
        db.none(`update items set print_number = ${i+1} where id =${orders["fee"][i]}`)
        .then(() =>{
        }).catch( (err) => {
          console.log("Error: ", err);
        });
    }
    res.send("done")
    res.end();

    // console.log(company_name)
    // if(company_name){
    //   db.manyOrNone(`Select distinct item_name from items where invoice_type = '${invoice_type}' and company_name = '${company_name}'`)
    //   .then((data) => {
    //     res.send(data);
    //     res.end()
    //   })
    //   .catch( (err) => {
    //     console.log("Error: ", err);
    //   });
    // }else{
    //   db.manyOrNone(`Select distinct company_name from items where invoice_type = '${invoice_type}'`)
    //   .then((data) => {
    //     res.send(data);
    //     res.end()
    //   })
    //   .catch( (err) => {
    //     console.log("Error: ", err);
    //   });
  });

  app.post('/apis/fileupload',  upload.single('userfile'),(req,res) => {
    let id = req.query.id
    console.log(req.file)


        db.none(`update items set report_filename = '${req.file.filename}' where id =${id}`)
        .then(() =>{
          req.flash('success', '파일업로드성공.')
          res.redirect('/items')
        }).catch( (err) => {
          console.log("Error: ", err);
        });



  });

  app.post('/apis/resolutions', (req,res) => {
    let resolution = req.body

    console.log(resolution)
    db.none(`insert into resolutions (item_id, number, year, month, date,bill_year, bill_month) values (${resolution.item_id}, ${resolution.number}, ${resolution.year}, ${resolution.month}, ${resolution.date}, ${resolution.bill_year}, ${resolution.bill_month})`)
    .then(() => {
      req.send('insert completed')
    }).catch((err) => {
      console.log(err)
      res.send(err)
    })
  })






}
