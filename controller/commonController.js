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


        function generateMD5(password) {
            return crypto.createHash("md5").update(password).digest("hex");
        }

        const md5Hash = generateMD5(password);

        // console.log(md5Hash);/

        const mySql = `SELECT 
        tbl_employee.emp_name ,
        tbl_branch.branch_name,
        tbl_login.branch_id,
        tbl_role.role_name,
        tbl_department.department_name,
        tbl_employee.emp_code
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


                res.json(result);
            });
        } catch (error) {}
    },
    branchdetails: (req, res) => {
        mySql = `SELECT branch_name FROM tbl_branch `;

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

                res.json(result);
            });
        } catch (error) {}
    },
    listingSubDepartment: (req, res) => {
        try {
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


            connection.query(mySql, [data], (err, result) => {
                if (err) {

                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }

                res.json(result)

            })


        } catch (error) {}
    },

    departmentStockDate: (req, res) => {
        try {

            const { FROM, TO } = req.body;

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
                res.json(result)
            })
        } catch (error) {

        }
    },
    dateANDbranchWise: (req, res) => {
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
        try {


            const { branch, department } = req.body;

            console.log(department);
            if (department === 'HAND MADE') {

                mySqlhand = ` SELECT 
                tbl_branch.branch_name AS branch,
                hm_department_live_status.hm_metal_weight AS weight_1,
                SUM(tbl_metal_assign_to_employee.assigned_metal_weight) AS assigned_weight_employee,
                tbl_karat.karat AS purity
                
                        FROM tbl_metal_assign_to_employee
                                
                        LEFT JOIN hm_department_live_status on hm_department_live_status.production_type_id = 2
                        
                        LEFT JOIN tbl_karat ON tbl_karat.karat_id =hm_department_live_status.purity_id
                  
                        LEFT JOIN tbl_branch ON tbl_branch.branch_id = hm_department_live_status.branch_id
                        
                       WHERE tbl_branch.branch_name = ?`


                connection.query(mySqlhand, [branch], (err, result) => {
                    if (err) {
                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }
                    res.json({ dep: 'hand', result });
                })

            } else if (department === 'CASTING') {

                const mysqlcas = `SELECT 

                tbl_branch.branch_name AS branch,
                tbl_casting_dept.casting_dept_name AS department,
                tbl_metal_type.type_name AS metal_name,
                tbl_karat.karat ,
                tbl_temp_casting_gold_stock.temp_gold_stock_weight AS l_metal,
                tbl_temp_casting_gold_stock.item_weight
                
                FROM tbl_temp_casting_gold_stock
                
                LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_temp_casting_gold_stock.branch_id
                LEFT JOIN tbl_casting_dept ON tbl_casting_dept.casting_dept_id = tbl_temp_casting_gold_stock.casting_dept_id
                LEFT JOIN tbl_metal_type ON tbl_metal_type.type_id = tbl_temp_casting_gold_stock.metal_type_id
                LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_temp_casting_gold_stock.purity_id
                WHERE tbl_temp_casting_gold_stock.metal_type_id = 1 AND tbl_branch.branch_name = ?`

                connection.query(mysqlcas, [branch], (err, result) => {
                    if (err) {
                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }
                    res.json({ dep: 'cast', result });
                })

            } else if (department === 'GCD') {

                const gcdsql = `SELECT 

                tbl_hm_gcd.barcode,
                tbl_hm_gcd.item_name,
                tbl_hm_gcd.gross_weight,
                tbl_karat.karat
                
                FROM tbl_hm_gcd
                LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_hm_gcd.branch_id
                LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_hm_gcd.purity
                
                WHERE tbl_branch.branch_name = ? `

                connection.query(gcdsql, [branch], (err, result) => {
                    if (err) {
                        console.log("Error:", error);
                        return res.json({
                            success: false,
                            message: "Database error occurred",
                        });
                    }

                    res.json({ dep: 'gcd', result });
                })
            }

            //     mySql = `SELECT tbl_branch.branch_name AS branch,
            //     tbl_order_creation.order_no AS order_number,
            //     tbl_production_type.production_type_name AS department,
            //     tbl_order_creation.created_date AS order_date,
            //     tbl_karat.varient_name AS karat_variant,
            //     tbl_hm_order_details.hm_quantity AS quantity,
            //     tbl_hm_order_details.hm_net_wt AS net_weight,
            //     tbl_hm_order_details.hm_quantity * tbl_hm_order_details.hm_net_wt AS weight,
            //     tbl_stone.variant_name AS stone_type,
            //     tbl_hm_order_details.stone_weight AS stone_weight


            // FROM tbl_order_creation
            // LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_order_creation.branch_id
            // LEFT JOIN tbl_hm_order_details ON tbl_hm_order_details.hm_order_id = tbl_order_creation.order_id
            // LEFT JOIN tbl_production_type ON tbl_production_type.production_type_id = tbl_hm_order_details.hm_category_type
            // LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_hm_order_details.hm_purity_id
            // LEFT JOIN tbl_stone ON tbl_stone.stone_id = tbl_hm_order_details.hm_stone_id

            // WHERE tbl_branch.branch_name = ? AND tbl_production_type.production_type_name =  ?
            // `

            // connection.query(mySql, [FROM, TO, branch, department], (err, result) => {
            //     if (err) {
            //         console.log("Error:", error);
            //         return res.json({
            //             success: false,
            //             message: "Database error occurred",
            //         });
            //     }
            //     log(result)
            //     res.json(result);
            // })
        } catch (error) {

        }
    },

    //Here is another importent table
    employeweight: (req, res) => {

        const { branch } = req.body;
        const mySql = `SELECT 
        tbl_hm_worker.team_name AS employe_name,
        tbl_karat.karat AS purity,
        tbl_metal_assign_to_employee.assigned_metal_weight AS assigned_weight
        
        FROM tbl_metal_assign_to_employee
        LEFT JOIN tbl_hm_worker ON tbl_hm_worker.hm_worker_id = tbl_metal_assign_to_employee.employee_id
        LEFT JOIN tbl_karat ON tbl_karat.karat_id = tbl_metal_assign_to_employee.purity_id
        LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_metal_assign_to_employee.branch_id

        WHERE  tbl_branch.branch_name = ?`

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
    },
    demo: (req, res) => {
        res.json('backend is runnig');
    },
    salereport: (req, res) => {

        try {

            const { from, to, branch } = req.body

            const mySql = `
            SELECT 
            
            tbl_billing.invoice_no AS bill_no,
            tbl_billing.billing_date AS trans_date,
            tbl_customer.cust_name AS party_name,
            tbl_billing.total_gross_wt AS gr_wt,
            tbl_billing.total_stone_wt AS cls_wt,
            tbl_billing.total_net_wt AS net_wt,
            tbl_billing.total_metal_cost AS mtl_amt,
            tbl_billing.hm_rate AS gold_rate,
            tbl_billing.hm_cgst AS cgst_amt,
            tbl_billing.hm_sgst AS sgst_amt,
            tbl_billing.hm_igst AS igst_amt,
            tbl_billing.hm_tcs AS tcs_amt,
            tbl_billing.grand_total AS final_amount,
            tbl_branch.branch_name AS branch,
            tbl_states.state_name AS state ,
            tbl_billing.mobilizer_code AS mobilizer
            
            FROM tbl_billing
            LEFT JOIN tbl_billing_item_details ON tbl_billing_item_details.billing_id = tbl_billing.billing_id
            LEFT JOIN tbl_customer ON tbl_customer.cust_id =tbl_billing.bill_vendor_id
            LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_billing.branch_id
            LEFT JOIN tbl_style ON tbl_style.style_id = tbl_billing_item_details.style_id
            LEFT JOIN tbl_product_type ON tbl_product_type.product_id = tbl_style.product_type
            LEFT JOIN tbl_product_category ON tbl_product_category.category_id = tbl_style.product_category_id
            LEFT JOIN tbl_product_subcategory ON tbl_product_subcategory.subcategory_id = tbl_style.product_subcategory_id
            LEFT JOIN tbl_states ON tbl_states.id = tbl_branch.state_id
            
            WHERE tbl_billing.billing_date BETWEEN ? AND ? AND tbl_branch.branch_name = ? AND tbl_billing.billing_status = 3 
            `
            connection.query(mySql, [from, to, branch], (err, result) => {

                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }

                // console.log(result);
                res.json(result);
            })
        } catch (error) {

        }
    },
    finishedgoods: (req, res) => {
        console.log(req.body);

        try {

            const branch = req.body.branch
            console.log(branch);

            const mysql = `SELECT 
            tbl_hm_gcd.gross_weight 
            FROM tbl_hm_gcd
            
            LEFT JOIN tbl_branch ON tbl_branch.branch_id = tbl_hm_gcd.branch_id
            
            WHERE tbl_branch.branch_name = ?`

            connection.query(mysql, [branch], (err, result) => {
                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }
                const gcd = result.map(row => row.gross_weight);

                // console.log(gcd); // Log the extracted branch names

                res.json(gcd);
            })
        } catch (error) {

        }
    },
    showbranch: (req, res) => {
        try {

            const mySql = `SELECT 
            branch_name AS branch
            FROM tbl_branch  `

            connection.query(mySql, (err, result) => {

                if (err) {
                    console.log("Error:", error);
                    return res.json({
                        success: false,
                        message: "Database error occurred",
                    });
                }

                // console.log(result);

                // res.json(result)
                // Extract only the branch names
                const branches = result.map(row => row.branch);

                // console.log(branches); // Log the extracted branch names

                res.json(branches);
            })
        } catch (error) {

        }
    }
};

module.exports = common;