import responseFlags from '../constants/responseFlags.js';

const validateURLList = (req, res, next) => {
  try {
    var urlList = JSON.parse(req.body.url_list);
  } catch(e) {
    res.status(404);
    return res.send({
      statusCode: 404,
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
    res.status(404);
    return res.send({
      statusCode: 404,
      flag: responseFlags.CONTAINS_INVALID_URLs,
      url_list: urlList
    })
  }
  console.log("inside val: ", urlList);
  req.body.url_list = urlList;
  next();
}

function isValidURL(string) {
  let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return regex.test(string);
}

export default validateURLList;
