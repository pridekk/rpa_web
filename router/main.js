module.exports = function(app, fs){
  app.get('/', (req,res) =>{
    res.render('index', { title: "RPA HOME"});
    console.log(req.session)
    req.session.test = "test"
  });
}
