"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : {default: mod};
	};
Object.defineProperty(exports, "__esModule", {value: true});
exports.io = exports.app = void 0;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var cors_1 = __importDefault(require("cors"));
//Setup server settings
exports.app = (0, express_1.default)();
var limiter = (0, express_rate_limit_1.default)({
	windowMs: 1 * 60 * 1000,
	max: 1000 // limit each IP to 100 requests per windowMs
});
exports.app.use(body_parser_1.default.urlencoded({extended: false}));
exports.app.use((0, helmet_1.default)());
exports.app.use(limiter);
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
//Content Security Policy
exports.app.use(function (req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self';");
	next();
});
//Redirect http to https
exports.app.use(function (request, response, next) {
	if (request.hostname != "localhost" && request.hostname != "127.0.0.1" && !request.secure) {
		return response.redirect("https://" + request.headers.host + request.url);
	}
	next();
});
//Static files
exports.app.use(express_1.default.static("../frontend/dist"));
//Index page
exports.app.get("/", function (req, res) {
	res.sendFile("../frontend/dist/index.html");
});
//Setup http & https server
var http_1 = __importDefault(require("http"));
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
var httpServer = http_1.default.createServer(exports.app);
/**httpsServer.listen(443, () => {
    console.log('listening on *:443');
});*/
httpServer.listen(5000, function () {
	console.log("listening on *:5000");
});
//Setup socket.io
exports.io = require("socket.io")(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});
//Load logic
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var logicPath = path_1.default.join(__dirname, "games");
var logicFiles = fs_1.default.readdirSync(logicPath);
for (var _i = 0, logicFiles_1 = logicFiles; _i < logicFiles_1.length; _i++) {
	var file = logicFiles_1[_i];
	if (fs_1.default.lstatSync(path_1.default.join(logicPath, file)).isDirectory()) {
		if (fs_1.default.existsSync(path_1.default.join(logicPath, file, "main.js"))) {
			require(path_1.default.join(logicPath, file, "main.js"));
		}
	} else {
		require(path_1.default.join(logicPath, file));
	}
}
//Redirect everything else to index
exports.app.use("/*", express_1.default.static("../frontend/dist/index.html"));
