const connection = require("../utility/sqldb");

const common = {
    showVendor: (req, res) => {
        connection.query("SELECT * FROM tbl_vendor", (error, results, fields) => {
            if (error) {
                console.error("Error executing query: ", error);
                return;
            }
            // console.log('Query results: ', results);
            res.json(results);
        });
    },

    showcustomer: (req, res) => {
        connection.query("SELECT * FROM tbl_customer", (error, results, fields) => {
            if (error) {
                console.error("Error executing query: ", error);
                return;
            }
            res.json(results);
        });
    },
    searchdate: (req, res) => {
        const { date1, date2 } = req.body;

        console.log(date1, date2);

        const sqlQuery = 'SELECT * FROM tbl_customer WHERE cust_date BETWEEN ? AND ?'; // Replace 'your_table_name' with your actual table name and 'date_column' with your date column name

        connection.query(sqlQuery, [date1, date2], (error, result) => {

            if (error) {

                console.error('Error executing query:', error);
                return;
            }

            const customerIds = result.map(customer => customer.cust_id);

            const otherSql = 'SELECT * FROM tbl_customer_details WHERE customer_id IN (?)'

            connection.query(otherSql, [customerIds], (otherError, otherResult) => {

                if (otherError) {
                    console.error('Error executing other query:', otherError);
                    return res.status(500).json({ error: 'Error executing other query' });
                }

                const combinedResults = {
                    result: result,
                    otherResult: otherResult
                };
                res.status(200).json(combinedResults);
            })
        })

    },
};

module.exports = common;