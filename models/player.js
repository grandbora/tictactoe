var redisLib = require('redis-url'), redis = redisLib.createClient(GLOBAL.globalConfig.REDIS_URL);
var sockets = {};

module.exports = function()
{

	var PLAYER_SET = 'playerSet';
	this.fbData;

	// initializes with given fb data
	this.init = function(fbData)
	{
		this.fbData = fbData;
		if ('undefined' == typeof sockets[this.getFbId()]) sockets[this.getFbId()] = [];
	};

	// saves player data to db
	this.register = function(socketId, cb)
	{
		var playerKey = this.getDbKey();

		// user came online
		redis.sadd(PLAYER_SET, playerKey);
		redis.hmset(playerKey, this.fbData);

		sockets[this.getFbId()].push(socketId);
		cb();
	};

	// loads player
	this.load = function(id, cb)
	{
		this.fbData = {
			id : id
		};

		var self = this;
		redis.hgetall(this.getDbKey(), function(err, player)
		{
			self.fbData.name = player.name;
			self.fbData.first_name = player.first_name;
			self.fbData.last_name = player.last_name;
			self.fbData.link = player.link;
			self.fbData.gender = player.gender;
			self.fbData.timezone = player.timezone;
			self.fbData.locale = player.locale;
			self.fbData.verified = player.verified;
			self.fbData.updated_time = player.updated_time;
			cb();
		});
	};

	// deletes player data from db
	this.unregister = function(socketId, cb)
	{

		for ( var i = 0; i < sockets[this.getFbId()].length; i++) {
			if (socketId == sockets[this.getFbId()][i]) {
				sockets[this.getFbId()].splice(i, 1);
				break;
			}
		}

		if (0 == sockets[this.getFbId()].length) { // user went offline
			redis.srem(PLAYER_SET, this.getDbKey());
			cb();
		}
	};

	// returns the list of registered players
	this.getOnlinePlayers = function(cb)
	{

		redis.smembers(PLAYER_SET, function(err, keys)
		{

			var multi = redis.multi();
			keys.forEach(function(key, index)
			{
				multi.hgetall(key);
			});

			multi.exec(function(err, players)
			{
				cb(players);
			});
		});
	};

	// sends challenge to given player
	this.challenge = function(opponent, cb)
	{
		redis.sadd(this.getDbChallengeSendKey(), opponent.getFbId());
		redis.sadd(opponent.getDbChallengeReceiveKey(), this.getFbId());
		cb(sockets[this.getFbId()].concat(sockets[opponent.getFbId()]));
	};

	// accepts the challenge of the given player
	this.acceptChallenge = function(opponent, cb)
	{

		// remove the accepted invitation
		var self = this;
		redis.srem(this.getDbChallengeReceiveKey(), opponent.getFbId(), function()
		{
			redis.srem(opponent.getDbChallengeSendKey(), self.getFbId(), function()
			{

				// delete all the invites belonging to this player
				// @todo wtf? do these separately every player should mind own list

				cb(sockets[self.getFbId()], sockets[opponent.getFbId()]);
			});
		});
	};

	// declines the challenge of the given player
	this.declineChallenge = function(opponent, cb)
	{

		var self = this;
		redis.srem(this.getDbChallengeReceiveKey(), opponent.getFbId(), function()
		{
			redis.srem(opponent.getDbChallengeSendKey(), self.getFbId(), function()
			{
				cb(sockets[self.getFbId()], sockets[opponent.getFbId()]);
			});
		});
	};

	// withdraws the challenge to the given player
	this.withdrawChallenge = function(opponent, cb)
	{

		var self = this;
		redis.srem(this.getDbChallengeSendKey(), opponent.getFbId(), function()
		{
			redis.srem(opponent.getDbChallengeReceiveKey(), self.getFbId(), function()
			{

				cb(sockets[self.getFbId()], sockets[opponent.getFbId()]);
			});
		});
	};

	// gets the current received challenges of the player
	this.getChallengeList = function(cb)
	{

		var self = this;
		redis.smembers(self.getDbChallengeReceiveKey(), function(err, receiveList)
		{
			redis.smembers(self.getDbChallengeSendKey(), function(err, sendList)
			{

				var receive = [], send = [];

				var multi = redis.multi();
				receiveList.forEach(function(fbId, index)
				{
					multi.hgetall('player:' + fbId);
				});
				sendList.forEach(function(fbId, index)
				{
					multi.hgetall('player:' + fbId);
				});

				multi.exec(function(err, players)
				{

					players.forEach(function(player, index)
					{

						if (-1 !== receiveList.indexOf(player.id)) {
							receive.push(player);
						} else {
							send.push(player);
						}
					});

					cb(receive, send);
				});
			});
		});
	};

	/*
	 * utility
	 */
	this.getDbKey = function()
	{
		return 'player:' + this.fbData.id;
	};

	this.getDbChallengeReceiveKey = function()
	{
		return 'player:' + this.fbData.id + ':ChallengeReceive';
	};

	this.getDbChallengeSendKey = function()
	{
		return 'player:' + this.fbData.id + ':ChallengeSend';
	};

	/*
	 * Getter & Setter
	 */
	this.getFbId = function()
	{
		return this.fbData.id;
	};

	this.getFbData = function()
	{
		return this.fbData;
	};
};