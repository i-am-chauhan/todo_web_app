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
  if (url == "/" || url == "/login") return "login";
  if (url == "/signup") return "signup";
  return "./public" + url;
};

module.exports = {
  readArgs,
  getURLPath
};
