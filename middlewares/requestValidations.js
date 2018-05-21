import responseFlags from '../constants/responseFlags.js';

const validateURLList = (req, res, next) => {
  try {
    var urlList = JSON.parse(req.body.url_list);
  } catch(e) {
    res.status(400);
    return res.send({
      statusCode: 400,
      flag: responseFlags.REQUEST_NOT_PARSED,
      message: 'Bad Request'
    });
  }

  let containsInvalidURLs = false;

  urlList = urlList.map((urlObject) => {
    let newurlObject =  {
      long_url: urlObject.value,
      isValid: isValidURL(urlObject.value),
      key: urlObject.key
    }
    if(!newurlObject.isValid) {
      containsInvalidURLs = true;
    }
    return newurlObject;
  });

  if(containsInvalidURLs) {
    res.status(400);
    return res.send({
      statusCode: 400,
      flag: responseFlags.CONTAINS_INVALID_URLs,
      url_list: urlList
    })
  }

  req.body.url_list = urlList;
  next();
}

function isValidURL(string) {
  let regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
  return regex.test(string);
}

export default validateURLList;
