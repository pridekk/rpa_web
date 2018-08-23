// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/payments', (req,res) => {
    let search = req.query.search

    let query_string = "Select * from payments "


    if(search){
      query_string = query_string + `where payment_name like '%${search}%' or payment_name_alias like '%${search}%' or payment_code like '%${search}%'`
    }

    console.log(req.flash)
    db.manyOrNone(query_string)
    .then((data) => {
      res.render('payments', {
        title: "결의 리스트",
        payments: data,
        expressFlash: req.flash('success')
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
      res.end()
    });

  });
  app.get('/payments/:id', (req,res) => {
    payment_id = req.params.id
    db.oneOrNone(`Select * from payments where id = ${payment_id}`)
    .then((data) => {
      res.render('payment', {
        title: "결의 수정",
        data: data
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });

  app.put('/payment/:id', (req,res) => {
    payment_id = req.params.id
    //console.log(req)
    //console.log(req.body)
    let payment = req.body;

    console.log(payment);
    query_string = `update payments set payment_name = '${payment.payment_name}',payment_code='${payment.payment_code}', payment_cycle='${payment.payment_cycle}' where id = ${payment_id}`;
    //console.log(query_string);
    db.none(query_string).then( () => {
      req.flash('success', '변경성공.')
      res.redirect('/payments')
    }).catch((err) => {
      //console.error( "등록실패:" ,err);
      res.send(err);
    });
  })
  app.get('/payment/delete/:id', (req,res) => {
     console.log(req.params.id)
     payment_id = req.params.id
     db.none('delete from payments where id = ' + payment_id)
     .then(() => {
       req.flash('success', '삭제성공.')
       res.redirect('back')
     })
  })
  app.get('/payment/new', (req,res) => {
    res.render('new_payment', {title: '신규 결의 등록'})

  })
  app.post('/payments', (req,res) =>{
      //console.log(req);
      let payment = req.body;

      console.log(payment);
      query_string = `Insert into payments (payment_name, payment_code,  payment_cycle ) Values (
         '${payment.payment_name}', '${payment.payment_code}', '${payment.payment_cycle}')`;
      //console.log(query_string);
      db.none(query_string).then( () => {
        //console.log( "등록성공");
        req.flash('success', '등록성공.')
        res.redirect('/payments')
      }).catch((err) => {

        console.error( "등록실패:" ,err);
        res.send(err);
      });

    });


}
