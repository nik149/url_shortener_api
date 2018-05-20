import dbHandler from '../database/databaseHandler.js';
import responseFlags from '../constants/responseFlags.js';
import { CHAR_MAP, BASE } from '../constants/urlConstants.js';


const getUserData = (req, res) => {
  let userId = req.body.user.user_id;
  let page   = req.query.page || 0;
  let size   = req.query.size || 10;

  if(size > 100) {
    size = 100;
  }

  getTotalPages(userId)
  .then(count => {
    getHistoryData(userId, page, size)
    .then((result) => {
      res.status(200);
      res.send({
        statusCode: 200,
        flag: responseFlags.SUCCESS,
        data: result,
        current_page: parseInt(parseInt(page) + 1),
        total_pages: Math.ceil(count/size),
        prev_link: parseInt(page) > 0 ? '/get_user_history_data?page='+parseInt(parseInt(page) - 1)+'&size='+size : null,
        next_link: '/get_user_history_data?page='+parseInt(parseInt(page) + 1)+'&size='+size,
        message: 'Success'
      });
    })
    .catch(error => {
      throw error;
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500);
    res.send({
      statusCode: 500,
      flag: responseFlags.QUERY_ERROR,
      message: 'Something went wrong. Please try again later.'
    });
  });
}

function getTotalPages(userId) {
  return new Promise((resolve, reject) => {
    dbHandler.query('SELECT count(*) as count FROM tb_url_mappings WHERE user_id = ?', [userId], function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve(result[0].count);
      }
    });
  });
}


function getHistoryData(userId, page, size) {
  return new Promise((resolve, reject) => {
    dbHandler.query('SELECT id, long_url, created, num_hits FROM tb_url_mappings WHERE user_id = ? ORDER BY id DESC LIMIT ?,?', [userId, parseInt(page)*size, (parseInt(page)+1)*size], function(err, result) {
      if(err) {
        reject(err);
      } else {
        result.forEach(function(row) {
          row.short_url = process.env.BASE_URL + encode(row.id);
        })
        resolve(result);
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

function decode(string) {
  let num = 0;
  for(let i = 0; i < string.length; i++) {
    num = num*BASE + CHAR_MAP.indexOf(string[i]);
  }
  return num;
}

export default getUserData;
