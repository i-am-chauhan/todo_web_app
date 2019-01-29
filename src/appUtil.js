const fs = require("fs");

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const getURLPath = function(url) {
  return "./public" + url;
};

const writeJsonData = (path, content, fileSystem = fs) => {
  fileSystem.writeFile(path, JSON.stringify(content), err => {});
};

const readFile = function(filePath) {
  if(!fs.existsSync('private')) fs.mkdirSync('private');
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}", "utf-8");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const redirect = function(res, url, statusCode){
  res.setHeader('location', url);
  res.statusCode = statusCode;
  res.end();
}

module.exports = {
  readArgs,
  getURLPath,
  writeJsonData,
  readFile,
  redirect
};
