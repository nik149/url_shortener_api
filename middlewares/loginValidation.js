import responseFlags from '../constants/responseFlags.js';

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const validateLoginRequest = (req, res, next) => {
  let userInfo;
  try {
    userInfo = JSON.parse(req.body.user_info);
  } catch(e) {
    res.status(400);
    return res.send({
      statusCode: 400,
      flag: responseFlags.REQUEST_NOT_PARSED,
      message: 'Bad Request'
    });
  }

  let accessToken = userInfo.access_token;

  client.verifyIdToken({
    idToken: accessToken,
    audience: process.env.GOOGLE_CLIENT_ID
  }).then(response => {
    let payload = response.getPayload();
    //validate response from google
    if(payload.aud != process.env.GOOGLE_CLIENT_ID || payload.sub != userInfo.profile.id) {
      res.status(403);
      return res.send({
        statusCode: 403,
        flag: responseFlags.FAILED,
        message: 'Login Failed'
      });
    }
    req.body.user_info = userInfo;
    next();
  }).catch(error => {
    res.status(403);
    return res.send({
      statusCode: 403,
      flag: responseFlags.FAILED,
      message: 'Login Failed'
    });
  });
}

export default validateLoginRequest;
