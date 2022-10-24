let express = require("express")

let router = express.Router()

let auths = require("../middleware/auth")

let adminController = require("../controllers/adminController")


//tester route for admin authentication
// router.get("/adminhello", auths.checkJWT, auths.checkAdmin, adminController.hello)

//add Game into videogames table by putting name, price and web_review into body
router.post("/addGame", auths.checkJWT, auths.checkAdmin, adminController.addGame)

//update Game into videogames table py the game id into the route and butting name, price and web_review into body
router.put("/updateGame/:gameid", auths.checkJWT, auths.checkAdmin, adminController.updateGame)

// delete a user review from review table by putting the rating id into the route
router.delete("/adminDeleteReview/:reviewid", auths.checkJWT, auths.checkAdmin, adminController.deleteReview)

module.exports = router