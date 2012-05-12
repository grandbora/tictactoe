var playerModel = require('./../models/player');

exports.beforeHandler = function(app, req, res, next) {

	if (req.facebook.token && req.session.fbData)
	{
		setPlayerChallengeToView(app, req.session.fbData, next);
	} else if (req.facebook.token)
	{
		if (req.body.signed_request)
		{// set fb cookie
			res.cookie('fbsr_' + GLOBAL.globalConfig.FACEBOOK_APP_ID, req.body.signed_request);
		}

		req.facebook.get('/me', function(me) {
			req.session.fbData = me;
			setPlayerChallengeToView(app, req.session.fbData, next);
		});
	} else
	{
		redirectToFbAuth(req, res);
	}
};

exports.index = function(req, res) {
	res.render('index');
};

function setPlayerChallengeToView(app, fbData, next) {
	// initialize player
	var player = new playerModel();
	player.init(fbData);

	app.set('view options', {
		layout : false,
		me : fbData
	});
	next();
}

function redirectToFbAuth(req, res) {
	var targetUrl = "https://www.facebook.com/dialog/oauth";
	targetUrl += "?client_id=" + GLOBAL.globalConfig.FACEBOOK_APP_ID;
	targetUrl += "&redirect_uri=" + GLOBAL.globalConfig.APP_URL;
	targetUrl += "&response_type=token";
	// targetUrl += "&scope=";

	res.render('login', {
		layout : false,
		loginUrl : targetUrl
	});
}