let mysql = require('mysql')

let connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTING,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

connection.connect()

module.exports = connection