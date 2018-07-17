// var popupS = require('popups');
var getIP = require('ipware')().get_ip;
module.exports = function(app, fs, db){

  app.get('/rpa_jobs', (req,res) => {
    db.manyOrNone("Select * from rpa_jobs")
    .then((data) => {
      res.render('rpa_jobs', {
        title: "RPA 작업 리스트",
        data: data
      });
    })
    .catch( (err) => {
      console.log("Error: ", err);
    });

  });

  app.get('/rpa_jobs/new', (req,res) =>{
    res.render('new_rpa_jobs', {
      title: "신규 RPA 작업 등록"
    });
  });
  app.post('/rpa_jobs', (req,res) =>{
    let rpa = req.body;

    console.log(rpa);

    let query_string = `Insert into rpa_jobs (name, creator, username, department, comment) Values (
      '${rpa.name}', '${rpa.creator}', '${rpa.username}', '${rpa.department}', '${rpa.comment}')`;
      console.log(query_string);
    db.none(query_string).then( () => {
      console.log( "등록성공");
      res.redirect('/rpa_jobs');
    }).catch((err) => {
      console.error( "등록실패:" ,err);
      res.redirect('/rpa_jobs/new');
    });
  });
  app.post('/rpa_jobs/add_log', (req,res) =>{
      //console.log(req);
      let rpa = req.body;

      let client_ip =getIP(req);
      console.log(client_ip);
      console.log(rpa);
      let query_string = `Select id from rpa_jobs where name = '${rpa.job_name}'`;
      db.one(query_string)
      .then((data) => {
        //console.log(data);
        query_string = `Insert into rpa_reports (rpa_job_id, client_ip,report_level, detail ) Values (
          '${data.id}', '${client_ip.clientIp.slice(-15)}', '${rpa.report_level}', '${rpa.detail}')`;
        //console.log(query_string);
        db.none(query_string).then( () => {
          //console.log( "등록성공");
          res.send({result:"success"});
        }).catch((err) => {
          //console.error( "등록실패:" ,err);
          res.send({result:"fail"});
        });
      })
      .catch( (err) => {
        console.log("Error: ", err);
        res.send({result:"fail"});
      });

    });

      //


}
