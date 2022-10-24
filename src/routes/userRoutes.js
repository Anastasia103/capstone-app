let express = require("express")

let router = express.Router()

let auths = require("../middleware/auth")

let userController = require("../controllers/userController")

// by putting the game id in the request and rating and description in the body, post a review in the reviews table
router.post("/postReview/:gameid", auths.checkJWT, userController.postReview)

// route to get all reviews the user has posted, to make the following routes easier
router.get("/userReviews", auths.checkJWT, userController.getReviews)

router.delete("/deleteMyReviews/:reviewid", auths.checkJWT, userController.deleteReviews)

router.put("/updateMyReview/:reviewid", auths.checkJWT, userController.updateReviews)

router.post("/addtoWishlist/:gameid", auths.checkJWT, userController.addtoWishList)

router.put("/updateWishlist/:gameid", auths.checkJWT, userController.updateWishlist)

router.delete("/deleteWishlist/:gameid", auths.checkJWT, userController.deletedWishlist)

router.get("/Wishlist", auths.checkJWT, userController.getWishlist)

module.exports = router