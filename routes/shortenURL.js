import dbHandler from '../database/databaseHandler.js';
import responseFlags from '../constants/responseFlags.js';
import { CHAR_MAP, BASE } from '../constants/urlConstants.js';

const shortenURLRoute = (req, res) => {
  let urlList = req.body.url_list;
  let userId = req.body.user.user_id;

  let promises = [];
  urlList.forEach((urlObject) => {
    promises.push(shortenURL(urlObject, userId));
  });

  Promise.all(promises)
  .then((result) => {
    res.status(200);
    res.send({
      statusCode: 200,
      flag: responseFlags.SUCCESS,
      data: result,
      message: 'Success'
    });
  })
  .catch((err) => {
    res.status(500);
    res.send({
      statusCode: 500,
      flag: responseFlags.QUERY_ERROR,
      message: 'Something went wrong. Please try again later.'
    });
  });
}

function shortenURL(urlObject, userId) {
  return new Promise((resolve, reject) => {
    dbHandler.query('INSERT INTO tb_url_mappings(long_url, user_id, num_hits) VALUES(?, ?, ?)', [urlObject.long_url, userId, 0], function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve({
          short_url: process.env.BASE_URL + encode(result.insertId),
          key: urlObject.key,
          long_url: urlObject.long_url
        });
      }
    });
  });
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

export default shortenURLRoute;
