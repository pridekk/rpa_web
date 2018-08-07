// var popupS = require('popups');
var adm_zip = require('adm-zip');
var json2csv = require('json2csv');
var jsonexport = require('jsonexport')
var fields = ['id', 'print_number', 'company_name','item_name', 'total_price', 'diff_price', 'ti_file','tid', 'mid', 'mr_file', 'company_number']


module.exports = function(app, fs, db, companies_map){


    app.get('/monthly_reports', (req,res) =>{
      invoice_type = req.query.invoice_type
      month= req.query.month
      year = req.query.year
      req.session.origin = 'monthly_reports'
      req.session.month = month
      req.session.year = year
      req.session.invoice_type = invoice_type
      console.log(req.query)
      if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
        db.manyOrNone(`select evidence_date, c_id as id, print_number, tic.company_name, tic.item_name, total_price, diff_price,tic.filepath as ti_file,tid, mr.id as mid, mr.filepath as mr_file, company_number
          from ( Select evidence_date,tc.id as c_id, ti.id as tid, tc.print_number as print_number , tc.company_name as company_name, tc.item_name as item_name, tc.total_price as total_price,
	          (ti.total_price - tc.total_price ) as diff_price, company_number, filepath from items as tc left outer join
            (select * from tax_invoices where confirmed = true and bill_month like '%${month}%' and bill_year like '%${year}%') as ti
            on tc.id = ti.tax_invoice_company_id where tc.invoice_type = '${invoice_type}') as tic
            left outer join (select * from maintain_reports where confirmed = true and month like '%${month}%' and year like '%${year}%') as mr on tic.c_id = mr.tax_invoice_company_id order by print_number`)
        .then((data) => {
          console.log(data[1])
          console.log(companies_map[data[1].id])
          res.render('monthly_reports', {
            title: invoice_type,
            data: data,
            invoice_type: invoice_type,
            year: year,
            companies_map: companies_map,
            month: month
          });
        })
        .catch( (err) => {
          console.log("Error: ", err);
        });
      } else {
          res.render("알수없음")
      }

    });
    app.get('/monthly_reports/export', (req,res) =>{
      invoice_type = req.query.invoice_type
      month= req.query.month
      year = req.query.year



      console.log(req.query)
      if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
        db.manyOrNone(`select c_id as id, tic.company_name, tic.item_name, evidence_date, print_number,price,tax, total_price, diff_price,tid, tic.filepath as ti_file, mr.id as mid, mr.filepath as mr_file
          from ( Select evidence_date, tc.id as c_id, ti.id as tid, ti.price, ti.tax, tc.print_number as print_number , tc.company_name as company_name, tc.item_name as item_name, ti.total_price as total_price,
            (ti.total_price - tc.total_price ) as diff_price, company_number, filepath from items as tc left outer join
            (select * from tax_invoices where confirmed = true and bill_month like '%${month}%' and bill_year like '%${year}%') as ti
            on tc.id = ti.tax_invoice_company_id where tc.invoice_type = '${invoice_type}') as tic
            left outer join (select * from maintain_reports where confirmed = true and month like '%${month}%' and year like '%${year}%') as mr on tic.c_id = mr.tax_invoice_company_id order by print_number`)
        .then((data) => {
          let json = JSON.stringify(data)
          // let csv = json2csv.parse(json, {fields:fields})
          // console.log(json)
          // console.log(csv)
          jsonexport(data, (err,csv) => {
            if(err) return console.log(err)
            // console.log(csv)
            fs.writeFile ("maintenance.csv", csv, (err) => {
                if (err) throw err;
                console.log('csv tranform complete');
                console.log(data[0])
                let zip = new adm_zip()
                zip.addLocalFile("maintenance.csv")
                for(var i =0,len=data.length;i<len;i++){
                  if(data[i].mr_file){
                    filepath = __dirname + "/../public/maintain_reports/" + data[i].mr_file.split('\\').pop()
                    console.log(filepath)
                    zip.addLocalFile(filepath)
                  }
                  if(data[i].ti_file){
                    filepath = __dirname + "/../public/invoices/" + data[i].ti_file.split('\\').pop()
                    console.log(filepath)
                    zip.addLocalFile(filepath)
                  }

                }
                zip.writeZip( __dirname + "/../public/maintain_reports/" + "test.zip")
                res.download( __dirname + "/../public/maintain_reports/" + "test.zip", "down.zip", (err) =>{
                  if(err){
                    res.send(err)
                  } else {
                    fs.unlink("maintenance.csv" , (err) => {
                      if(err){
                        console.log(err)
                      }
                    })
                    fs.unlink( __dirname + "/../public/maintain_reports/" + "test.zip", (err) => {
                      if(err) {
                        console.log(err)
                      }
                    })
                    console.log("file download complete")
                  }
                })

              }
            );
          })


          //res.csv([{a:1}, {a:1}])
        })
        .catch( (err) => {
          console.log("Error: ", err);
        });
      } else {
          res.render("알수없음")
      }

    });



}
