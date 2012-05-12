exports.index = function(req, res) {
	res.header("Pragma", "public");
	res.header("Cache-Control", "max-age=31536000");
	res.header("Expires", "Wed, 01 Apr 2020 20:20:20 GMT");
	res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');
};