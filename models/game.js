var redisLib = require('redis-url'), redis = redisLib.createClient(GLOBAL.globalConfig.REDIS_URL);
var playerModel = require('./player');

module.exports = function(home, guest, cb) {

	this.id;
	this.home;
	this.guest;
	this.score;

	// initialize a game
	this.init = function(home, guest, cb) {
		this.home = home;
		this.guest = guest;
		this.score = [ 0, 0 ];

		var self = this;
		redis.incr("gameCounter", function(err, gameCounter) {
			self.id = gameCounter;

			redis.hmset(self.getDbKey(), {
				home : self.home.getFbId(),
				guest : self.guest.getFbId(),
				score : JSON.stringify(self.score)
			});
			cb();
		});
	};

	// loads the game
	this.load = function(id, cb) {

		this.id = id;
		var self = this;

		redis.hgetall(self.getDbKey(), function(err, game) {

			var home = new playerModel();
			var guest = new playerModel();

			home.load(game.home, function() {
				guest.load(game.guest, function() {
					self.home = home;
					self.guest = guest;
					self.score = JSON.parse(game.score);
					cb();
				});
			});
		});
	};

	// clears the moveList
	this.clearMoveList = function(cb) {
		redis.ltrim(this.getDbMoveListKey(), 1, 0, cb());
	};

	// registers the move
	this.registerMove = function(moveData) {
		redis.rpush(this.getDbMoveListKey(), moveData);
	};

	/*
	 * utility
	 */
	this.getDbKey = function() {
		return "game:" + this.id;
	};

	this.getDbMoveListKey = function() {
		return "game:" + this.id + ":MoveList";
	};

	this.getRoomName = function() {
		return "room:" + this.id;
	};
};