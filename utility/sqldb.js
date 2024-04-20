const sql = require('mysql');

const port = 3306

const connection = sql.createPool({

    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'test'

    host: 'database-1.cnqsccui2i3c.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'DkcSg3ZGtvd6GUmR7lCm',
    database: 'demo',


    port: parseInt(port, 10)

    // host: 'database-1.cd2ia2mk2bmm.ap-south-1.rds.amazonaws.com',
    // user: 'admin',
    // password: 'AkYCEcZ3G9Tz',
    // database: 'demo',


    // port: parseInt(port, 10)


});




module.exports = connection;

// host: 'localhost',
// user: 'root',
// password: '',
// database: 'db_2'