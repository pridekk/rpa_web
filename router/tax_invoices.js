// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/tax_invoices', (req,res) => {

    invoice_type = req.query.invoice_type

    if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
      db.manyOrNone(`Select ti.id as id, tc.sent_by as sent_by , tc.print_number as print_number , tc.company_name as company_name, tc.item_name as item_name, tc.total_price as total_price, \
       ti.company as invoice_company_name, ti.item_name as invoice_item_name, ti.month as invoice_month, \
       ti.day as invoice_day, ti.price as invoice_price, ti.tax as invoice_tax, ti.total_price as invoice_total_price, (tc.total_price - ti.total_price) as diff_price , \
       ti.invoice_filename as filepath, ti.id as invoice_id \
       from tax_invoice_companies as tc left outer join tax_invoices as ti on tc.id = ti.tax_invoice_company_id \
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
            data: data
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
     db.none('update tax_invoices set tax_invoice_company_id = null where id = ' + invoice_id)
     .then(() => {
       res.redirect('back')
     })

  })
  app.get('/tax_invoice/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.oneOrNone('select * from tax_invoices where id = ' + invoice_id)
     .then((data) => {
       console.log(data)
       db.oneOrNone(`select * from tax_invoice_companies where id = ${data.tax_invoice_company_id}`)
       .then((data2) =>{
         db.manyOrNone('select distinct invoice_type from tax_invoice_companies')
         .then((data3) => {
           autos = {}
           // for(var i = 0, len = data2.length; i < len; i++){
           //   console.log(data2[i].company_name)
           // }
           res.render('tax_invoice', {
             title: "세금계산서수정",
             data: data ,
             tax_invoice_company: data2,
             invoice_type: data3
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
    tax_invoice_company = req.body
    let query_string = `select id from tax_invoice_companies where invoice_type = '${tax_invoice_company.invoice_type}'  and company_name = '${tax_invoice_company.invoice_company_name}' and item_name =
      '${tax_invoice_company.invoice_item_name}'`
    console.log(query_string)
    db.oneOrNone(query_string)
    .then((data) => {
      console.log(data)
      db.none(`update tax_invoices set tax_invoice_company_id = ${data.id} where id = ${invoice_id}`)
      .then(() => {
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
