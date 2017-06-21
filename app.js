module.exports = function () {

    //Express.
    var cors = require('cors');

    var express = require('express');
    global.app = express();
    var bodyParser = require('body-parser');

    global.app.use(bodyParser.json());
    global.app.use(bodyParser.urlencoded({ extended: true }));
    // global.app.use(cors());

    require('./api/Login/login.js')();

    global.app.set('view engine', 'ejs');
    global.app.use(function (req, res, next) {

        //if req body is a string, convert it to JSON.
        if (typeof (req.body) === "string") {
            req.body = JSON.parse(req.body);
        }

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.host);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    global.app.use(function (req, res, next) {
        if (req.is('text/*')) {
            req.text = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                req.text += chunk;
            });
            req.on('end', next);
        } else {
            next();
        }
    });

    require('./config/mongo-connect.js').connectDB().then(function(db){
        global.mongoClient = db;
        initSecureKey();
    }, function(err){
        console.log(err, "Error occured")
    });

    global.app.get('/', function (req, res) {
        console.log("++++++connection established with /+++++++");
        return res.json({ status: "CloudBoost Secondary Server now running at port 8081" })
    });

    function initSecureKey() {
		try {
			require('./config/keyService.js')().initSecureKey().then(function(secureKey) {
				//Register SecureKey in AnalyticsServer
				global.cbServerService.registerServer(secureKey);
			});

		} catch (err) {
			global.winston.log('error', {
				"error": String(err),
				"stack": new Error().stack
			});
		}
	}
};
