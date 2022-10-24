let express = require("express")

let router = express.Router()

let generalController = require("../controllers/generalController")

router.get("/seeReviews/:gameid", generalController.seeReviews)

router.get("/getGamesbyWebReview", generalController.getGamesbyWebReview)

// must put lowestPrice and highestPrice in request
router.get("/getGamesbyUserReview", generalController.getGamesbyUserReview)

module.exports = router