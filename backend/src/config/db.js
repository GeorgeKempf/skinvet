const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1a2s3d4f",
    database: "skinvet"
});

module.exports = pool;