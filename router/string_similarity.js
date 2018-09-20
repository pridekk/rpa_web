// var popupS = require('popups');
var string_similarity = require('string-similarity')

var parse = require('csv-parse');


module.exports = function(app, fs, db){
  var csvData=[];
  var csvDataIndex={}
  db.manyOrNone("Select * from items")
  .then((data) => {
    data.forEach( (item) => {
      // console.log(item);
      if (item["best_match"] !== null) {
        csvData.push(item["company_name"] +"," + item["best_match"] + "," + item["sent_by"])
        csvDataIndex[item["company_name"] +"," + item["best_match"] + "," + item["sent_by"]] = item["id"]
      } else {
        csvData.push(item["company_name"] +"," + item["item_name"] + "," + item["sent_by"])
        csvDataIndex[item["company_name"] +"," + item["item_name"] + "," + item["sent_by"]] = item["id"]
      }

    });
  })
  .catch( (err) => {
    console.log("Error: ", err);
  });

  var companies=[], companyIndex={}, items=[],itemIndex={};

  db.manyOrNone("select * from companies")
  .then((data) => {
    for(var i =0,len = data.length;i<len;i++){
      companies.push(data[i].company_name)
      companyIndex[data[i].company_name]=data[i].id
    }
  })


  app.get('/similarity', (req,res) => {
    let company = req.query.company.trim()
    let item = req.query.item.replace(/\d+/g, '.').trim()
    let site = req.query.site.trim()
    console.log(req.query)
    // query_string = `select * from invoice_mappings where company_name = '${company}' and item_name = '${item}' and site = '${site}'`

    query_string = `select * from tax_invoices where company = '${company}' and item_name_alias = '${item}' and site = '${site}' and confirmed = true order by id desc limit 1`
    db.oneOrNone(query_string)
    .then((data) => {
      console.log(data)
      if( data === null || data.length === 0 ){
        var matches = string_similarity.findBestMatch(company+"," +item + "," + site, csvData)
        console.log(matches.bestMatch)
	query_string = `select * from items where id = ${csvDataIndex[matches.bestMatch.target]}`	
        db.oneOrNone(query_string).then((data2) => {
          res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100,invoice_type: data2.invoice_type, id: csvDataIndex[matches.bestMatch.target]})
        })
      }else{
	query_string = `select * from items where id = ${data.tax_invoice_company_id}`	
        db.oneOrNone(query_string).then((data2) => {
          res.json({bestMatch: `${data.company}, ${data.item_name}` , ratio: 100, invoice_type: data2.invoice_type, id: data.tax_invoice_company_id})
        })
      }

    })


  })
  app.get('/similarity/maintain', (req,res) => {

    let sender = req.query.sender
    let subject = req.query.subject
    let filename = req.query.filename

    let query = `select tax_invoice_company_id as id from maintain_reports where sender like '%${sender}%' order by id desc limit 1`

    db.oneOrNone(query).then( (data) => {
	console.log(data)
	if(data && data.id !== null ){

		query = `select * from items where id = ${data.id}`
	}else{
		query = `select * from items limit 1`

	}
	db.oneOrNone(query).then( (item) => {
	  res.json(item)
	})
    })
    .catch( (err) => {
	console.log(err)
   	res.send(err)
    });  
  });

  app.get('/similarity/company/:company_name', (req,res) => {

    let company = req.params.company_name.replace("주식회사").replace("(주)").trim()
    console.log(company)
    var matches = string_similarity.findBestMatch(company, companies)
    console.log(matches.bestMatch)

    res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100, id: companyIndex[matches.bestMatch.target]})

  })
  app.get('/similarity/item/:item_name', (req,res) => {
    let matches
    let items =[]
    let itemIndex={}
    let item = req.params.item_name.replace("유지보수").replace("계약").trim()
    let company = req.query.company
    console.log(req.query)
    console.log(item)
    let check_type = req.query.type
    if(company){
      matches = string_similarity.findBestMatch(company, companies)

      let query_string = `select * from items where company_id = ${companyIndex[matches.bestMatch.target]} and invoice_type = `
      if(check_type === "fee"){
        query_string = query_string + "'fee'"
      } else{
        query_string = query_string + "'maintenance'"
      }
      console.log(query_string)
      db.manyOrNone(query_string)
      .then((data) => {
        console.log(data)
        if(data.length === 0 ){
          res.json({company_name: "", ratio: 0, id: 0})
        }else{
          for(var i =0,len = data.length;i<len;i++){
            items.push(data[i].item_name)
            itemIndex[data[i].item_name]=data[i].id
          }
          matches = string_similarity.findBestMatch(item, items)
          res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100, id: itemIndex[matches.bestMatch.target]})

        }

      })
    }else{
      res.json({company_name: "", ratio: 0, id: 0})
    }


  })





}
