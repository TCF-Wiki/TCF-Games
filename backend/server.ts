import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";

//Setup server settings
export const app = express();
const limiter = rateLimit({
	windowMs: 1000, // 1 second
	max: 100 // limit each IP to 100 requests per windowMs
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(compression());

//Function to run on all requests
app.use(function (req, res, next) {
	//Content Security Policy
	res.setHeader("Content-Security-Policy", "default-src 'self';" + "img-src 'self' data: thecyclefrontier.wiki;" + "script-src 'self' 'sha256-reBsRZd5I88opZSwT59Ir+QlBhrEhdRJ1aQUr4GXhyw=';" + "style-src 'self' 'unsafe-inline' fonts.googleapis.com;" + "font-src 'self' fonts.gstatic.com;" + "connect-src 'self' raw.githubusercontent.com/TCF-Wiki/TCF-Information/;");
	//Redirect http to https
	if (req.hostname != "localhost" && req.hostname != "127.0.0.1" && !req.secure) {
		return res.redirect("https://" + req.headers.host + req.url);
	}
	next();
});

//Static files
app.use(express.static("../frontend/dist"));

//Setup http & https server
import http from "http";
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
import {Server as IOServer} from "socket.io";
export const io = new IOServer(httpServer);

/*setInterval(function () {
	console.log("Connected sockets", io.engine.clientsCount);
	console.log("Rooms", io.sockets.adapter.rooms);
}, 5000);*/

//Load main logic
import "./mainLogic";

//Load logic
import fs from "fs";
import path from "path";
const logicPath = path.join(__dirname, "games");
const logicFiles = fs.readdirSync(logicPath);
for (const file of logicFiles) {
	if (fs.lstatSync(path.join(logicPath, file)).isDirectory()) {
		if (fs.existsSync(path.join(logicPath, file, "main.ts"))) {
			require(path.join(logicPath, file, "main.ts"));
		}
	} else {
		require(path.join(logicPath, file));
	}
}

//Redirect everything else to dist
app.use("/*", express.static("../frontend/dist"));
