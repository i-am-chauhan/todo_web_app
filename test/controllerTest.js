const { assert, expect, should } = require("chai");
const html = require("../src/template");
const {
  renderUserHomePage,
  createNewAccount
} = require("../src/todoController");

describe("renderUserHomePage", function() {
  let req;
  let res;
  let next;
  let userInfo;
  beforeEach(() => {
    userInfo = { moumita: { name: "moumita", password: "1234" } };
    req = {
      method: "POST",
      url: "/home",
      headers: { cookie: "userId=moumita" }
    };
    next = () => {};
    res = { setHeader: () => {} };
  });
  it("should return the home page with 200 status code for the given request", function(done) {
    req.body = "userId=moumita&password=1234";
    const send = (res, content, statusCode = 200) => {
      assert.deepEqual(content, html.homepage(userInfo.moumita.name));
      assert.deepEqual(statusCode, 200);
      done();
    };
    renderUserHomePage(req, res, send, next, userInfo);
  });
  it("should return authentication error message and 401 status code for the wrong password", function(done) {
    req.body = "userId=moumita&password=3456";
    const send = (res, content, statusCode = 200) => {
      assert.deepEqual(content, html.authorizationError);
      assert.deepEqual(statusCode, 401);
      done();
    };
    renderUserHomePage(req, res, send, next, userInfo);
  });
  it("should return authentication error message and 401 status code for the wrong userId", function(done) {
    req.body = "userId=shubham&password=1234";
    const send = (res, content, statusCode = 200) => {
      assert.deepEqual(content, html.authorizationError);
      assert.deepEqual(statusCode, 401);
      done();
    };
    renderUserHomePage(req, res, send, next, userInfo);
  });
});

describe("createNewAccount", function() {
  it("should return the sign up page and 200 status code for the given request", function() {
    const req = { method: "POST", url: "/signup" };
    req.body = "name=shubham&password=12&email=yes@gmail.com&userId=xyz";
    const res = {
      statusCode: "",
      headers: {},
      setHeader: function(key, value) {
        this.headers[key] = value;
      },
      end: function() {
        assert.equal(this.headers["location"], "/login");
        assert.equal(this.statusCode, 302);
      }
    };
    const send = () => {};
    const next = () => {};
    const fs = {};
    fs.writeFile = () => {};

    createNewAccount(req, res, send, next, fs);
  });
});
