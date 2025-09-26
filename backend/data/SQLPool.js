const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "34.34.174.49",//process.env.DB_CONNECTION_STRING, //"34.38.112.69",
    user: "connectuser",
    password: `mrJc1za5\\BCPt_8P`,
    database: 'AIDA',
    waitForConnections: true, // Optional, if set to false, it will throw an error when no connections are available.
    connectionLimit: 10,      // Maximum number of connections in the pool.
    queueLimit: 0            // Maximum number of connection requests in the queue (0 means no limit).S
});


function getDBConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) return reject(err);
          resolve(connection);
        });
    });
}


module.exports = {getDBConnection};