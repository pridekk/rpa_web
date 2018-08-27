var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var method_override = require('method-override')
var fs = require('fs')
var pgp = require('pg-promise')();

var db2 = pgp("postgres://general_affairs:chdanqn00&@localhost/general_affairs")
var flash = require('express-flash')
var multer = require('multer')
var csv = require('csv-express')
require('x-date')


if (process.argv.length >2){
  ip = process.argv[2]
} else {
  ip = "127.0.0.1"
}
console.log(ip)
var invoice_storage = multer.diskStorage({
  destination: (req,file,cb) => {
    console.log(file)
    cb(null, 'public/invoices/')
  },
  filename: (req,file,cb) => {
    console.log(file)
    f_name = `invoice_${new Date().format('yyyy_mm_dd_HH_MM_ss')}_${Math.floor(Math.random()*10000)}.${file.mimetype.split("/").pop()}`
    console.log(f_name)
    cb(null, f_name )
  }

})
var maintain_report_storage = multer.diskStorage({
  destination: (req,file,cb) => {
    console.log(file)
    cb(null, 'public/maintain_reports/')
  },
  filename: (req,file,cb) => {
    console.log(file)
    f_name =  `maintain_${new Date().format('yyyy_mm_dd_HH_MM_ss')}_${Math.floor(Math.random()*10000)}.${file.mimetype.split("/").pop()}`
    console.log(f_name)
    cb(null, f_name )
  }
})
var items_storage = multer.diskStorage({
  destination: (req,file,cb) => {
    console.log(file)
    cb(null, 'public/items/')
  },
  filename: (req,file,cb) => {
    console.log(file)
    f_name =  `items_${new Date().format('yyyy_mm_dd_HH_MM_ss')}_${Math.floor(Math.random()*10000)}.${file.mimetype.split("/").pop()}`
    console.log(f_name)
    cb(null, f_name )
  }
})

var invoice_upload = multer({storage:invoice_storage})
var maintain_report_upload = multer({storage:maintain_report_storage})
var item_upload = multer({storage:items_storage})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(method_override('_method'))
app.use(session({
  secret: 'testateatawtta',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.listen(5001,ip,  ()=>{console.log("server start on 5001");})
var companies_map = {}
var issuers_map = {}
var companies_list = []
var issuers_list = []
db2.manyOrNone("Select * from companies order by company_name")
.then((data) => {
  for(var i =0, len=data.length; i <len;i++){
      companies_map[data[i].id] = data[i]
      companies_list.push(data[i])
    }
    console.log(companies_map)
})
.catch( (err) => {
  //res.send(err)
  console.log("Error: ", err);
});
db2.manyOrNone("Select * from tax_invoice_issuers order by issuer_name")
.then((data) => {
  for(var i =0, len=data.length; i <len;i++){
      issuers_map[data[i].id] = data[i]
      issuers_list.push(data[i])
    }
})
.catch( (err) => {
  //res.send(err)
  console.log("Error: ", err);
});

var main = require('./router/main')(app,fs);
var tax_invoices = require('./router/tax_invoices')(app,fs, db2, invoice_upload,companies_map);
var string_similarity = require('./router/string_similarity')(app,fs, db2);
var tax_invoice_issuers = require('./router/tax_invoice_issuers')(app, fs, db2);
var items = require('./router/items')(app, fs, db2, item_upload);
var apis = require('./router/apis')(app, fs, db2,invoice_upload);
var maintain_reports = require('./router/maintain_reports')(app, fs, db2,maintain_report_upload);
var monthly_reports = require('./router/monthly_reports')(app, fs, db2,companies_map);
var companies = require('./router/companies')(app,fs,db2)
var payments = require('./router/payments')(app,fs,db2)
