const sql = require('mysql');

const connection = sql.createPool({
    host: 'manpuramproddb.cd2ia2mk2bmm.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'QBX1gbx5WQAzS32KjBya',
    database: 'db_audit_tracker',
    port: '3306'
});

module.exports = connection;
//  host: 'manpuramproddb.cd2ia2mk2bmm.ap-south-1.rds.amazonaws.com',
// user: 'admin',
// password: 'QBX1gbx5WQAzS32KjBya',
// password: 'QBX1gbx5WQAzS32KjBya',
// database: 'db_audit_tracker'

// host: 'localhost',
// user: 'root',
// password: '',
// database: 'db_2'