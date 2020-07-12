const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'MarvelBot'
});
module.exports = pool.promise();