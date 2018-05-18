const shortenURLRoute = (req, res) => {
  console.log(req.body);
  let longURL = req.body.long_url;

  let urlDetails = shortenURL(longURL);

  res.send(JSON.stringify({
    flag: 101,
    message: "Success",
    url_details: urlDetails
  }));
}

function shortenURL(long_url) {
  let ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let BASE = ALPHABET.length;

  let urlDetails = {};

  urlDetails.short_url = encode(1, ALPHABET, BASE);
  urlDetails.long_id = decode(urlDetails.short_url, ALPHABET, BASE);
  return urlDetails;
}

function encode(mysqlId, ALPHABET, BASE) {
  let string = '';
  let num = mysqlId;
  while(num > 0) {
    string += ALPHABET[num%BASE];
    num = Math.floor(num/BASE);
  }
  return string.split("").reverse().join("");
}

function decode(string, ALPHABET, BASE) {
  let num = 0;
  for(let i = 0; i < string.length; i++) {
    num = num*BASE + ALPHABET.indexOf(string[i]);
  }
  return num;
}

export default {
  shortenURL: shortenURL
};
