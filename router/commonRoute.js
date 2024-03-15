const express = require('express')

const commonRouter = express.Router();

const { showVendor, showcustomer, searchdate, searchoder, searchoder1 } = require('../controller/commonController');

commonRouter.get('/showvendor', showVendor);

commonRouter.get('/showcustomer', showcustomer);

commonRouter.post('/searchdate', searchdate);

commonRouter.post('/searchoder', searchoder);

commonRouter.post('/searchoder1', searchoder1)

module.exports = commonRouter;