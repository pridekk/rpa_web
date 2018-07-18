var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var method_override = require('method-override')
var fs = require('fs')
var pgp = require('pg-promise')();
var db = pgp("postgres://rpa:rpa2018.@localhost/rpa");
var db2 = pgp("postgres://general_affairs:chdanqn00&@localhost/general_affairs")
var session = require('express-session')
var flash = require('express-flash')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req,file,cb) => {
    console.log(file)
    f_name = `${Date.now()}${Math.floor(Math.random()*10000)}.${file.mimetype.split('/')[1]}`
    console.log(f_name)
    cb(null, f_name )
  }
})
var upload = multer({storage:storage})

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
app.listen(5001, ()=>{console.log("server start on 5001");})
var main = require('./router/main')(app,fs);
var rpa_jobs = require('./router/rpa_jobs')(app, fs, db);
var tax_invoices = require('./router/tax_invoices')(app,fs, db2);
var string_similarity = require('./router/string_similarity')(app,fs, db2);
var tax_invoice_issuers = require('./router/tax_invoice_issuers')(app, fs, db2);
var tax_invoice_companies = require('./router/tax_invoice_companies')(app, fs, db2, upload);
var apis = require('./router/apis')(app, fs, db2,upload);
var maintain_reports = require('./router/maintain_reports')(app, fs, db2);
