const http = require("http");
const { handler } = require("./src/app.js");

const PORT = process.env.PORT || 8002;

let server = http.createServer(handler);
server.listen(PORT, () => console.log("listening on ", PORT));
