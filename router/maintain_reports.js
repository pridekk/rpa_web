// var popupS = require('popups');
module.exports = function(app, fs, db){

  app.get('/maintain_reports', (req,res) => {

    db.manyOrNone("Select  * \
     from maintain_reports")
    .then((data) => {
      res.render('maintain_reports', {
        title: "유지보수확인서 수신함",
        data: data
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
      res.send(err)
    });

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
}
