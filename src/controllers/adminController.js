
let db = require("../util/db")


//TESTER ROUTE to make sure admin works
// let hello = function(req,res){
//     console.log("hello() in messages controller")
//     res.send("Hello there admin")
// }

let addGame = function(req, res){
  console.log("POST /addGame")
  let name = req.body.name
  let price = req.body.price
  let web_review = req.body.web_review

  let sql = "insert into videogame (name, price, web_review) values (?, ?, ?)"

  let params = [name, price, web_review]

  db.query(sql, params, function(err, rows){
    if(err){
        console.log("failed to complete request", err)
        res.sendStatus(500)
    } else {
        console.log("Game created", rows)
        res.sendStatus(204)    }
  })
}

let updateGame = function(req, res){
  let name = req.body.name
  let price = req.body.price
  let web_review = req.body.web_review
  let id = req.params.gameid

  let sql = "update videogame set name = ?, price = ?, web_review = ? where id = ?"
  let params = [name, price, web_review, id]

  db.query(sql, params, function(err, rows){
    if(err){
        console.log("failure to complete request", err)
        res.sendStatus(500)
    } else {
        console.log("Item updated", rows)
        res.sendStatus(204)
    }
  })
}

let deleteReview = function (req, res) {
    let id = req.params.reviewid
    let sql = "delete from reviews where id = ?"
    let params = [id]

    db.query (sql, params, function(err, rows){
        if (err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else {
            console.log("Item deleted", rows)
            res.sendStatus(204)
        }
    } )
}

module.exports = {addGame, updateGame, deleteReview}