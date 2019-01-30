const html = {
  homepage: name => `<!DOCTYPE html>
  <html>
  <head>
    <title>TODO</title>
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="todoList.js"></script>
  </head>
  <body class="mainPage">
    <div class="titleBar">
    <a class="homeLogo" href="/" >&#127760</a>
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
            cols="25"
            rows="5"
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
    <body class="mainPage">
      <h2>TODO LIST</h2>
      <div class="inputArea">
        <h3 style="padding-top: 50px">Log in to your account</h3>
        <div class="loginForm">
          <form action="/" method="post">
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
    <body class="mainPage">
      <h2>TODO LIST</h2>
      <div class="inputArea">
        <h3 style="padding-top: 20px">Create your account</h3>
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
  `,
  todoListPage: (username, listname, description) => `<!DOCTYPE html>
  <html>
    <head>
      <title>User Todo List</title>
      <link rel="stylesheet" type="text/css" href="/main.css" />
      <script src="/todoItem.js"></script>
    </head>
    <body class="mainPage">
      <div class="titleBar">
      <a class="homeLogo" href="/" >&#127760</a>
        <div class="appName">TODO</div>
        <div style="width:550px;height:40px;margin-left:300px">
        <p style="font-size:25px;text-align:center">${listname}</p></div>
        <div class="userName">
          ${username} <a href="/logout"><button class="logOut">Logout</button></a>
        </div>
      </div>
      <div style="display: flex">
      <div class="listContainer">
      <div style=padding-left:20px>description: ${description}</div>
            <h3>Todo Items</h3>
            <div><ul id="todoItems"></ul></div>
          </div>
          <div class="addList">
            <h3>Add item</h3>
            <div style="padding: 15px">
              <p>Description:</p>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="5"
              ></textarea>
              <br /><br />
              <button class="submit" id="add">Add</button>
            </div>
          </div>
    </body>
  </html>
  `,
  editListPage: (name, title, description, id) => `<html>
  <head>
    <title>Edit todo list</title>
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
    <body style="background: silver" class="mainPage">
  </head>
  <body class="mainPage">
    <div class="titleBar">
    <a class="homeLogo" href="/" >&#127760</a>
      <div class="appName">TODO</div>
      <div class="userName">
        ${name} <a href="/logout"><button class="logOut">Logout</button></a>
      </div>
    </div>
    <div class="inputArea">
      <h2 style="padding-top: 50px">Edit your todo list</h2>
      <div class="loginForm">
        <form action="/list/edit" method="post" style="font-size: 20px">
          <label>Title : </label>
          <input
            style="font-size: 20px; height: 40px; width: 450px"
            type="text"
            name="title"
            id="title"
            value="${title}"
            required
          />
          <br /><br />
          <label>Description : </label>
          <input
            style="font-size: 20px; height: 40px; width: 450px"
            type="text"
            name="description"
            id="description"
            value="${description}"
            required
          />
          <br /><br />
          <input type="hidden" name="id" value="${id}"/>
          <button class="submit" type="submit" value="submit">Save</button>
        </form>
      </div>
    </div>
  </body>
</html>
`,
  editItemPage: (name, description, listId, itemId) => `<html>
<head>
  <title>Edit Todo Item</title>
  <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
</head>
<body class="mainPage">
  <div class="titleBar">
  <a class="homeLogo" href="/" >&#127760</a>
    <div class="appName">TODO</div>
    <div class="userName">
      ${name} <a href="/logout"><button class="logOut">Logout</button></a>
    </div>
  </div>
  <div class="inputArea">
    <h2 style="padding-top: 50px">Edit todo Item</h2>
    <div class="loginForm">
      <form action="/item/edit" method="post" style="font-size: 20px">
        
        <label>Description : </label>
        <input
          style="font-size: 20px; height: 40px; width: 450px"
          type="text"
          name="description"
          id="description"
          value="${description}"
          required
        />
        <br /><br />
        <input type="hidden" name="listId" value="${listId}"/>
        <input type="hidden" name="itemId" value="${itemId}"/>
        <button class="submit" type="submit" value="submit">Save</button>
      </form>
    </div>
  </div>
</body>
</html>
`,
  pageNotFoundError: `<!DOCTYPE html>
<html>
  <head>
    <title>Page Not Found</title>
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
  </head>
  <body style="background: rgb(153, 161, 170)">
    <div class="pageNotFoundErrorDiv">
      <p class="pageNotFoundErrorStatusCode">404</p>
      <p class="pageNotFoundErrorWebpageText">Webpage</p>
      <p class="pageNotFoundErrorNotFoundText">Not Found</p>
      </div>
    </div>
  </body>
</html>
`,
  authorizationError: `<!DOCTYPE html>
<html>
  <head>
    <title>authorization error</title>
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
  </head>
  <body style="background: rgb(153, 161, 170)">
    <div class="pageNotFoundErrorDiv">
      <p class="pageNotFoundErrorStatusCode">401</p>
      <p class="pageNotFoundErrorWebpageText">Authorization</p>
      <p class="pageNotFoundErrorNotFoundText">has been refused</p>
      </div>
    </div>
  </body>
</html>`
};

module.exports = html;
