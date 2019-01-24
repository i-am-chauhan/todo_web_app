const { Handler, isMatching } = require("../src/framework");
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
});
