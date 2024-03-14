const express = require('express')

const commonRouter = express.Router();

const { showVendor, showcustomer, searchdate } = require('../controller/commonController');

commonRouter.get('/showvendor', showVendor);

commonRouter.get('/showcustomer', showcustomer);

commonRouter.post('/searchdate', searchdate);

module.exports = commonRouter;