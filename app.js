// create global config instance
var configBuilder = require('konphyg')(__dirname + "/config");
GLOBAL.globalConfig = configBuilder('config');

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

require('./config')(app, io, express);
require('./routes')(app);
require('./socket.js')(io);

// Fire up the server
app.listen(process.env.PORT, function() {
	// ("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});