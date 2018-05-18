const express = require('express')
const app = express()
const bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

import apiRoutes from './routes/apiRoutes.js';

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/shorten_url', apiRoutes.shortenURL);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
