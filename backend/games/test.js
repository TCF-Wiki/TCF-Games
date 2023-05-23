console.log("Test");

const {app, io} = require("../server.js");

app.get("/test", (req, res) => {
	res.send("Test");
});
