define([ 'model/message', 'model/game', 'model/player' ], function(Message, Game, Player)
{

	var Communicator = function(config)
	{

		var self = this;
		this.config = config;

		this.initialize = function()
		{

			this.socket = io.connect(this.config.domainUrl);
			this.socket.on('connect', function()
			{

				/*
				 * rightmenu callbacks
				 */
				self.socket.on('onlinePlayers', function(onlinePlayers)
				{
					self.config.playerList.reset(onlinePlayers);
				});

				self.socket.on('challenge', function(homeData, awayData)
				{

					if (globalConfig.me.id == homeData.id) {
						var opponent = self.config.playerList.get(awayData.id);
						self.config.challengeList.playerSendList.add(opponent);
					} else {
						var opponent = self.config.playerList.get(homeData.id);
						self.config.challengeList.playerReceiveList.add(opponent);
					}
				});

				self.socket.on('accept', function(type, game)
				{
					var home = new Player(game.home.fbData);
					var guest = new Player(game.guest.fbData);

					switch (type)
					{ // remove accepted challenge
						case 'send' :
							self.config.challengeList.playerSendList.remove(guest);
							break;
						case 'receive' :
							self.config.challengeList.playerReceiveList.remove(home);
							break;
					}

					_.each(self.config.challengeList.playerSendList.models, function(opponent)
					{ // remove all other sent challenges
						self.withdrawChallenge(opponent);
					});

					app.game = new Game({
					    id : game.id,
					    players : [ home, guest ]
					});
					app.vent.trigger("app:startGame", game);
				});

				self.socket.on('decline', function(type, opponent)
				{

					var opponent = self.config.playerList.get(opponent.id);
					switch (type)
					{
						case 'send' :
							self.config.challengeList.playerSendList.remove(opponent);
							break;
						case 'receive' :
							self.config.challengeList.playerReceiveList.remove(opponent);
							break;
					}
				});

				self.socket.on('withdraw', function(type, opponent)
				{

					var opponent = self.config.playerList.get(opponent.id);
					if ('send' == type) {
						self.config.challengeList.playerSendList.remove(opponent);
					} else if ('receive' == type) {
						self.config.challengeList.playerReceiveList.remove(opponent);
					}
				});

				self.socket.emit('register', globalConfig.me);
			});

			/*
			 * game callbacks
			 */
			self.socket.on('move', function(moveData)
			{
				app.vent.trigger("app:move", moveData);

			});

			self.socket.on('restart', function()
			{
				app.vent.trigger("app:restartGame");
			});

			/*
			 * chat callbacks
			 */
			this.socket.on('chat', function(player, type, text)
			{

				var player = self.config.playerList.get(player.id);
				var partial = _.find(self.config.messageList.models, function(message)
				{
					return 'partial' == message.get('type') && player == message.get('from');
				});

				if (partial) {
					partial.set({
					    text : text,
					    type : type
					});
				} else {
					var message = new Message({
					    from : player,
					    type : type,
					    text : text
					});
					self.config.messageList.add(message);
				}
			});

		};

		/*
		 * rightmenu player actions
		 */
		this.acceptChallenge = function(opponent)
		{
			this.socket.emit('accept', opponent.getFbData());
		};

		this.sendChallenge = function(opponent)
		{
			this.socket.emit('challenge', opponent.getFbData());
		};

		this.withdrawChallenge = function(opponent)
		{
			this.socket.emit('withdraw', opponent.getFbData());
		};

		this.declineChallenge = function(opponent)
		{
			this.socket.emit('decline', opponent.getFbData());
		};

		/*
		 * game actions
		 */
		this.enterGame = function(gameId)
		{
			this.socket.emit('enterGame', gameId);
		};

		this.sendMove = function(cellIndex, moveId)
		{
			this.socket.emit('move', cellIndex, moveId);
		};

		this.restartGame = function()
		{
			this.socket.emit('restart');
		};
		
		this.endGame = function()
		{
			this.socket.emit('end');
		};

		/*
		 * chat actions
		 */
		this.publishMessageFinal = function(room, message)
		{
			this.socket.emit('chat', room, 'final', message);
		};
		this.publishMessagePartial = function(room, message)
		{
			this.socket.emit('chat', room, 'partial', message);
		};

	};

	return Communicator;
});