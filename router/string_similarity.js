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
  //csvData.push(data);
    //console.log(data)
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

    let company = req.query.company.replace("주식회사").replace("(주)").trim()
    let item = req.query.item.trim()
    let site = req.query.site
    var matches = string_similarity.findBestMatch(company+"," +item + "," + site, csvData)
    console.log(matches.bestMatch)

    res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100, id: csvDataIndex[matches.bestMatch.target]})

  })

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
    console.log(company)
    let check_type = req.query.type
    if(company){
      matches = string_similarity.findBestMatch(company, companies)

      let query_string = `select * from items where company_id = ${companyIndex[matches.bestMatch.target]} and invoice_type = `
      if(chech_typ === "fee"){
        query_string = query_string + "'fee'"
      } else{
        query_string = query_string + "'maintenance'"
      }
      db.manyOrNone(query_stringrp)
      .then((data) => {
        for(var i =0,len = data.length;i<len;i++){
          items.push(data[i].item_name)
          itemIndex[data[i].item_name]=data[i].id
        }
        matches = string_similarity.findBestMatch(item, items)
        res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100, id: itemIndex[matches.bestMatch.target]})

      })
    }else{
      res.json({company_name: "", ratio: 0, id: 0})
    }


  })





}
