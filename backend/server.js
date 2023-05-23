const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

//Setup server settings
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors());

app.use(express.static("../frontend/dist"));

//Content Security Policy
app.use(function (req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self'; frame-src *");
	next();
});

//Index page
app.get("/", (req, res) => {
	res.sendFile("../frontend/dist/index.html");
});

//Setup http & https server
const http = require("http");
///const https = require('https');

// Certificate
/**const privateKey = fs.readFileSync('/etc/letsencrypt/live/fortunaguessr.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/fortunaguessr.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/fortunaguessr.com/chain.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
};*/

//Start server
///const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

/**httpsServer.listen(443, () => {
    console.log('listening on *:443');
});*/

httpServer.listen(5000, () => {
	console.log("listening on *:5000");
});

//Setup socket.io
const io = require("socket.io")(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

//Export app
module.exports = {
	app: app,
	io: io
};

//Load logic
const fs = require("fs");
const path = require("path");
const logicPath = path.join(__dirname, "games");
const logicFiles = fs.readdirSync(logicPath);
for (const file of logicFiles) {
	require(path.join(logicPath, file));
}

//Redirect everything else to index
app.use("/*", express.static("../frontend/dist/index.html"));
