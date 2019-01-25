const { Handler, isMatching, send } = require("../src/framework");
const { assert, expect, should } = require("chai");

describe("isMatching", function() {
  it("should return true when req.method and route.method are same ", function() {
    const req = { method: "GET", url: "/login" };
    const route = { method: "GET", url: "/login" };
    assert.isTrue(isMatching(req, route));
  });
  it("should return false when req.method and route.method are not same", function() {
    const req = { method: "GET", url: "/login" };
    const route = { method: "POST", url: "/login" };
    assert.isFalse(isMatching(req, route));
  });
  it("should return true when method is POST and req.url and route.url are same", function() {
    const req = { method: "POST", url: "/login" };
    const route = { method: "POST", url: "/login" };
    assert.isTrue(isMatching(req, route));
  });
  it("should return false when method is POST and req.url and route.url are not same", function() {
    const req = { method: "POST", url: "/login" };
    const route = { method: "POST", url: "/signup" };
    assert.isFalse(isMatching(req, route));
  });
});

describe("Handler", function() {
  describe("use", function() {
    const reqHandler = new Handler();
    it("expects to have the given handler as a member of handler.routes", function() {});
    reqHandler.use("serveFile");
    expect(reqHandler.routes).to.have.deep.members([{ handler: "serveFile" }]);
  });
  describe("get", function() {
    const reqHandler = new Handler();
    it("expects to have the given handler as a member of handler.routes", function() {});
    reqHandler.get("serveFile");
    expect(reqHandler.routes).to.have.deep.members([
      { method: "GET", handler: "serveFile" }
    ]);
  });
  describe("post", function() {
    const reqHandler = new Handler();
    it("expects to have the given handler as a member of handler.routes", function() {});
    reqHandler.post("/home", "serveFile");
    expect(reqHandler.routes).to.have.deep.members([
      { method: "POST", handler: "serveFile", url: "/home" }
    ]);
  });
  describe("handleRequest", function() {
    const reqHandler = new Handler();
    beforeEach(() => {
      const handlerForGet = (req, res, send) => {
        send(res, "hello");
      };
      const handlerForPost = (req, res, send) => {
        send(res, "hi");
      };
      reqHandler.post("/home", handlerForPost);
      reqHandler.get(handlerForGet);
    });
    it("should call handlerForGet for GET method", function(done) {
      const res = {};
      res.write = content => {
        res.body = content;
      };
      res.end = () => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("hello");
        done();
      };
      const req = { method: "GET", url: "/login" };
      reqHandler.handleRequest(req, res);
    });
    it("should call handlerForPost for POST method", function(done) {
      const res = {};
      res.write = content => {
        res.body = content;
      };
      res.end = () => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("hi");
        done();
      };
      const req = { method: "POST", url: "/home" };
      reqHandler.handleRequest(req, res);
    });
    it("should not change the response object for empty routes", function() {
      const reqHandler = new Handler();
      const res = {};
      const req = { method: "POST", url: "/home" };
      reqHandler.handleRequest(req, res);
      expect(res).to.deep.equal({});
    });
  });
});

describe("send", function() {
  it("should write the status code 200 and content in the given res object", function(done) {
    const res = {};
    res.write = content => {
      res.body = content;
    };
    res.end = () => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal("hello");
      done();
    };
    send(res, "hello");
  });
  it("should write the status code 404 and Not Found error message as content in the given res object", function(done) {
    const res = {};
    res.write = content => {
      res.body = content;
    };
    res.end = () => {
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.equal("Not Found");
      done();
    };
    send(res, "Not Found", 404);
  });
});
