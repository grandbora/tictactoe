module.exports = function(app, io, express) {

	// Configuration
	app.configure(function() {

		app.use(express.static(__dirname + '/../public'));
		app.set('views', __dirname + '/../views');
		app.set('view engine', 'ejs');

		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({
			secret : GLOBAL.globalConfig.SESSION_SECRET
		}));
		app.use(require('faceplate').middleware({
			app_id : GLOBAL.globalConfig.FACEBOOK_APP_ID,
			secret : GLOBAL.globalConfig.FACEBOOK_SECRET,
			scope : ''
		}));
		app.use(app.router);

		io.set("transports", [ "xhr-polling" ]);
		io.set("polling duration", GLOBAL.globalConfig.SOCKET_IO.POLLING_DURATION);
		io.set("close timeout", GLOBAL.globalConfig.SOCKET_IO.CLOSE_TIMEOUT);
		io.set('log level', GLOBAL.globalConfig.SOCKET_IO.LOG_LEVEL);
	});

	app.configure('dev', 'stage', function() {
		app.use(express.errorHandler({
			dumpExceptions : true,
			showStack : true
		}));
	});
	
	app.configure('prod', function() {
		app.use(express.errorHandler({
			dumpExceptions : false,
			showStack : false
		}));
	});
};