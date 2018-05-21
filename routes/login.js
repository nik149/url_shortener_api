import dbHandler from '../database/databaseHandler.js';
import responseFlags from '../constants/responseFlags.js';

const login = (req, res) => {
  let userInfo = req.body.user_info;

  let accessToken = userInfo.access_token;
  let googleUserId = userInfo.profile.id;
  let userName = userInfo.profile.name || '';
  let userEmail = userInfo.profile.email || '';
  let userImage = userInfo.profile.image || '';

  dbHandler.query("SELECT * FROM tb_users WHERE google_user_id = ?", [googleUserId], function(err, result) {
    if(err) {
      res.status(500);
      return res.send({
        statusCode: 500,
        flag: responseFlags.QUERY_ERROR,
        message: 'Something went wrong. Please try again later.'
      });
    } else {
      if(!result.length) {
        createUser(googleUserId, userName, userEmail, userImage, accessToken)
        .then(result => {
          res.status(200);
          return res.send({
            statusCode: 200,
            flag: responseFlags.SUCCESS,
            message: 'Login Successful',
            data: {access_token: accessToken}
          });
        })
        .catch(error => {
          res.status(500);
          return res.send({
            statusCode: 500,
            flag: responseFlags.QUERY_ERROR,
            message: 'Something went wrong. Please try again.'
          });
        });
      } else {
        let user = result[0];
        updateUserInfo(user.id, userName, userEmail, userImage, accessToken)
        .then(result => {
          res.status(200);
          return res.send({
            statusCode: 200,
            flag: responseFlags.SUCCESS,
            message: 'Login Successful',
            data: {access_token: accessToken}
          });
        })
        .catch(error => {
          res.status(500);
          return res.send({
            statusCode: 500,
            flag: responseFlags.QUERY_ERROR,
            message: 'Something went wrong. Please try again.'
          });
        });
      }
    }
  });
}

function createUser(googleUserId, userName, userEmail, userImage, accessToken) {
  return new Promise((resolve, reject) => {
    dbHandler.query("INSERT INTO tb_users(google_user_id, user_name, user_email, user_image, access_token) VALUES(?,?,?,?,?)", [googleUserId, userName, userEmail, userImage, accessToken], function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function updateUserInfo(userId, userName, userEmail, userImage, accessToken) {
  return new Promise((resolve, reject) => {
    dbHandler.query('UPDATE tb_users SET user_name=?, user_email=?, user_image=?, access_token=? WHERE id = ?', [userName, userEmail, userImage, accessToken, userId], function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default login;
