let express = require("express")

let router = express.Router()

let authController = require("../controllers/authController")

//used for both admins and regular users
router.post("/register", authController.register)

router.post("/login", authController.login)


module.exports = router