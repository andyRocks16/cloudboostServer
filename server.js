var fs = require('fs');

global.keys = require('./config/keys.js'); //since app gets this value when initialized!!!
require('./app')();

global.app.set('port', process.env.PORT || 8081);

var http = null;
var https = null;
var httpsOptions = {};
try {
	if (fs.statSync('./config/cert.crt').isFile() && fs.statSync('./config/key.key').isFile()) {
		//use https
		console.log("Running on HTTPS protocol.");
		httpsOptions = {
			key: fs.readFileSync('./config/key.key'),
			cert: fs.readFileSync('./config/cert.crt')
		};
		https = require('https').Server(httpsOptions, global.app);

	}
} catch (e) {
	//crt and key not found.
}

try {
	if (!https) {
		if (fs.statSync('./config/cert.pem').isFile() && fs.statSync('./config/key.pem').isFile()) {
			//use https
			console.log("Running on HTTPS protocol.");
			httpsOptions = {
				key: fs.readFileSync('./config/key.pem'),
				cert: fs.readFileSync('./config/cert.pem')
			};
			https = require('https').Server(httpsOptions, global.app);

		}
	}
} catch (e) {
	console.log("INFO : SSL Certificate not found or is invalid.");
	console.log("Switching ONLY to HTTP...");
}

http = require('http').createServer(global.app);

http.listen(global.app.get('port'), function() {
	console.log("");
	console.log("CBFrontend Services runing on PORT:" + global.app.get('port'));
});

if (https) {
	https.listen(8080, function() {
		console.log("HTTPS Server started.");
	});
}
