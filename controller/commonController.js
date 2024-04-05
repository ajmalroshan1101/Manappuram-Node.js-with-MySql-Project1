const { log, error } = require("console");
const connection = require("../utility/sqldb");

const crypto = require("crypto");

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
    // searchoder: (req, res) => {
    //     const { date1, date2 } = req.body;

    //     console.log(date1, date2);

    //     const mySql =
    //         "SELECT * FROM tbl_order_creation  WHERE created_date BETWEEN ? AND ?";

    //     connection.query(mySql, [date1, date2], (error, result) => {
    //         if (error) {
    //             console.error("Error executing query:", error);
    //             return;
    //         }

    //         const orderId = result.map((order) => order.order_id);

    //         const otherMySql =
    //             "SELECT * FROM tbl_hm_order_details WHERE hm_order_id IN (?)";

    //         connection.query(otherMySql, [orderId], (otherError, otherResult) => {
    //             if (otherError) {
    //                 console.error("Error executing other query:", otherError);
    //                 return res.status(500).json({ error: "Error executing other query" });
    //             }

    //             const groupByOrderId = {};

    //             // Group otherResult data by hm_order_id
    //             otherResult.forEach((detail) => {
    //                 if (!groupByOrderId[detail.hm_order_id]) {
    //                     groupByOrderId[detail.hm_order_id] = [];
    //                 }
    //                 groupByOrderId[detail.hm_order_id].push(detail);
    //             });

    //             // Merge data from result with data from otherResult
    //             const mergedData = result.map((order) => {
    //                 const details = groupByOrderId[order.order_id] || []; // Get corresponding details for the order_id, or an empty array if not found
    //                 return {...order, otherOrderDetails: details };
    //             });

    //             const customerIds = result.map((order) => order.customer_id);
    //             //This is find customer from the tbl_customer table
    //             const customer = "SELECT * FROM tbl_customer WHERE cust_id IN (?)";

    //             connection.query(
    //                 customer, [customerIds],
    //                 (otherError, customerDetails) => {
    //                     if (otherError) {
    //                         console.error("Error executing other query:", otherError);
    //                         return res
    //                             .status(500)
    //                             .json({ error: "Error executing other query" });
    //                     }
    //                     // console.log(customerDetails);

    //                     //Here we are maping the cust_id from the tbl_customer for finding the customer details
    //                     const otherCustomerDetailsid = customerDetails.map(
    //                         (cust) => cust.cust_id
    //                     );

    //                     //Here where we are searching for the customer_detais
    //                     const otherCustomer_details =
    //                         "SELECT * FROM tbl_customer_details WHERE customer_id IN (?)";

    //                     connection.query(
    //                         otherCustomer_details, [otherCustomerDetailsid],
    //                         (otherError, allDetails) => {
    //                             if (otherError) {
    //                                 console.error("Error executing other query:", otherError);
    //                                 return res
    //                                     .status(500)
    //                                     .json({ error: "Error executing other query" });
    //                             }

    //                             // console.log(allDetails);

    //                             // Merge customerDetails with allDetails based on cust_id and customer_id
    //                             const mergedDataOfCustomer = customerDetails.map((customer) => {
    //                                 const details = allDetails.find(
    //                                     (detail) => detail.customer_id === customer.cust_id
    //                                 );
    //                                 return {...customer, ...details };
    //                             });

    //                             console.log(mergedDataOfCustomer);

    //                             const finalMergedData = mergedData.map((order) => {
    //                                 const customer = mergedDataOfCustomer.find(
    //                                     (customer) => customer.cust_id === order.customer_id
    //                                 );
    //                                 return {...order, ...customer };
    //                             });

    //                             console.log(finalMergedData);
    //                             res.json(finalMergedData);
    //                         }
    //                     );
    //                 }
    //             );
    //         });
    //     });
    // },
    searchoder1: (req, res) => {
        const { date1, date2 } = req.body;

        console.log(date1, date2);

        const mySql = `SELECT *  
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

            res.json(result);
        });
    },
    finduser: (req, res) => {
        const { username, password } = req.body;

        console.log(username, password);

        function generateMD5(password) {
            return crypto.createHash("md5").update(password).digest("hex");
        }

        const md5Hash = generateMD5(password);

        console.log(md5Hash);

        const mySql = `SELECT *
        FROM tbl_login
        LEFT JOIN tbl_employee ON tbl_employee.emp_code = tbl_login.emp_code
        LEFT JOIN tbl_department ON tbl_department.department_id = tbl_login.department_type
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_login.branch_id
        LEFT JOIN tbl_role ON tbl_role.role_id = tbl_login.emp_role
        WHERE tbl_login.emp_code = ? AND tbl_login.password = ?`;

        connection.query(mySql, [username, md5Hash], (error, result) => {
            if (error) {
                console.log("Error:", error);
                return res.json({ success: false, message: "Database error occurred" });
            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "Invalid username or password",
                });
            }

            console.log(result);
            return res.json({ success: true, data: result });
        });
    },
    searchstockbybranch: (req, res) => {
        try {
            const branchName = req.body.data;
            console.log(branchName);

            mySql = `SELECT * 
            FROM tbl_stock 
            LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_stock.branch_id
            LEFT JOIN tbl_metal_type ON tbl_metal_type.type_id = tbl_stock.metal_type_id
            LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_stock.purity_or_varient_id
            WHERE tbl_branch.branch_name = ? AND tbl_metal_type.type_id = 1`;

            connection.query(mySql, [branchName], (err, result) => {
                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }

                console.log(result);

                res.json(result);
            });
        } catch (error) {}
    },
    branchdetails: (req, res) => {
        mySql = `SELECT * FROM tbl_branch LIMIT 2`;

        connection.query(mySql, (err, result) => {
            if (err) {
                console.log("Error:", error);
                return res.json({ success: false, message: "Database error occurred" });
            }

            res.json(result);
        });
    },
    searchstockbydepartment: (req, res) => {
        try {
            const branchName = req.body.brn;
            const departmentName = req.body.dep;
            console.log(departmentName);

            const mySql = `SELECT * FROM tbl_new_stock_transfer
            LEFT JOIN tbl_production_type ON tbl_production_type.production_type_id  = tbl_new_stock_transfer.new_department_id
            LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_new_stock_transfer.branch_id
            LEFT JOIN tbl_metal_type ON tbl_metal_type.type_id = tbl_new_stock_transfer.new_metal_type_id
            LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_new_stock_transfer.new_purity_id
            WHERE tbl_branch.branch_name = ? AND tbl_production_type.production_type_name = ? AND tbl_metal_type.type_id = 1`;

            connection.query(mySql, [branchName, departmentName], (err, result) => {
                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }

                // console.log(result);
                res.json(result);
            });
        } catch (error) {}
    },
    listingSubDepartment: (req, res) => {
        try {
            console.log(req.body);
            const dep = req.body.data;

            if (dep === "HAND MADE") {
                const mySql = `SELECT *
                FROM hm_department`;

                connection.query(mySql, (err, result) => {
                    if (err) {
                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }
                    res.json({ type: 'HAND MADE', data: result });
                });
            } else if (dep === "CASTING") {
                const mySql = `SELECT *
                FROM tbl_casting_dept`

                connection.query(mySql, (err, result) => {
                    if (err) {
                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }
                    res.json({ type: 'CASTING', data: result });
                });
            }
        } catch (error) {}
    },
    subsubepartment: (req, res) => {
        try {
            const data = req.body.data;

            const mySql = `SELECT 
            tbl_branch.branch_name AS branch,
            hm_department.hm_department_name AS department_name,
            tbl_karat.karat AS karat_name,
            tbl_karat.purity AS purity,
            tbl_metal_assign_to_department.assigned_metal_weight AS weight
            
            FROM tbl_metal_assign_to_department
            LEFT JOIN hm_department ON hm_department.hm_department_id = tbl_metal_assign_to_department.department_id
            LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_metal_assign_to_department.branch_id
            LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_metal_assign_to_department.purity_id
            
            WHERE hm_department.hm_department_name = ?`

            console.log(data);

            connection.query(mySql, [data], (err, result) => {
                    if (err) {

                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }

                    console.log(result);
                    res.json(result)

                })
                // if (data === 'HM Cutting') {

            //     console.log(2);
            // } else if (data === 'HM Polishing') {

            //     console.log(3);
            // } else if (data === 'Internal QC') {

            //     console.log(4);
            // } else if (data === 'External QC') {

            //     console.log(5);
            // } else if (data === 'HM Barcoding') {

            //     console.log(6);
            // } else if (data === 'HM Finished Goods') {

            //     console.log(7);
            // } else if (data === 'HM Refining') {

            //     console.log(8);
            // } else if (data === 'HM Repair') {
            //     console.log(9);

            // } else {
            //     console.log('over');
            // }


            // if (true) {
            //     const mySql = `select * from hm_sub_department
            //                 LEFT JOIN hm_department ON hm_department.hm_department_id = hm_sub_department.hm_department_id
            //                 WHERE  hm_sub_department.hm_department_id = ?`;

            //     connection.query(mySql, [id], (err, result) => {
            //         if (err) {
            //             console.log("Error:", error);
            //             return res.json({
            //                 success: false,
            //                 message: "Database error occurred",
            //             });
            //         }
            //         res.json(result);
            //     });
            // } else {
            //     res.json({ message: "more than 3" });
            // }
        } catch (error) {}
    },

    departmentStockDate: (req, res) => {
        try {

            const { FROM, TO } = req.body;
            console.log(FROM, TO);

            mySql = `SELECT tbl_branch.branch_name AS branch,
            tbl_order_creation.order_no AS order_number,
            tbl_production_type.production_type_name AS department,
            tbl_order_creation.created_date AS order_date,
            tbl_karat.varient_name AS karat_variant,
            tbl_hm_order_details.hm_quantity AS quantity,
            tbl_hm_order_details.hm_net_wt AS net_weight,
            tbl_hm_order_details.hm_quantity * tbl_hm_order_details.hm_net_wt AS weight,
            tbl_stone.variant_name AS stone_type,
            tbl_hm_order_details.stone_weight AS stone_weight
        
        FROM tbl_order_creation
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_order_creation.branch_id
        LEFT JOIN tbl_hm_order_details ON tbl_hm_order_details.hm_order_id = tbl_order_creation.order_id
        LEFT JOIN tbl_production_type ON tbl_production_type.production_type_id = tbl_hm_order_details.hm_category_type
        LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_hm_order_details.hm_purity_id
        LEFT JOIN tbl_stone ON tbl_stone.stone_id = tbl_hm_order_details.hm_stone_id
        WHERE tbl_order_creation.created_date BETWEEN ? AND ?`;

            connection.query(mySql, [FROM, TO], (err, result) => {
                if (err) {

                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }
                console.log('----------------------------date-------------------------');
                console.log(result);
                res.json(result)
            })
        } catch (error) {

        }
    },
    dateANDbranchWise: (req, res) => {
        console.log(req.body);
        try {

            const { FROM, TO, branch } = req.body;

            //for finding table with from date and to date and branch name
            mySql = `SELECT tbl_branch.branch_name AS branch,
            tbl_order_creation.order_no AS order_number,
            tbl_production_type.production_type_name AS department,
            tbl_order_creation.created_date AS order_date,
            tbl_karat.varient_name AS karat_variant,
            tbl_hm_order_details.hm_quantity AS quantity,
            tbl_hm_order_details.hm_net_wt AS net_weight,
            tbl_hm_order_details.hm_quantity * tbl_hm_order_details.hm_net_wt AS weight,
            tbl_stone.variant_name AS stone_type,
            tbl_hm_order_details.stone_weight AS stone_weight
        
        
        FROM tbl_order_creation
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_order_creation.branch_id
        LEFT JOIN tbl_hm_order_details ON tbl_hm_order_details.hm_order_id = tbl_order_creation.order_id
        LEFT JOIN tbl_production_type ON tbl_production_type.production_type_id = tbl_hm_order_details.hm_category_type
        LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_hm_order_details.hm_purity_id
        LEFT JOIN tbl_stone ON tbl_stone.stone_id = tbl_hm_order_details.hm_stone_id
        
        WHERE tbl_order_creation.created_date BETWEEN ? AND ? AND tbl_branch.branch_name = ?
        `

            connection.query(mySql, [FROM, TO, branch], (err, result) => {
                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }
                res.json(result);
            })
        } catch (error) {

        }
    },
    dateANDbranchANDdepartment: (req, res) => {
        console.log(req.body);
        try {


            const { FROM, TO, branch, department } = req.body;

            mySql = `SELECT tbl_branch.branch_name AS branch,
            tbl_order_creation.order_no AS order_number,
            tbl_production_type.production_type_name AS department,
            tbl_order_creation.created_date AS order_date,
            tbl_karat.varient_name AS karat_variant,
            tbl_hm_order_details.hm_quantity AS quantity,
            tbl_hm_order_details.hm_net_wt AS net_weight,
            tbl_hm_order_details.hm_quantity * tbl_hm_order_details.hm_net_wt AS weight,
            tbl_stone.variant_name AS stone_type,
            tbl_hm_order_details.stone_weight AS stone_weight
        
        
        FROM tbl_order_creation
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_order_creation.branch_id
        LEFT JOIN tbl_hm_order_details ON tbl_hm_order_details.hm_order_id = tbl_order_creation.order_id
        LEFT JOIN tbl_production_type ON tbl_production_type.production_type_id = tbl_hm_order_details.hm_category_type
        LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_hm_order_details.hm_purity_id
        LEFT JOIN tbl_stone ON tbl_stone.stone_id = tbl_hm_order_details.hm_stone_id
        
        WHERE tbl_order_creation.created_date BETWEEN ? AND ? AND tbl_branch.branch_name = ? AND tbl_production_type.production_type_name =  ?
        `

            connection.query(mySql, [FROM, TO, branch, department], (err, result) => {
                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }
                log(result)
                res.json(result);
            })
        } catch (error) {

        }
    },

    employeweight: (req, res) => {

        console.log('hello world');
        const mySql = `SELECT 
        tbl_branch.branch_name AS branch,
        tbl_employee.emp_name AS employe_name,
        tbl_karat.purity AS purity,
        tbl_metal_assign_to_employee.assigned_metal_weight AS assigned_weight
        
        FROM tbl_metal_assign_to_employee
        LEFT JOIN tbl_employee ON tbl_employee.emp_id = tbl_metal_assign_to_employee.employee_id
        LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_metal_assign_to_employee.purity_id
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_metal_assign_to_employee.branch_id`

        connection.query(mySql, (err, result) => {
            if (err) {
                console.log("Error:", error);
                return res.json({
                    success: false,
                    message: "Database error occurred",
                });
            }
            res.json(result);
        })
    }
};

module.exports = common;