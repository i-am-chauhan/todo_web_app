const fs = require("fs");
const { readArgs, writeJsonData, readFile, format } = require("./appUtil.js");

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
	list.items.forEach((item) => {
		todoList.addItem(new TodoItem(item.description, item.status));
	});
	userTodo.addTodoList(todoList);
};

const restoreTODOsClass = function(todoObject) {
	Object.keys(todoObject).forEach((userId) => {
		const userTodo = new UserTODOs(userId);
		todoObject[userId].todoList.forEach(makeTodoClass.bind(null, userTodo));
		todoObject[userId] = userTodo;
	});
};

restoreTODOsClass(userTodoData);

const hasCookie = function(userId, date) {
	return Object.keys(cookies).includes(userId) && cookies[userId].date == date;
};

const readCookie = function(req, res, next) {
	const userId = req.cookies.userId;
	const date = req.cookies.date;
	const URLToAccess = [
		"/login",
		"/signup",
		"/main.css",
		"/",
		"/createNewAccount"
	];
	if (!hasCookie(userId, date) && !URLToAccess.includes(req.url)) {
		res.redirect("/login");
		return;
	}
	next();
};

const readBody = (req, res, next) => {
	let content = "";
	req.on("data", (chunk) => {
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

const isValidUser = function(userId, password, informations = userInfo) {
	if (informations[userId]) {
		return informations[userId]["password"] == password;
	}
	return false;
};

const renderUserHomePage = function(req, res, next, informations = userInfo) {
	const args = req.body;
	let { userId, password } = readArgs(args);
	userId = format(userId);
	password = format(password);
	if (!isValidUser(userId, password, informations)) {
		res.status(401).send(html.authorizationError);
		return;
	}
	const date = new Date().toGMTString();
	res.cookie("userId", userId);
	res.cookie("date", date);

	cookies[userId] = { userId, date };
	writeJsonData(COOKIES_JSON, cookies);
	res.send(html.homepage(informations[userId].name));
};

const doesAccountExist = function(userId) {
	return Object.keys(userInfo).includes(userId);
};

const createNewAccount = function(req, res, next, fileSystem = fs) {
	let { name, email, userId, password } = readArgs(req.body);
	if (doesAccountExist(userId))
		return res.status(401).send("Already have an account with this userId");
	name = format(name);
	email = format(email);
	userId = format(userId);
	password = format(password);
	userInfo[userId] = { name, email, userId, password };
	userTodoData[userId] = new UserTODOs(userId);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData, fileSystem);
	writeJsonData(USER_DATA_JSON, userInfo, fileSystem);
	res.redirect("/login");
};

const createTodoList = function(title, description, userId) {
	const formattedTitle = format(title);
	const formattedDescription = format(description);
	const list = new TodoList(formattedTitle, formattedDescription, "undone");
	userTodoData[userId].addTodoList(list);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
};

const getTodoListTitlesAndStatus = function(userId) {
	return userTodoData[userId].todoList.map((list) => {
		return { title: list.title, status: list.status };
	});
};

const saveTodoList = function(req, res) {
	let { title, description } = readArgs(req.body);
	const userId = req.cookies.userId;
	title = format(title);
	description = format(description);
	createTodoList(title, description, userId);
	const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
	const content = JSON.stringify(todoListTitlesAndStatus);
	res.send(content);
};

const handleLogout = function(req, res) {
	const userId = req.cookies.userId;
	delete cookies[userId];
	writeJsonData(COOKIES_JSON, cookies);
	res.clearCookie("userId");
	res.redirect("/login");
};

const serveLoginPage = function(req, res) {
	const userId = req.cookies.userId;
	const date = req.cookies.date;
	if (hasCookie(userId, date)) return res.redirect("/");
	return res.send(html.loginPage);
};

const serveSignupPage = function(req, res) {
	const userId = req.cookies.userId;
	const date = req.cookies.date;
	if (hasCookie(userId, date)) return res.redirect("/");
	return res.send(html.signupPage);
};

const serveHomePage = function(req, res) {
	const userId = req.cookies.userId;
	const date = req.cookies.date;
	if (!hasCookie(userId, date)) {
		return res.redirect("/login");
	}
	const name = userInfo[userId].name;
	res.send(html.homepage(name));
};

const showTodoList = function(req, res) {
	const userId = req.cookies.userId;
	const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
	const content = JSON.stringify(todoListTitlesAndStatus);
	res.send(content);
};

const parseURL = function(url) {
	return readArgs(url.split("?")[1]);
};

const serveItems = function(req, res) {
	const { id } = parseURL(req.url);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+id];
	res.send(JSON.stringify(list.items));
};

const getListDescription = function(userId, id) {
	return userTodoData[userId].todoList[+id].description;
};

const isValidList = function(userId, title, id) {
	const index = +id;
	const allList = userTodoData[userId].todoList;
	const list = allList[index];
	return allList.hasOwnProperty(index) && list.title == title;
};

const renderListPage = function(req, res) {
	let { title, id } = parseURL(req.url);
	const userId = req.cookies.userId;
	const userName = userInfo[userId].name;
	title = format(title);
	if (!isValidList(userId, title, id)) {
		return res.status(404).send(html.pageNotFoundError);
	}
	const description = getListDescription(userId, id);
	res.send(html.todoListPage(userName, title, description));
};

const createTodoItem = function(description, list) {
	const formattedDescription = format(description);
	const item = new TodoItem(formattedDescription, "undone");
	list.addItem(item);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
};

const saveTodoItem = function(req, res) {
	const { description, listId } = readArgs(req.body);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+listId];
	createTodoItem(description, list);
	const content = JSON.stringify(list.items);
	res.send(content);
};

const renderEditListPage = function(req, res) {
	const userId = req.cookies.userId;
	const userName = userInfo[userId].name;
	let { title, id } = parseURL(req.url);
	title = format(title);
	if (!isValidList(userId, title, id)) {
		return res.status(404).send(html.pageNotFoundError);
	}
	const description = getListDescription(userId, id);
	res.send(html.editListPage(userName, title, description, id));
};

const editList = function(req, res) {
	let { title, description, id } = readArgs(req.body);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+id];
	title = format(title);
	description = format(description);
	list.editDetails(title, description);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	res.redirect("/");
};

const deleteList = function(req, res) {
	const userId = req.cookies.userId;
	let { title, id } = parseURL(req.url);
	title = format(title);
	if (!isValidList(userId, title, id)) {
		return res.status(404).send(html.pageNotFoundError);
	}
	userTodoData[userId].deleteTodoList(+id);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	res.redirect("/");
};

const isValidItem = function(userId, listId, itemId) {
	const allList = userTodoData[userId].todoList;
	const listItems = allList[+listId].items;
	return allList.hasOwnProperty(+listId) && listItems.hasOwnProperty(+itemId);
};

const renderEditItemPage = function(req, res) {
	const userId = req.cookies.userId;
	const userName = userInfo[userId].name;
	const { listId, itemId } = parseURL(req.url);
	if (!isValidItem(userId, listId, itemId)) {
		return res.status(404).send(html.pageNotFoundError);
	}
	const item = userTodoData[userId].todoList[+listId].items[+itemId];
	const description = item.description;
	const content = html.editItemPage(userName, description, listId, itemId);
	res.send(content);
};

const editItem = function(req, res) {
	let { description, listId, itemId } = readArgs(req.body);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+listId];
	const listTitle = list.title;
	const item = list.items[+itemId];
	description = format(description);
	item.editDetails(description);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	res.redirect(`/list/view?title=${listTitle}&id=${listId}`);
};

const deleteItem = function(req, res) {
	const { listId, itemId } = parseURL(req.url);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+listId];
	const listTitle = list.title;
	if (!isValidItem(userId, listId, itemId)) {
		return res.status(404).send(html.pageNotFoundError);
	}
	list.deleteItem(itemId);
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	res.redirect(`/list/view?title=${listTitle}&id=${listId}`);
};

const toggleListStatus = function(req, res) {
	const listId = req.body;
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+listId];
	list.toggleStatus();
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	const todoListTitlesAndStatus = getTodoListTitlesAndStatus(userId);
	const content = JSON.stringify(todoListTitlesAndStatus);
	res.send(content);
};

const toggleItemStatus = function(req, res) {
	const { listId, itemId } = readArgs(req.body);
	const userId = req.cookies.userId;
	const list = userTodoData[userId].todoList[+listId];
	const items = list.items;
	items[itemId].toggleStatus();
	writeJsonData(USER_TODO_DATA_JSON, userTodoData);
	res.send(JSON.stringify(items));
};

module.exports = {
	readCookie,
	readBody,
	logRequest,
	// serveFile,
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
