module.exports = function(app) {

	var lounge = require(__dirname + '/lounge.js');
	var channel = require(__dirname + '/channel.js');

	/*
	 * Routes
	 */

	// fb stuff
	app.all('/channel', channel.index);

	// before handler , runs for every request except for "channel" and static
	// @todo add regexp to filter static files and channels 
	app.all('/*', function(req, res, next) {
		lounge.beforeHandler(app, req, res, next);
	});

	// lounge
	app.post('/', lounge.index);
	app.get('/', lounge.index);
};