let express = require("express")
require("dotenv").config()

let port = process.env.PORT || 8080

let app = express()

app.listen(port, function(){
    console.log("app running on port",port)
})

app.use(express.json())

let authRoute = require("./routes/authRoutes")
let adminRoute = require("./routes/adminRoutes")
let userRoute = require("./routes/userRoutes.js")
let generalRoute = require("./routes/generalRoutes")

let something = process.env.MYSQL_HOST

app.use(authRoute)
app.use(adminRoute)
app.use(userRoute)
app.use(generalRoute)


app.use("/hello", function(req, res){
    res.send("Hello Internet and Dad Charles and Jackie " + something)
})

app.use("/goodbye", function(req, res){
    res.send("Goodbye Internet")
})
