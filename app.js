const express = require('express')

const mysql = require('mysql');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const commonRoute = require('./router/commonRoute');

app.use(cors());

app.get('/', (req, res) => {
    res.send('This is the about page');
});


app.use('/common', commonRoute);

app.listen(5000, () => {
    console.log('server is runing');
})