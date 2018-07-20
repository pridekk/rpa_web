// var popupS = require('popups');
module.exports = function(app, fs, db,upload){

  app.get('/apis/company_names', (req,res) => {
    invoice_type = req.query.invoice_type
    company_name = req.query.company_name
    console.log(invoice_type)
    console.log(company_name)
    if(company_name){
      db.manyOrNone(`Select distinct item_name from items where invoice_type = '${invoice_type}' and company_name = '${company_name}'`)
      .then((data) => {
        res.send(data);
        res.end()
      })
      .catch( (err) => {
        console.log("Error: ", err);
      });
    }else{
      db.manyOrNone(`Select distinct company_name from items where invoice_type = '${invoice_type}'`)
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
          res.redirect('/tax_invoice_companies')
        }).catch( (err) => {
          console.log("Error: ", err);
        });



  });






}
