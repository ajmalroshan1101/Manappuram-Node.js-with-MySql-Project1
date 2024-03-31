const express = require('express')

const commonRouter = express.Router();

const { showVendor, showcustomer, searchdate, searchoder1, finduser, searchstockbybranch, branchdetails, searchstochbydepartment, listingSubDepartment, subsubepartment, searchstockbydepartment, departmentStockDate, dateANDbranchWise, dateANDbranchANDdepartment, employeweight } = require('../controller/commonController');

commonRouter.get('/showvendor', showVendor);

commonRouter.get('/showcustomer', showcustomer);

commonRouter.get('/branchdetails', branchdetails);

commonRouter.get('/employeweight', employeweight);

commonRouter.post('/searchdate', searchdate);

// commonRouter.post('/searchoder', searchoder);

commonRouter.post('/searchoder1', searchoder1);

commonRouter.post('/finduser', finduser);

commonRouter.post('/searchstockbybranch', searchstockbybranch);

commonRouter.post('/searchstochbydepartment', searchstockbydepartment);

commonRouter.post('/listingSubDepartment', listingSubDepartment);

commonRouter.post('/subsubepartment', subsubepartment);

commonRouter.post('/departmentStockDate', departmentStockDate);

commonRouter.post('/dateandbranchwise', dateANDbranchWise);

commonRouter.post('/dateandbranchanddepartment', dateANDbranchANDdepartment)



module.exports = commonRouter;