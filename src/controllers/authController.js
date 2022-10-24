let db = require("../util/db")

let argon2 = require("argon2")
let jwt = require("jsonwebtoken")

// we expect in the body an object that contains the username and password and full name
// {"username": "anastasia", "password": "Bobisgreat!!", and fullName:"Ana Creek"}
// also optionally admin: "true" will make them an admin
let register = async function (req, res){
    let name = req.body.name
    let username = req.body.username
    let password = req.body.password
    let admin
    if (req.body.admin != "true") {
      admin = 0
    } else {
      admin = 1
    }
   

    let passwordHash

    try {
        passwordHash = await argon2.hash(password)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    
    let sql = "insert into videogameUsers (name, username, pwd_hash, isAdmin) values (?, ?, ?, ?)"
    let params = [name, username, passwordHash, admin]

    db.query (sql, params, function (err, rows){
        if(err){
            console.log("Unable to register")
            if(err.code == "ER.DUP_ENTRY"){
                res.sendStatus(400)
            } else {
                console.log(err)
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(204)
        }
    })
}

let login = function(req, res){
    let username = req.body.username
    let password = req.body.password

    let sql = "select id, name, pwd_hash, isAdmin from videogameUsers where username = ?"
    let params = [username]

    db.query(sql, params, async function(err, rows){
        if(err){
            console.log("Could not get password hash", err)
            res.sendStatus(500)
        } else {
            if(rows.length > 1) {
                console.log("Returned too many rows for username", username)
                res.sendStatus(500)
            } else if (rows.length == 0){
                res.sendStatus(400)
            } else {
                let pwdHash = rows[0].pwd_hash
                let fnName = rows[0].name
                let userID = rows[0].id
                let admin = rows[0].isAdmin

                let pass = false
                
                try { 
                    pass = await argon2.verify(pwdHash, password)
                } catch (err){
                    console.log("Failed to verify password", err)
                }
                if (pass){
                    let token = {
                        "id": userID, 
                        "fullName": fnName,
                        "IsAdmin": admin
                    }
                    
                    let signedToken = jwt.sign(token, process.env.JWT_SECRET)

                    res.json(signedToken)
                } else {
                    res.sendStatus(400)
                }
            }
        }
    })}



module.exports = {register, login}