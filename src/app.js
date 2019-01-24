const fs = require("fs");
const Handler = require("./framework");
const app = new Handler();
const html = require('./template');

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};
const getURLPath = function(url) {
  if (url == "/") return "./public/login.html";
  return "./public" + url;
};

const serveFile = function(req, res) {
  const path = getURLPath(req.url);
  fs.readFile(path, (err, content) => {
    if (err) {
      send(res, "File Not Found", 404);
      return;
    }
    send(res, content);
  });
};

app.use(readBody);
app.use(logRequest);
app.get(serveFile);

module.exports = app.handleRequest.bind(app);