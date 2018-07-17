// var popupS = require('popups');
var string_similarity = require('string-similarity')

var parse = require('csv-parse');


module.exports = function(app, fs, db){
  var csvData=[];
  var csvDataIndex={}
  db.manyOrNone("Select * from tax_invoice_companies")
  .then((data) => {
    data.forEach( (item) => {
      console.log(item);
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


  app.get('/similarity', (req,res) => {

    company = req.query.company.replace("주식회사").replace("(주)").trim()
    item = req.query.item.trim()
    site = req.query.site
    var matches = string_similarity.findBestMatch(company+"," +item + "," + site, csvData)
console.log(matches.bestMatch)
    // res.render('string_similarity', {
    //   title: "가장유사한목록",
    //   data: matches.bestMatch
    // });

    res.json({bestMatch: matches.bestMatch.target, ratio: matches.bestMatch.rating*100, id: csvDataIndex[matches.bestMatch.target]})

  })


}
