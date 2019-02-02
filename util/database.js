const mysql = require('mysql');

mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'orange102938',
    database: 'bamazon'
});

module.exports = mysql;