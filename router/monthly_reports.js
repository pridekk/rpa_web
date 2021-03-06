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
	    items[i].resolutions = []
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
	      db.manyOrNone(`select * from resolutions where bill_month =${month} and bill_year = ${year}`)
              .then((resolutions) => {
                console.log("resolution")
                for(var i = 0; i < resolutions.length; i++){
                  for(var j = 0;j< items.length;j++){
                    if (resolutions[i].item_id === items[j].item_id){
                      items[j].resolutions.push(resolutions[i])
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
        db.manyOrNone(`select item_id,company_name, item_name, bill_year, bill_month, print_number, price,tax, invoice_total_price, maintain_file, invoice_file, evidence_date from (select * from (select items.id as item_id, * from items left join companies on items.company_id = companies.id where invoice_type='${invoice_type}' and disabled = false ) as items left join
          (select  tax_invoice_company_id, filepath as maintain_file from maintain_reports where month like '%${month}%' and year like '%${year}%' and confirmed = true) as mr on items.item_id = mr.tax_invoice_company_id) as items left join
          (select bill_year, bill_month, price, tax, total_price as invoice_total_price, evidence_date,tax_invoice_company_id, filepath as invoice_file from tax_invoices where bill_month like '%${month}%' and bill_year like '%${year}%' and confirmed = true) as iv on items.item_id = iv.tax_invoice_company_id order by print_number`)
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

    app.get('/monthly_reports/payments', (req,res) =>{
      invoice_type = req.query.invoice_type
      month= req.query.month
      year = req.query.year
      is_export = req.query.is_export
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
      console.log("month:", month)

      console.log(req.query)
      req.session.invoice_type = invoice_type

      if (invoice_type && ["maintenance", "fee"].indexOf(invoice_type) > -1){

        query = `select * from ( select payments.id as p_id, * from payments join
            (
            select payment_id, count(*) as nums, sum(items.total_price) as items_total, sum(tax_invoices.total_price) as invoices_total from items left join
            	(select * from tax_invoices where bill_month like '%${month}%' and bill_year like '%${year}%') as tax_invoices on items.id = tax_invoices.tax_invoice_company_id where invoice_type = '${invoice_type}' group by payment_id order by payment_id
            ) as item_invoices
            on payments.id = item_invoices.payment_id  order by payment_id ) as payments left join `
        query = query +    `( select * from payment_history where payment_year  like '%${year}%' and payment_month like '%${month}%' ) as history on payments.p_id = history.payment_id order by p_id`
        db.manyOrNone(query)
        .then((items) => {
          console.log(items.length)
          if(is_export) {
            let json = JSON.stringify(items)

            jsonexport(items, (err,csv) => {
              if(err) return console.log(err)
              // console.log(csv)
              filename = `payments_${new Date().format('yyyy_mm_dd_HH_MM_ss')}.csv`
              fs.writeFile (filename, csv, (err) => {
                  if (err) throw err;

                  res.download( filename, filename, (err) =>{
                    if(err){
                      res.send(err)
                    } else {
                      fs.unlink(filename , (err) => {
                        if(err){
                          console.log(err)
                        }
                      })
                      console.log(filename + " download complete")
                    }
                  })

                }
              );
            })

          }else{
            res.render('payment_monthly_reports', {
              invoice_type: invoice_type,
              title: "결의 정리",
              payments: items,
              year: year,
              month: month
            });
          }

        })
        .catch( (err) => {
          res.send(err)
        });
      };
    });



}
