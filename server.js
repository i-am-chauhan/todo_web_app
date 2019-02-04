const app = require("./src/app.js");

const PORT = 8002;

app.listen(PORT, () => {
	console.log("listening on ", PORT);
});
