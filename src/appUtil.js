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

const writeJsonData = (path, content, fileSystem = fs) => {
  fileSystem.writeFile(path, JSON.stringify(content), err => {});
};

const readFile = function(filePath) {
  if (!fs.existsSync("private")) fs.mkdirSync("private");
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}", "utf-8");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const format = function(content) {
  return unescape(content).replace(/\+/g, " ");
};

module.exports = {
  readArgs,
  writeJsonData,
  readFile,
  format
};
