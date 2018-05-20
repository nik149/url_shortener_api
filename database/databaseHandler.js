import mysql from 'mysql';
require('dotenv').config();

const dbPoolConfig = {
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,
    connectionLimit : process.env.DB_CONNECTION_LIMIT
};

let numConnectionsInPool = 0;

let pool = mysql.createPool(dbPoolConfig);

pool.on('connection', function (connection) {
    numConnectionsInPool++;
    console.log('NUMBER OF CONNECTION IN POOL : ' + numConnectionsInPool);
});
pool.on('release', function (connection) {
  numConnectionsInPool--;
  console.log('NUMBER OF CONNECTION IN POOL : ' + numConnectionsInPool);
});

var dbHandler = (function () {

    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(err);
            }

            connection.query(query, params, function (err, rows) {
                connection.release();
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, rows);
                }

            });

            connection.on('error', function (err) {
                connection.release();
                callback(err);
            });
        });
    };

    return {
        query: _query
    };
})();

module.exports = dbHandler;


export default dbHandler;
