const fs = require("fs");
const { readArgs, getURLPath } = require("./appUtil.js");
const Handler = require("./framework");
const app = new Handler();
const html = require("./template");
const userInfo = require("../private/userData.json");

const readBody = (req, res, send, next) => {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const logRequest = (req, res, send, next) => {
  console.log(req.method, req.url);
  next();
};

const serveFile = function(req, res, send) {
  const path = getURLPath(req.url);
  if (path == "login" || path == "signup") {
    send(res, html[path + "Page"]);
    return;
  }
  fs.readFile(path, (err, content) => {
    if (err) {
      send(res, "File Not Found", 404);
      return;
    }
    send(res, content);
  });
};

const isValidUser = function(userId, password) {
  if (userInfo[userId]) {
    return userInfo[userId]["password"] == password;
  }
  return false;
};

const renderHomePage = function(req, res, send) {
  const args = req.body;
  let { userId, password } = readArgs(args);
  userId = unescape(userId);
  password = unescape(password);
  if (!isValidUser(userId, password)) {
    send(res, "authorization has been refused", 401);
    return;
  }
  send(res, html.homepage(userInfo[userId].name));
};

const renderLoginPage = function(req, res, send) {
  let { name, email, userId, password } = readArgs(req.body);
  name = unescape(name).replace(/\+/g, " ");
  email = unescape(email);
  userId = unescape(userId);
  password = unescape(password);
  userInfo[userId] = { name, email, userId, password };
  fs.writeFile("./private/userData.json", JSON.stringify(userInfo), err => {});
  send(res, html.loginPage);
};

app.use(readBody);
app.use(logRequest);
app.get(serveFile);
app.post("/home", renderHomePage);
app.post("/login", renderLoginPage);

module.exports = app.handleRequest.bind(app);
