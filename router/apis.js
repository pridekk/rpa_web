// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/apis/company_names', (req,res) => {
    invoice_type = req.query.invoice_type
    company_name = req.query.company_name
    console.log(invoice_type)
    console.log(company_name)
    if(company_name){
      db.manyOrNone(`Select distinct item_name from tax_invoice_companies where invoice_type = '${invoice_type}' and company_name = '${company_name}'`)
      .then((data) => {
        res.send(data);
        res.end()
      })
      .catch( (err) => {
        console.log("Error: ", err);
      });
    }else{
      db.manyOrNone(`Select distinct company_name from tax_invoice_companies where invoice_type = '${invoice_type}'`)
      .then((data) => {
        res.send(data);
        res.end()
      })
      .catch( (err) => {
        console.log("Error: ", err);
      });
    }



  });



}
