const sql = require('mysql');

const connection = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_2'
});

module.exports = connection;