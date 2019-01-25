const { expect } = require("chai");
const { readArgs, getURLPath } = require("../src/appUtil");

describe("readArgs", function() {
  it("should parse the given string into key value pairs", function() {
    expect(readArgs("name=moumita")).to.deep.equal({ name: "moumita" });
  });
  it("should parse the given string into key value pairs", function() {
    expect(readArgs("name=moumita&password=123")).to.deep.equal({
      name: "moumita",
      password: "123"
    });
  });
});

describe("getURLPath", function() {
  it("should return login when url is /", function() {
    expect(getURLPath("/")).to.equal("login");
  });
  it("should return login when url is /login", function() {
    expect(getURLPath("/login")).to.equal("login");
  });
  it("should return signup when url is /signup", function() {
    expect(getURLPath("/signup")).to.equal("signup");
  });
  it("should return given url with the prefix ./public except /,/login,/signup", function() {
    expect(getURLPath("/url")).to.equal("./public/url");
  });
});
