const sql = require('mysql');

const connection = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp'
});

module.exports = connection;