const fs = require("fs");
const {
  readArgs,
  getURLPath,
  writeJsonData,
  readFile
} = require("./appUtil.js");

const { TodoList, UserTODOs, TodoItem } = require("./todoModel.js");

const html = require("./template");
const {
  USER_DATA_JSON,
  USER_TODO_DATA_JSON,
  COOKIES_JSON
} = require("./constants");

const userInfo = readFile(USER_DATA_JSON);
const userTodoData = readFile(USER_TODO_DATA_JSON);
const cookies = readFile(COOKIES_JSON);

const makeTodoClass = (userTodo, list) => {
  const todoList = new TodoList(list.title, list.description);
  list.items.forEach(item => {
    todoList.addItem(new TodoItem(item.name, item.description));
  });
  userTodo.addTodoList(todoList);
};

const bringBackToClass = function(todoObject) {
  Object.keys(todoObject).forEach(userId => {
    const userTodo = new UserTODOs(userId);
    todoObject[userId].todoList.forEach(makeTodoClass.bind(null, userTodo));
    todoObject[userId] = userTodo;
  });
};

bringBackToClass(userTodoData);

const getUserId = cookie => {
  const userIdPair = cookie.split(";")[0];
  return userIdPair.split("=")[1];
};

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

const getFileContent = function(res, send, path) {
  fs.readFile(path, (err, content) => {
    if (err) {
      send(res, "File Not Found", 404);
      return;
    }
    send(res, content);
  });
};

const serveFile = function(req, res, send) {
  const path = getURLPath(req.url);
  getFileContent(res, send, path);
};

const isValidUser = function(userId, password, informations = userInfo) {
  if (informations[userId]) {
    return informations[userId]["password"] == password;
  }
  return false;
};

const renderUserHomePage = function(req, res, send, next, informations = userInfo) {
  const args = req.body;
  let { userId, password } = readArgs(args);
  userId = unescape(userId);
  password = unescape(password);
  if (!isValidUser(userId, password, informations)) {
    send(res, "authorization has been refused", 401);
    return;
  }
  const cookie = `userId=${userId}`;
  res.setHeader("Set-Cookie", cookie);
  cookies[cookie] = userId;
  writeJsonData(COOKIES_JSON, cookies);
  send(res, html.homepage(informations[userId].name));
};

const createNewAccount = function(req, res, send, next, fileSystem = fs) {
  let { name, email, userId, password } = readArgs(req.body);
  name = unescape(name).replace(/\+/g, " ");
  email = unescape(email);
  userId = unescape(userId);
  password = unescape(password);
  userInfo[userId] = { name, email, userId, password };
  userTodoData[userId] = new UserTODOs(userId);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData, fileSystem);
  writeJsonData(USER_DATA_JSON, userInfo, fileSystem);
  send(res, html.signupPage);
};

const createTodoList = function(title, description, userId) {
  const list = new TodoList(title, description);
  userTodoData[userId].addTodoList(list);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
};

const saveTodoList = function(req, res) {
  const { title, description } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  createTodoList(title, description, userId);
};

const handleLogout = function(req, res, send) {
  const cookie = req.headers["cookie"];
  delete cookies[cookie];
  writeJsonData(COOKIES_JSON, cookies);
  res.setHeader("Set-Cookie", "userId=;Expires= Thu, 1 JAN 1970 00:00:01 GMT;");
  send(res, html.loginPage);
};

const serveLoginPage = function(req, res, send) {
  return send(res, html.loginPage);
};

const serveSignupPage = function(req, res, send){
  return send(res, html.signupPage);
}

const serveHomePage = function(req, res, send){
  const cookie = req.headers["cookie"];
  if (!cookies[cookie] || !cookie) {
    return send(res, html.loginPage);
  }
  const name = userInfo[getUserId(cookie)].name;
  send(res, html.homepage(name));
}

module.exports = {
  readBody,
  logRequest,
  serveFile,
  renderUserHomePage,
  createNewAccount,
  saveTodoList,
  handleLogout,
  serveLoginPage,
  serveSignupPage,
  serveHomePage
};
