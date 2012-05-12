var playerModel = require('./models/player');
var gameModel = require('./models/game');

module.exports = function(io) {

	io.sockets.on('connection', function(socket) {
		socket.on('register', function(me) {
			
			socket.join('lounge');
			socket.set('me', me, function() {

				// initialize player
				var player = new playerModel();
				player.init(me);
				player.register(socket.id, function() {
					player.getOnlinePlayers(function(onlinePlayers) {
						// not broadcast, send to everyone
						io.sockets.emit('onlinePlayers', onlinePlayers);
					});
				});

				socket.on('disconnect', function() {
					player.unregister(socket.id, function() {
						// called only when player's all sockets are disconnected
						player.getOnlinePlayers(function(onlinePlayers) {
							socket.broadcast.emit('onlinePlayers', onlinePlayers);
						});
					});
				});

				socket.on('challenge', function(opponentData) {
					var opponent = new playerModel();
					opponent.init(opponentData);

					player.challenge(opponent, function(socketList) {
						socketList.forEach(function(socketId, index) {
							io.sockets.socket(socketId).emit('challenge', player.fbData, opponent.fbData);
						});
					});
				});

				socket.on('accept', function(opponentData) {

					var opponent = new playerModel();
					opponent.init(opponentData);

					player.acceptChallenge(opponent, function(selfSocketList, opponentSocketList) {

						var game = new gameModel();
						game.init(opponent, player, function() {

							selfSocketList.forEach(function(socketId, index) {
								io.sockets.socket(socketId).emit('accept', 'receive', game);
							});
							
							opponentSocketList.forEach(function(socketId, index) {
								io.sockets.socket(socketId).emit('accept', 'send', game);
							});
						});
					});
				});

				socket.on('decline', function(opponentData) {

					var opponent = new playerModel();
					opponent.init(opponentData);

					player.declineChallenge(opponent, function(socketListSelf, socketListOpponent) {

						socketListSelf.forEach(function(socketId, index) {
							io.sockets.socket(socketId).emit('decline', 'receive', opponent.getFbData());
						});
						
						socketListOpponent.forEach(function(socketId, index) {
							io.sockets.socket(socketId).emit('decline', 'send', player.getFbData());
						});
					});
				});

				socket.on('withdraw', function(opponentData) {

					var opponent = new playerModel();
					opponent.init(opponentData);

					player.withdrawChallenge(opponent, function(socketListSelf, socketListOpponent) {

						socketListSelf.forEach(function(socketId, index) {
							io.sockets.socket(socketId).emit('withdraw', 'send', opponent.getFbData());
						});

						socketListOpponent.forEach(function(socketId, index) {
							io.sockets.socket(socketId).emit('withdraw', 'receive', player.getFbData());
						});
					});
				});

				/** *** chat calls ********* */
				socket.on('chat', function(room, type, msg) {
						io.sockets.in(room).emit('chat', player.getFbData(), type, msg); // send to everyone in the ROOM
				});

			});
		});

		// game view calls
		var game;

		socket.on('enterGame', function(gameId) {

			game = new gameModel();
			game.load(gameId, function() {
				socket.leave('lounge');
				socket.join(game.getRoomName());
				socket.emit('enterGame');
			});
		});

		socket.on('move', function(moveData, moveId) {

			if (0 == moveId)
			{
				game.clearMoveList(function() {
					game.registerMove(moveData);
				});
			} else
			{
				game.registerMove(moveData);
			}

			socket.broadcast.to(game.getRoomName()).emit('move', moveData);
		});

		socket.on('restart', function() {
			socket.broadcast.to(game.getRoomName()).emit('restart');
		});
		
		socket.on('end', function() {
			socket.broadcast.to(game.getRoomName()).emit('end');
			socket.leave(game.getRoomName());
			socket.join('lounge');
		});
	});
};