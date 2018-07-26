// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/companies', (req,res) => {
    let search = req.query.search

    let query_string = "Select * from companies "


    if(search){
      query_string = query_string + `where company_name like '%${search}%' or company_name_alias like '%${search}%' or company_number like '%${search}%'`
    }

    console.log(req.flash)
    db.manyOrNone(query_string)
    .then((data) => {
      res.render('companies', {
        title: "업체 리스트",
        companies: data,
        expressFlash: req.flash('success')
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
      res.end()
    });

  });
  app.get('/company/:id', (req,res) => {
    company_id = req.params.id
    db.oneOrNone(`Select * from companies where id = ${company_id}`)
    .then((data) => {
      res.render('company', {
        title: "업체 수정",
        data: data
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });

  app.put('/company/:id', (req,res) => {
    company_id = req.params.id
    //console.log(req)
    //console.log(req.body)
    let company = req.body;

    console.log(company);
    query_string = `update companies set company_name = '${company.company_name}', company_name_alias='${company.company_name_alias}', mail='${company.body}', company_number = '${company.company_number}' where id = ${company_id}`;
    //console.log(query_string);
    db.none(query_string).then( () => {
      req.flash('success', '변경성공.')
      res.redirect('/companies')
    }).catch((err) => {
      //console.error( "등록실패:" ,err);
      res.send(err);
    });
  })
  app.get('/company/delete/:id', (req,res) => {
     console.log(req.params.id)
     company_id = req.params.id
     db.none('delete from companies where id = ' + company_id)
     .then(() => {
       req.flash('success', '삭제성공.')
       res.redirect('back')
     })
  })
  app.get('/companies/new', (req,res) => {
    res.render('new_company', {title: '신규 업체 등록'})

  })
  app.post('/companies', (req,res) =>{
      //console.log(req);
      let company = req.body;

      console.log(company);
      query_string = `Insert into companies (company_name, company_name_alias, mail, company_number ) Values (
         '${company.company_name}', '${company.company_name_alias}', '${company.mail}',  '${company.company_number}')`;
      //console.log(query_string);
      db.none(query_string).then( () => {
        //console.log( "등록성공");
        req.flash('success', '등록성공.')
        res.redirect('/companies')
      }).catch((err) => {

        console.error( "등록실패:" ,err);
        res.send(err);
      });

    });


}
