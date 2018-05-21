import responseFlags from '../constants/responseFlags.js';

const validateShortUrlList = (req, res, next) => {
  try {
    var urlList = JSON.parse(req.body.short_urls);
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
      url: urlObject.url,
      isValid: isValidURL(urlObject.url),
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
      short_urls: urlList
    })
  }

  req.body.short_urls = urlList;
  next();
}

function isValidURL(string) {
  let regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
  return regex.test(string);
}

export default validateShortUrlList;
