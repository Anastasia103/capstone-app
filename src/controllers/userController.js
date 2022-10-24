let db = require("../util/db")

let postReview = function(req, res){
    console.log("POST /postReview")
    let user_id = req.userInfo.id
    let videogame_id = req.params.gameid
    let rating = req.body.rating
    let description = req.body.description

    let sql = "insert into reviews (user_id, videogame_id, rating, description) values (?, ?, ?, ?)"
    let params = [user_id, videogame_id, rating, description]

    db.query(sql, params, function(err, rows){
        // err.errno 1452 is an error that pops up if the videogame_id does not match a game in the 
        // videogames table. Since its a foreign key in the reviews table a new videogame_id can not be created
        // NOTE: had to add err && err.erno because if an err doesn't happen it broke the code because err.errno did not exist
        // so the code wouldn't complete if there were no errors and break at line 18
        if(err && err.errno == 1452){
            console.log("Game ID does not exist")
            res.json("videogame id does not exist, pick an existing game")
        } 
        // if rating or description is null, this errno 1048 pops up
        else if (err && err.errno == 1048){
         console.log("Missing a field")
         res.json("A field is missing in the body of this request, refer to the documentation")   
        } else if (err && err.errno == 3819){
            console.log("Invalid Review Score")
            res.json("Invalid Review, Rating must be between 0 and 100")   
        } else if(err){
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else {
            console.log("Review Posted")
            res.json("Posted your review")
        }
        //Notes for later 
        //Would it be helpful if a user could only post 1 review per game
        // add a constraint to the database or change a statement in the Javascript??    
    })
}

let getReviews = function (req, res) {
    let user_id = req.userInfo.id
    let sql = "select reviews.id, reviews.videogame_id, videogame.name, reviews.rating, reviews.description from reviews left join videogame on reviews.videogame_id = videogame.id where reviews.user_id = ?"
    let params = [user_id]

    db.query(sql, params, function(err, rows) {
        if(err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else {
          console.log("Showing User Reviews")
          res.json(rows)
        }
    })
}

let deleteReviews = function (req, res) {
  let user_id = req.userInfo.id
  let reviewid = req.params.reviewid
  let sql = "delete from reviews where id = ? and user_id = ?"
  let params = [reviewid, user_id]

  db.query(sql, params, function(err, rows) {
    if(err){
        console.log("failure to complete request", err)
        res.sendStatus(500)
    } else if (rows.affectedRows === 0) {
     console.log("Review or ID did not match any reviews")
     res.json("No Reviews Deleted")
    } else {
        console.log("Delete Reviews")
        res.json(rows)
    }
  })
}

let updateReviews = function(req, res) {
    let user_id = req.userInfo.id
    let reviewid = req.params.reviewid
    let rating = req.body.rating
    let description = req.body.description

    let sql = "update reviews set rating = ?, description = ? where id = ? and user_id = ?"
    let params = [rating, description, reviewid, user_id]

    if(req.body.rating == undefined || req.body.description == undefined){
       console.log ("rating or description is blank") 
       res.json("Must include rating and description")
       return
    }

    db.query(sql, params, function(err, rows){
        if (err && err.errno == 3819){
               console.log("Invalid Review Score")
               res.json("Invalid Review, Rating must be between 0 and 100")   
        } else if(err){
            console.log("failure to complet request", err)
            res.sendStatus(500)
        } else if (rows.affectedRows === 0) {
            console.log("Review or ID did not match any reviews")
            res.json("Review and ID did not match any reviews")
        } else {
            console.log("Item updated")
            res.json("Item updated")
        }
    })
}

let addtoWishList = function(req, res){
    let user_id = req.userInfo.id
    let videogame_id = req.params.gameid
    let played = 0
    // this sql statement makes it so that a duplicate entry can't be made for a user and game
    let sql = "INSERT INTO Users_Games (user_id, videogame_id, played) SELECT ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM Users_Games WHERE user_id= ? AND videogame_id= ? LIMIT 1)"
    let params = [user_id, videogame_id, played, user_id, videogame_id]

    db.query(sql, params, function(err, rows){
        if(err && err.errno == 1452){
            console.log("Game ID does not exist")
            res.json("videogame id does not exist, pick an existing game")
        } else if(err){
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else if (rows.affectedRows === 0) {
            console.log("Duplicate Row")
            res.json("Game is already on your wishlist")
        }else {
            console.log("Posted")
            res.json("Added Game to Wishlist")
        }
    })
}

let updateWishlist = function(req, res) {
    let user_id = req.userInfo.id
    let game_id = req.params.gameid
    let played
    if (req.body.played === "yes"){
     played = 1
    } else if (req.body.played === "no") {
     played = 0 
    } else {
        console.log ("Incorrect input not received")
        res.json("Must put yes or no for played")
        return
    }

    let sql = "update Users_Games set played = ? where user_id = ? and videogame_id = ?"
    let params = [played, user_id, game_id]

    db.query(sql, params, function(err, rows){
        if(err){
            console.log("failure to complet request", err)
            res.sendStatus(500)
        } else if (rows.affectedRows === 0) {
            console.log("Game did not match")
            res.json("Game is not on your wishlist")
        } else {
            console.log("Wishlist Updated")
            res.json("Wishlist Updated")
        }
    }
    )
}

let deletedWishlist = function (req, res) {
    let id = req.userInfo.id
    let game_id = req.params.gameid

    let sql = "delete from Users_Games where user_id = ? and videogame_id = ?"
    let params = [id, game_id]

    db.query (sql, params, function(err, rows){
        if (err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else {
            console.log("Item deleted")
            res.json("Item removed from wishlist")
        }
        })
    }

let getWishlist = function (req, res) {
    let user_id = req.userInfo.id

    let sql = "select Users_Games.videogame_id, videogame.name, Users_Games.played from Users_Games left join videogame on Users_Games.videogame_id = videogame.id where Users_Games.user_id = ?"
    let params = [user_id]

    db.query(sql, params, function(err, rows) {
        if(err) {
            console.log("failure to complete request", err)
            res.sendStatus(500)
        } else {
          console.log("Showing User Wishlist")
          let newRows = rows
        for (let i = 0; i < rows.length; i++) {
            if (newRows[i].played == 0){
                newRows[i].played = "no"
        } else {
            newRows[i].played = "yes"
        }
        }   
          res.json(newRows)
        }
    })
}

module.exports = {postReview, getReviews, deleteReviews, updateReviews, addtoWishList, updateWishlist, deletedWishlist, getWishlist}