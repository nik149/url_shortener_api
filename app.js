//CONFIG
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');


const app = express()

require('./database/databaseHandler.js');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//ROUTES
import apiRoutes from './routes/apiRoutes.js';
import validateURLList from './middlewares/requestValidations.js';

app.post('/shorten_url', validateURLList, apiRoutes.shortenURL);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
