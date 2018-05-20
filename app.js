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
import apiRoutes from './routes/index.js';
import validateURLList from './middlewares/requestValidations.js';
import validateLoginRequest from './middlewares/loginValidation.js';
import validateAccessToken from './middlewares/accessTokenValidation.js';

app.post('/login', validateLoginRequest, apiRoutes.login);
app.post('/shorten_url', validateAccessToken, validateURLList, apiRoutes.shortenURLRoute);
app.get('/get_user_history_data', validateAccessToken, apiRoutes.getUserData);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
