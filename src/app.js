const { Handler } = require("./framework");
const app = new Handler();

const {
  readBody,
  logRequest,
  serveFile,
  renderUserHomePage,
  createNewAccount,
  saveTodoList,
  serveLoginPage,
  handleLogout,
  serveSignupPage,
  serveHomePage
} = require("./todoController");

app.use(readBody);
app.use(logRequest);
app.get('/', serveHomePage);
app.get('/signup', serveSignupPage);
app.get("/login", serveLoginPage);
app.get("/logout", handleLogout);
app.post("/home", renderUserHomePage);
app.post("/createNewAccount", createNewAccount);
app.post("/addList", saveTodoList);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
