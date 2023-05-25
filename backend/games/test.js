console.log("Test");

const {app, io} = require("../server.js");

app.get("/api/test", (req, res) => {
	res.send("Test");
});
