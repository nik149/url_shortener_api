import dbHandler from '../database/databaseHandler.js';
import responseFlags from '../constants/responseFlags.js';

const validateAccessToken = (req, res, next) => {
  let accessToken = req.body.access_token || req.query.access_token;

  if(!accessToken) {
    res.status(403);
    return res.send({
      statusCode: 403,
      flag: responseFlags.INVALID_ACCESS_TOKEN,
      message: 'Your token has expired. Please login again.'
    });
  }

  //fetch user from access token.
  fetchUserFromAccessToken(accessToken)
  .then(result => {
    if(!result.length) {
      res.status(403);
      return res.send({
        statusCode: 403,
        flag: responseFlags.INVALID_ACCESS_TOKEN,
        message: 'Your token has expired. Please login again.'
      });
    }

    let user = result[0];
    req.body.user = {
      user_id: user.id
    };
    next();
  })
  .catch(err => {
    res.status(500);
    return res.send({
      statusCode: 500,
      flag: responseFlags.QUERY_ERROR,
      message: 'Something went wrong. Please try again.'
    });
  });
}

function fetchUserFromAccessToken(accessToken) {
  return new Promise((resolve, reject) => {
    dbHandler.query('SELECT id, google_user_id FROM tb_users WHERE access_token=?', [accessToken], function(err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export default validateAccessToken;
