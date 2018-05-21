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
import validateShortUrlList from './middlewares/validateShortUrlList.js';

app.post('/login', validateLoginRequest, apiRoutes.login);
app.post('/shorten_url', validateAccessToken, validateURLList, apiRoutes.shortenURLRoute);
app.get('/get_user_history_data', validateAccessToken, apiRoutes.getUserData);
app.post('/get_long_url', validateAccessToken, validateShortUrlList, apiRoutes.getLongURL);

app.get('*', function(req, res){
  res.status(404).send('404 Not Found');
});

app.post('*', function(req, res){
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
