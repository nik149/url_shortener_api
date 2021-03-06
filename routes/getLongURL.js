import dbHandler from '../database/databaseHandler.js';
import responseFlags from '../constants/responseFlags.js';
import { CHAR_MAP, BASE } from '../constants/urlConstants.js';
var url = require('url');

const getLongURL = (req, res) => {
  let userId = req.body.user.user_id;
  let shortUrls = req.body.short_urls;

  let urlIds = [];
  shortUrls.forEach(function(shortUrl) {
    let code = url.parse(shortUrl.url, true).pathname;
    let host = url.parse(shortUrl.url, true).host;
    let redirectorHost = url.parse(process.env.BASE_URL, true).host;
    if(host == redirectorHost) {
      let surl = code.substr(1);
      let urlId = decode(surl);
      urlIds.push(urlId);
    }
  });

  if(!urlIds.length) {
    res.status(200);
    return res.send({
      statusCode: 200,
      flag: responseFlags.SUCCESS,
      data: [],
      message: 'Success'
    });
  }

  fetchAllLongUrls(urlIds, userId)
  .then(result => {
    let responseData = result.map(function(row) {
      return {
        long_url: row.long_url,
        created_on: row.created_on,
        short_url: encode(row.id),
        hits: row.num_hits
      }
    });

    res.status(200);
    return res.send({
      statusCode: 200,
      flag: responseFlags.SUCCESS,
      data: responseData,
      message: 'Success'
    });
  })
  .catch(err => {
    res.status(500);
    res.send({
      statusCode: 500,
      flag: responseFlags.QUERY_ERROR,
      message: 'Something went wrong. Please try again later.'
    });
  })
}

function fetchAllLongUrls(urlIds, userId) {
  return new Promise((resolve, reject) => {
    dbHandler.query('SELECT * FROM tb_url_mappings WHERE id in (?) AND user_id = ?', [urlIds, userId], function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function decode(string) {
  let num = 0;
  for(let i = 0; i < string.length; i++) {
    num = num*BASE + CHAR_MAP.indexOf(string[i]);
  }
  return num;
}

function encode(mysqlId) {
  let string = '';
  let num = mysqlId;
  while(num > 0) {
    string += CHAR_MAP[num%BASE];
    num = Math.floor(num/BASE);
  }
  return string.split("").reverse().join("");
}

export default getLongURL;
