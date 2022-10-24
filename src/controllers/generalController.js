let db = require("../util/db")

let seeReviews = function(req, res) {
    let game_id = req.params.gameid

    let sql = "select reviews.id, reviews.user_id, reviews.videogame_id, videogame.name, reviews.rating, reviews.description from reviews left join videogame on reviews.videogame_id = videogame.id where reviews.videogame_id = ?"
    let params = [game_id]

    db.query(sql, params, function(err, rows){
        if(err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else{
            console.log("Showing Reviews for a Videogame")
            res.json(rows)
        }
    })
}
let getGamesbyWebReview = function(req, res) {
    let lowestPrice = req.body.lowestPrice
    let highestPrice = req.body.highestPrice
    // will set this to a button in the future
    let sql = "select * from videogame where price >= ? and price <= ? order by web_review desc"
    let params = [lowestPrice, highestPrice]

    db.query(sql, params, function(err, rows) {
        if(err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else if (rows.length === 0) {
          console.log("No games shown")
          res.json ("No games in price range")
        } else {
          console.log("Showing Games by Web Review")
          res.json(rows)
        }
    })
}

let getGamesbyUserReview = function(req, res) {
 let sql = "select reviews.videogame_id, videogame.name, videogame.price, avg(reviews.rating) as User_Rating from reviews left join videogame on reviews.videogame_id = videogame.id group by videogame_id order by avg(reviews.rating) desc"
 
 db.query(sql, function(err, rows) {
    if(err) {
        console.log("failure to complete request", err)
        res.sendStatus(500)
    } else {
      console.log("Showing Games by UserReview")
      res.json(rows)
    }
})
}
module.exports = {seeReviews, getGamesbyWebReview, getGamesbyUserReview}