"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
console.log("Test");
var server_jsx_1 = require("../server.jsx");
server_jsx_1.app.get("/api/test", function (req, res) {
	res.send("Test");
});
