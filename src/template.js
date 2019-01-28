const html = {
  homepage: name => `<!DOCTYPE html>
  <html>
  <head>
    <title>TODO</title>
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="todo.js"></script>
  </head>
  <body class="mainPage">
    <div class="titleBar">
      <div class="appName">TODO</div>
      <div class="userName">
        ${name} <a href="/logout"><button class="logOut">Logout</button></a>
      </div>
    </div>
    <div style="display: flex">
      <div class="listContainer">
        <h3>Todo List</h3>
        <div><ul id="todoLists"></ul></div>
      </div>
      <div class="addList">
        <h3>Add your todo</h3>
        <div style="padding: 15px">
          <label>Title:</label>
          <input
            style="width:200px;height:20px"
            type="text"
            name="title"
            id="title"
          />
          <br /><br />
          Description:
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
          ></textarea>
          <br /><br />
          <button class="submit" id="add">Add</button>
        </div>
      </div>
    </div>
  </body>
</html>`,
  loginPage: `<!DOCTYPE html>
  <html>
    <head>
      <title>LogIn page</title>
      <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
      <script src="main.js"></script>
    </head>
    <body style="background: silver">
      <h2>TODO LIST</h2>
      <div class="inputArea">
        <h3 style="padding-top: 50px">Log in to your account</h3>
        <div class="loginForm">
          <form action="/home" method="post">
            <label>User-Id : </label>
            <input type="text" name="userId" id="userId" required/> <br /><br />
            <label>Password : </label>
            <input type="password" name="password" id="password" required/> <br /><br />
            <button class="submit" type="submit" value="submit">Submit</button>
          </form>
        </div>
        <div>
          <a href="/signup"> <h3>Create a new acccount</h3></a>
        </div>
      </div>
    </body>
  </html>
  `,
  signupPage: `<!DOCTYPE html>
  <html>
    <head>
      <title>SignUp page</title>
      <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
      <script src="main.js"></script>
    </head>
    <body style="background: silver">
      <h2>TODO LIST</h2>
      <div class="inputArea">
        <h3 style="padding-top: 50px">Create your account</h3>
        <div class="loginForm">
          <form action="/createNewAccount" method="post">
            <label>Name : </label>
            <input type="text" name="name" id="name" required /> <br /><br />
            <label>Email-Id : </label>
            <input type="email" name="email" id="email" required /> <br /><br />
            <label>UserId : </label>
            <input type="text" name="userId" id="userId" required /> <br /><br />
            <label>Password : </label>
            <input type="password" name="password" id="password" required />
            <br /><br />
            <button class="submit" type="submit" value="submit">Submit</button>
          </form>
          </div>
          <a href="/login"> <h3><< Go back to login page</h3></a>
      </div>
    </body>
  </html>
  `
};

module.exports = html;
