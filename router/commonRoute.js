const express = require('express')

const commonRouter = express.Router();

const { showVendor, showcustomer, searchdate, searchoder1, finduser, searchstockbybranch, branchdetails, searchstochbydepartment, listingSubDepartment, subsubepartment, searchstockbydepartment, departmentStockDate, dateANDbranchWise, dateANDbranchANDdepartment, employeweight, demo, salereport, finishedgoods, showbranch, employeestock, departmentstock, barcodingstock, castingtemp, KOLKATA, LUCKNOW } = require('../controller/commonController');

commonRouter.get('/showvendor', showVendor);

commonRouter.get('/showcustomer', showcustomer);

commonRouter.get('/branchdetails', branchdetails);


//change to employee stock by branch
commonRouter.post('/employeweight', employeweight);

commonRouter.get('/demo', demo);

commonRouter.get('/showbranch', showbranch)


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

commonRouter.post('/dateandbranchanddepartment', dateANDbranchANDdepartment);

commonRouter.post('/salereport', salereport);

commonRouter.post('/finishedgoods', finishedgoods);

commonRouter.post('/employeestock', employeestock);

commonRouter.post('/departmentstock', departmentstock);

commonRouter.post('/barcodingstock', barcodingstock);

commonRouter.post('/castingtemp', castingtemp);

commonRouter.post('/KOLKATA', KOLKATA);

commonRouter.post('/LUCKNOW', LUCKNOW);




module.exports = commonRouter;