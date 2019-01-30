const fs = require("fs");
const {
  readArgs,
  getURLPath,
  writeJsonData,
  readFile,
  redirect,
  format
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
  const todoList = new TodoList(list.title, list.description, list.status);
  list.items.forEach(item => {
    todoList.addItem(new TodoItem(item.description, item.status));
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
      send(res, html.pageNotFoundError, 404);
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

const renderUserHomePage = function(
  req,
  res,
  send,
  next,
  informations = userInfo
) {
  const args = req.body;
  let { userId, password } = readArgs(args);
  userId = format(userId);
  password = format(password);
  if (!isValidUser(userId, password, informations)) {
    send(res, html.authorizationError, 401);
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
  name = format(name);
  email = format(email);
  userId = format(userId);
  password = format(password);
  userInfo[userId] = { name, email, userId, password };
  userTodoData[userId] = new UserTODOs(userId);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData, fileSystem);
  writeJsonData(USER_DATA_JSON, userInfo, fileSystem);
  send(res, html.signupPage);
};

const createTodoList = function(title, description, userId) {
  const formattedTitle = format(title);
  const formattedDescription = format(description);
  const list = new TodoList(formattedTitle, formattedDescription, "undone");
  userTodoData[userId].addTodoList(list);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
};

const getTodoListTitlesAndStatus = function(userId) {
  return userTodoData[userId].todoList.map(list => {
    return { title: list.title, status: list.status };
  });
};

const saveTodoList = function(req, res, send) {
  let { title, description } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  title = format(title);
  description = format(description);
  createTodoList(title, description, userId);
  const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
  const content = JSON.stringify(todoListTitlesAndStatus);
  send(res, content);
};

const handleLogout = function(req, res, send) {
  const cookie = req.headers["cookie"];
  delete cookies[cookie];
  writeJsonData(COOKIES_JSON, cookies);
  res.setHeader("Set-Cookie", "userId=;Expires= Thu, 1 JAN 1970 00:00:01 GMT;");
  redirect(res, "/login", 302);
};

const serveLoginPage = function(req, res, send) {
  return send(res, html.loginPage);
};

const serveSignupPage = function(req, res, send) {
  return send(res, html.signupPage);
};

const serveHomePage = function(req, res, send) {
  const cookie = req.headers["cookie"];
  if (!cookies[cookie] || !cookie) {
    return send(res, html.loginPage);
  }
  const name = userInfo[getUserId(cookie)].name;
  send(res, html.homepage(name));
};

const showTodoList = function(req, res, send) {
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
  const content = JSON.stringify(todoListTitlesAndStatus);
  send(res, content);
};

const parseURL = function(url) {
  return readArgs(url.split("?")[1]);
};

const serveItems = function(req, res, send) {
  const { id } = parseURL(req.url);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+id];
  send(res, JSON.stringify(list.items));
};

const getListDescription = function(userId, id) {
  return userTodoData[userId].todoList[+id].description;
};

const renderListPage = function(req, res, send) {
  let { title, id } = parseURL(req.url);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const userName = userInfo[userId].name;
  const description = getListDescription(userId, id);
  title = format(title);
  send(res, html.todoListPage(userName, title, description));
};

const createTodoItem = function(description, list) {
  const formattedDescription = format(description);
  const item = new TodoItem(formattedDescription, "undone");
  list.addItem(item);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
};

const saveTodoItem = function(req, res, send) {
  const { description, listId } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+listId];
  createTodoItem(description, list);
  const content = JSON.stringify(list.items);
  send(res, content);
};

const renderEditListPage = function(req, res, send) {
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const userName = userInfo[userId].name;
  let { title, id } = parseURL(req.url);
  title = format(title);
  const description = getListDescription(userId, id);
  send(res, html.editListPage(userName, title, description, id));
};

const editList = function(req, res) {
  let { title, description, id } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+id];
  title = format(title);
  description = format(description);
  list.editDetails(title, description);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  redirect(res, "/", 302);
};

const deleteList = function(req, res) {
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const { id } = parseURL(req.url);
  userTodoData[userId].deleteTodoList(+id);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  redirect(res, "/", 302);
};

const renderEditItemPage = function(req, res, send) {
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const userName = userInfo[userId].name;
  const { listId, itemId } = parseURL(req.url);
  const item = userTodoData[userId].todoList[+listId].items[+itemId];
  const description = item.description;
  const content = html.editItemPage(userName, description, listId, itemId);
  send(res, content);
};

const editItem = function(req, res) {
  let { description, listId, itemId } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+listId];
  const listTitle = list.title;
  const item = list.items[+itemId];
  description = format(description);
  item.editDetails(description);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  redirect(res, `/list/view?title=${listTitle}&id=${listId}`, 302);
};

const deleteItem = function(req, res) {
  const { listId, itemId } = parseURL(req.url);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+listId];
  const listTitle = list.title;
  list.deleteItem(itemId);
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  redirect(res, `/list/view?title=${listTitle}&id=${listId}`, 302);
};

const toggleListStatus = function(req, res, send) {
  const listId = req.body;
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+listId];
  list.toggleStatus();
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
  const content = JSON.stringify(todoListTitlesAndStatus);
  send(res, content);
};

const toggleItemStatus = function(req, res, send) {
  const { listId, itemId } = readArgs(req.body);
  const cookie = req.headers["cookie"];
  const userId = getUserId(cookie);
  const list = userTodoData[userId].todoList[+listId];
  const items = list.items;
  items[itemId].toggleStatus();
  writeJsonData(USER_TODO_DATA_JSON, userTodoData);
  send(res, JSON.stringify(items));
};

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
  serveHomePage,
  showTodoList,
  serveItems,
  renderListPage,
  saveTodoItem,
  renderEditListPage,
  editList,
  deleteList,
  editItem,
  renderEditItemPage,
  deleteItem,
  toggleListStatus,
  toggleItemStatus
};
