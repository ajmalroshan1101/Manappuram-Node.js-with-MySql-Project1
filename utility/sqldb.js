const sql = require('mysql');

const port = 3306

const connection = sql.createPool({
    // host: 'manpuramproddb.cd2ia2mk2bmm.ap-south-1.rds.amazonaws.com',
    // user: 'admin',
    // password: 'QBX1gbx5WQAzS32KjBya',
    // database: 'db_audit_tracker',

    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'db_2'

    host: 'database-1.cnqsccui2i3c.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'DkcSg3ZGtvd6GUmR7lCm',
    database: 'mysql_table',

    port: parseInt(port, 10)


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