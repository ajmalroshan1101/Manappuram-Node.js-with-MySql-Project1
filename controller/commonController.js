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

        const sqlQuery =
            "SELECT * FROM tbl_customer WHERE cust_date BETWEEN ? AND ?";

        connection.query(sqlQuery, [date1, date2], (error, result) => {
            if (error) {
                console.error("Error executing query:", error);
                return;
            }

            //Extract the customerid from the result array of tbl_customer
            const customerIds = result.map((customer) => customer.cust_id);

            //This is to find other customer details
            const otherSql =
                "SELECT * FROM tbl_customer_details WHERE customer_id IN (?)";

            connection.query(otherSql, [customerIds], (otherError, otherResult) => {
                if (otherError) {
                    console.error("Error executing other query:", otherError);
                    return res.status(500).json({ error: "Error executing other query" });
                }

                const combinedResults = {
                    result: result,
                    otherResult: otherResult,
                };
                res.status(200).json(combinedResults);
            });
        });
    },
    searchoder: (req, res) => {
        const { date1, date2 } = req.body;

        console.log(date1, date2);

        const mySql =
            "SELECT * FROM tbl_order_creation  WHERE created_date BETWEEN ? AND ?";

        connection.query(mySql, [date1, date2], (error, result) => {
            if (error) {
                console.error("Error executing query:", error);
                return;
            }

            const orderId = result.map((order) => order.order_id);

            const otherMySql =
                "SELECT * FROM tbl_hm_order_details WHERE hm_order_id IN (?)";

            connection.query(otherMySql, [orderId], (otherError, otherResult) => {
                if (otherError) {
                    console.error("Error executing other query:", otherError);
                    return res.status(500).json({ error: "Error executing other query" });
                }

                const groupByOrderId = {};

                // Group otherResult data by hm_order_id
                otherResult.forEach((detail) => {
                    if (!groupByOrderId[detail.hm_order_id]) {
                        groupByOrderId[detail.hm_order_id] = [];
                    }
                    groupByOrderId[detail.hm_order_id].push(detail);
                });

                // Merge data from result with data from otherResult
                const mergedData = result.map((order) => {
                    const details = groupByOrderId[order.order_id] || []; // Get corresponding details for the order_id, or an empty array if not found
                    return {...order, otherOrderDetails: details };
                });

                const customerIds = result.map((order) => order.customer_id);
                //This is find customer from the tbl_customer table
                const customer = "SELECT * FROM tbl_customer WHERE cust_id IN (?)";

                connection.query(
                    customer, [customerIds],
                    (otherError, customerDetails) => {
                        if (otherError) {
                            console.error("Error executing other query:", otherError);
                            return res
                                .status(500)
                                .json({ error: "Error executing other query" });
                        }
                        // console.log(customerDetails);

                        //Here we are maping the cust_id from the tbl_customer for finding the customer details
                        const otherCustomerDetailsid = customerDetails.map(
                            (cust) => cust.cust_id
                        );

                        //Here where we are searching for the customer_detais
                        const otherCustomer_details =
                            "SELECT * FROM tbl_customer_details WHERE customer_id IN (?)";

                        connection.query(
                            otherCustomer_details, [otherCustomerDetailsid],
                            (otherError, allDetails) => {
                                if (otherError) {
                                    console.error("Error executing other query:", otherError);
                                    return res
                                        .status(500)
                                        .json({ error: "Error executing other query" });
                                }

                                // console.log(allDetails);

                                // Merge customerDetails with allDetails based on cust_id and customer_id
                                const mergedDataOfCustomer = customerDetails.map((customer) => {
                                    const details = allDetails.find(
                                        (detail) => detail.customer_id === customer.cust_id
                                    );
                                    return {...customer, ...details };
                                });

                                console.log(mergedDataOfCustomer);

                                const finalMergedData = mergedData.map((order) => {
                                    const customer = mergedDataOfCustomer.find(
                                        (customer) => customer.cust_id === order.customer_id
                                    );
                                    return {...order, ...customer };
                                });

                                console.log(finalMergedData);
                                res.json(finalMergedData);
                            }
                        );
                    }
                );
            });
        });
    },
    searchoder1: (req, res) => {
        const { date1, date2 } = req.body;

        console.log(date1, date2);

        const mySql =
            `SELECT *  
        FROM tbl_order_creation  
        LEFT JOIN tbl_hm_order_details ON tbl_order_creation.order_id = tbl_hm_order_details.hm_order_id 
        LEFT JOIN tbl_style ON tbl_style.style_id = tbl_hm_order_details.hm_style_code
        LEFT JOIN tbl_customer ON tbl_customer.cust_id = tbl_order_creation.customer_id
        LEFT JOIN tbl_customer_details ON tbl_customer_details.customer_id = tbl_customer.cust_id
        WHERE tbl_order_creation.created_date BETWEEN ? AND ?`;


        connection.query(mySql, [date1, date2], (error, result) => {
            if (error) {
                console.error("Error executing query:", error);
                return;
            }

            console.log(result);

            res.json(result)
        });
    },
};

module.exports = common;