// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/tax_invoice_companies', (req,res) => {
    db.manyOrNone("Select * from tax_invoice_companies order by invoice_type, print_number")
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
        fee: fee
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });
  app.get('/tax_invoice_companies/delete/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.none('delete from tax_invoice_companies where id = ' + invoice_id)
     .then(() => {
       res.redirect('back')
     })

  })
  app.get('/tax_invoice_companies/new', (req,res) => {
    res.render('new_tax_invoice_company', {title: '신규 발행 기관 등록'})

  })
  app.post('/tax_invoice_companies', (req,res) =>{
      //console.log(req);
      let company = req.body;

      console.log(company);
      query_string = `Insert into tax_invoice_companies (invoice_type, print_number, company_name, item_name, sent_by, best_match, total_price ) Values (
         '${company.invoice_type}',${company.print_number},'${company.company_name}','${company.item_name}','${company.sent_by}', '${company.best_match}', ${company.total_price})`;
      //console.log(query_string);
      db.none(query_string).then( () => {
        //console.log( "등록성공");
        res.redirect('/tax_invoice_companies')
      }).catch((err) => {
        //console.error( "등록실패:" ,err);
        res.send({result:"fail"});
      });

    });


}
