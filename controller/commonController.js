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

        const sqlQuery = `SELECT tbl_customer.cust_name,tbl_customer.cust_date,tbl_customer_details.cust_bill_address1,tbl_customer_details.cust_bill_address2,tbl_customer_details.cust_bill_pin_code,tbl_customer_details.cust_gstin,tbl_customer_details.cust_pan,tbl_customer_details.cust_phone, tbl_customer_details.cust_state FROM tbl_customer 
        LEFT JOIN tbl_customer_details ON tbl_customer_details.customer_id = tbl_customer.cust_id 
        WHERE cust_date BETWEEN ? AND ?;`


        connection.query(sqlQuery, [date1, date2], (error, result) => {
            if (error) {
                console.error("Error executing query:", error);
                return;
            }

            //Extract the customerid from the result array of tbl_customer
            // const customerIds = result.map((customer) => customer.cust_id);

            //This is to find other customer details
            // const otherSql =
            // "SELECT * FROM tbl_customer_details WHERE customer_id IN (?)";

            // connection.query(otherSql, [customerIds], (otherError, otherResult) => {
            //     if (otherError) {
            //         console.error("Error executing other query:", otherError);
            //         return res.status(500).json({ error: "Error executing other query" });
            //     }

            // const combinedResults = {
            //     result: result,
            //     otherResult: otherResult,
            // };
            // });
            console.log(result);
            res.status(200).json(result);
        });
    },

    searchoder1: (req, res) => {
        const { date1, date2 } = req.body;

        console.log(date1, date2);

        const mySql = `SELECT tbl_order_creation.order_no , tbl_customer.cust_name , tbl_customer_details.cust_bill_address1 , tbl_style.variant_name , tbl_customer_details.cust_bill_pin_code , tbl_hm_order_details.hm_gross_weight , tbl_order_creation.shipping_date , tbl_hm_order_details.hm_net_wt 
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

        // console.log(username, password);

        function generateMD5(password) {
            return crypto.createHash("md5").update(password).digest("hex");
        }

        const md5Hash = generateMD5(password);

        // console.log(md5Hash);/

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

            // console.log('hello');
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
                console.log(result);
                res.json(result)
            })
        } catch (error) {

        }
    },
    dateANDbranchWise: (req, res) => {
        console.log(req.body);
        try {

            const { branch } = req.body;

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
        
        WHERE tbl_branch.branch_name = ?
        `

            connection.query(mySql, [branch], (err, result) => {
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
    // this is currently working rest of the function are useless 
    dateANDbranchANDdepartment: (req, res) => {
        console.log('hello world ajmal');
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
        
        WHERE tbl_branch.branch_name = ? AND tbl_production_type.production_type_name =  ?
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

    //Here is another importent table
    employeweight: (req, res) => {
        const mySql = `SELECT 
        tbl_branch.branch_name AS branch,
        tbl_hm_worker.team_name AS employe_name,
        tbl_karat.karat AS purity,
        tbl_metal_assign_to_employee.assigned_metal_weight AS assigned_weight
        
        FROM tbl_metal_assign_to_employee
        LEFT JOIN tbl_hm_worker ON tbl_hm_worker.hm_worker_id = tbl_metal_assign_to_employee.employee_id
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
    },
    demo: (req, res) => {
        res.json('backend is runnig');
    }
};

module.exports = common;