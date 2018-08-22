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
      if(typeof month === "undefined"){
        let d = new Date()
        d.setMonth(d.getMonth()-1)
        month = d.getMonth() + 1
      }
      if(typeof year === "undefined"){
        let d = new Date()
        d.setMonth(d.getMonth()-1)
        year = d.getFullYear()
      }
      req.session.origin = 'monthly_reports'
      req.session.month = month
      req.session.year = year
      req.session.invoice_type = invoice_type
      console.log("month:", month)

      console.log(req.query)
      if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){
        db.manyOrNone(`select items.id as item_id, * from items left join companies on items.company_id = companies.id where items.disabled = false order by print_number`)
        .then((items) => {
          for(var i =0; i< items.length;i++){
            items[i].invoices = []
            items[i].maintain_reports = []
          }
          db.manyOrNone(`select * from tax_invoices where bill_month like '%${month}%' and bill_year like '%${year}%' and confirmed = true order by id `)
          .then((invoices) => {
            for(var i = 0; i < invoices.length; i++){
              for(var j = 0;j< items.length;j++){
                if (invoices[i].tax_invoice_company_id === items[j].item_id){
                  items[j].invoices.push(invoices[i])
                }
              }
            }
            db.manyOrNone(`select * from maintain_reports where month like '%${month}%' and year like '%${year}%' and confirmed = true order by id desc`)
            .then((maintain_reports) => {
              for(var i = 0; i < maintain_reports.length; i++){
                for(var j = 0;j< items.length;j++){
                  if (maintain_reports[i].tax_invoice_company_id === items[j].item_id){
                    items[j].maintain_reports.push(maintain_reports[i])
                  }
                }

              }
              console.log(items.length)
              res.render('monthly_reports', {
                title: invoice_type,
                items: items,
                invoice_type: invoice_type,
                year: year,
                month: month
              });
            })
          })
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
        db.manyOrNone(`select * from (select * from (select items.id as item_id, * from items left join companies on items.company_id = companies.id where invoice_type='${invoice_type}' and disabled = false ) as items left join
          (select  tax_invoice_company_id, filepath as maintain_file from maintain_reports where month like '%${month}%' and year like '%${year}%' and confirmed = true) as mr on items.item_id = mr.tax_invoice_company_id) as items left join
          (select evidence_date,tax_invoice_company_id, filepath as invoice_file from tax_invoices where bill_month like '%${month}%' and bill_year like '%${year}%' and confirmed = true) as iv on items.item_id = iv.tax_invoice_company_id order by print_number`)
        .then((data) => {
          let json = JSON.stringify(data)

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
                  if(data[i].maintain_file){
                    filepath = __dirname + "/../public/maintain_reports/" + data[i].maintain_file.split('\\').pop()
                    console.log(filepath)
                    zip.addLocalFile(filepath)
                  }
                  if(data[i].invoice_file){
                    filepath = __dirname + "/../public/invoices/" + data[i].invoice_file.split('\\').pop()
                    console.log(filepath)
                    zip.addLocalFile(filepath)
                  }

                }
                zip.writeZip( __dirname + "/../public/maintain_reports/" + "test.zip")
                filename = `invoices_${new Date().format('yyyy_mm_dd_HH_MM_ss')}.zip`
                res.download( __dirname + "/../public/maintain_reports/" + "test.zip", filename, (err) =>{
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
