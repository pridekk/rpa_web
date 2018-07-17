// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/tax_invoice_issuers', (req,res) => {

    console.log(req.flash)
    db.manyOrNone("Select * from tax_invoice_issuers")
    .then((data) => {
      res.render('tax_invoice_issuers', {
        title: "세금계산서 발행 Site 리스트",
        data: data,
        expressFlash: req.flash('success')
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
      res.end()
    });

  });
  app.get('/tax_invoice_issuer/:id', (req,res) => {
    issuer_id = req.params.id
    db.oneOrNone(`Select * from tax_invoice_issuers where id = ${issuer_id}`)
    .then((data) => {
      res.render('tax_invoice_issuer', {
        title: "세금계산서 발행 Site 수정",
        data: data
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });

  app.put('/tax_invoice_issuer/:id', (req,res) => {
    issuer_id = req.params.id
    //console.log(req)
    //console.log(req.body)
    let issuer = req.body;

    console.log(issuer);
    query_string = `update tax_invoice_issuers set issuer_name = '${issuer.name}', mail_subject='${issuer.subject}', mail_body='${issuer.body}' where id = ${issuer_id}`;
    //console.log(query_string);
    db.none(query_string).then( () => {
      req.flash('success', '변경성공.')
      res.redirect('/tax_invoice_issuers')
    }).catch((err) => {
      //console.error( "등록실패:" ,err);
      res.send({result:"fail"});
    });
  })
  app.get('/tax_invoice_issuer/delete/:id', (req,res) => {
     console.log(req.params.id)
     invoice_id = req.params.id
     db.none('delete from tax_invoice_issuers where id = ' + invoice_id)
     .then(() => {
       req.flash('success', '삭제성공.')
       res.redirect('back')
     })
  })
  app.get('/tax_invoice_issuers/new', (req,res) => {
    res.render('new_tax_invoice_issuer', {title: '신규 발행 기관 등록'})

  })
  app.post('/tax_invoice_issuers', (req,res) =>{
      //console.log(req);
      let issuer = req.body;

      console.log(issuer);
      query_string = `Insert into tax_invoice_issuers (issuer_name, mail_subject, mail_body ) Values (
         '${issuer.name}', '${issuer.subject}', '${issuer.body}')`;
      //console.log(query_string);
      db.none(query_string).then( () => {
        //console.log( "등록성공");
         req.flash('success', '등록성공.')
        res.redirect('/tax_invoice_issuers')
      }).catch((err) => {

        //console.error( "등록실패:" ,err);
        res.send({result:"fail"});
      });

    });


}
