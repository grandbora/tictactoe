define([ 'view/player/game', 'text!template/game/main.html' ], function(PlayerGameView, gameTemplate) {

	var GameView = Backbone.View.extend({

		events : {
			'click .result .restart input:not(:disabled)' : 'restartGame',
			'click .result .button.quit' : 'quitGame'
		},

		initialize : function() {
			_.bindAll(this);
			this.communicator = this.options.communicator;
			this.communicator.enterGame(this.model.id);

			var player1View = new PlayerGameView({
				model : this.model.players[0]
			});
			var player2View = new PlayerGameView({
				model : this.model.players[1]
			});
			this.playerViews = [ player1View, player2View ];

			app.vent.bind('app:move', this.mimicMove);
			app.vent.bind('app:restartGame', this.mimicRestartGame);
		},

		restartGame : function(e) {
			this.$el.find('input:not(.opponent)').prop("disabled", true);
			this.$el.find('input:not(.opponent)').prop("checked", true);
			this.communicator.restartGame();

			this.checkRestartCondition();
		},

		mimicRestartGame : function(e) {
			this.$el.find(".result .restart input.opponent").prop("checked", true);
			this.checkRestartCondition();
		},

		checkRestartCondition : function() {
			if (2 == this.$el.find(".result .restart input:checked").size())
			{
				this.$el.find(".gameboard .player.player" + this.model.currentPlayerIndex).removeClass("ui-state-highlight");
				this.$el.find(".end_game").hide();
				this.$el.find('.result .restart input:not(.opponent)').prop("disabled", false);
				this.$el.find('.result .restart input').prop("checked", false);
				this.model.currentMoveId = 0
				this.model.swapTurn();
				this.startGame();
			}
		},

		quitGame : function(e) {
			var self = this;
			if (this.model.players[this.model.selfIndex].win > this.model.players[(this.model.selfIndex + 1) % 2].win)
			{
				var description = this.model.players[this.model.selfIndex].get('first_name') + ' has beaten ' + this.model.players[(this.model.selfIndex + 1) % 2].get('first_name')
				description += ' ' + this.model.players[this.model.selfIndex].wins + '-' + this.model.players[(this.model.selfIndex + 1) % 2].wins + ' in tic tac toe.';

				FB.ui({
					method : 'feed',
					link : globalConfig.appUrl,
					picture : globalConfig.domainUrl + 'img/' + Math.floor(Math.random() * 4) + 1 + 'jpg',
					name : 'Tic Tac Toe Game',
					caption : this.model.players[this.model.selfIndex].wins + '-' + this.model.players[(this.model.selfIndex + 1) % 2].wins + ' VICTORY! lol :D',
					description : description
				}, function() {
					self.communicator.endGame();
					app.vent.trigger('app:endGame');
				});
			} else
			{
				this.communicator.endGame();
				app.vent.trigger('app:endGame');
			}
		},

		hoverCell : function(e) {
			this.$el.find(e.currentTarget).addClass("hover");
			return false;
		},

		leaveCell : function(e) {
			this.$el.find(e.currentTarget).removeClass("hover");
			return false;
		},

		render : function() {
			this.$el.addClass('gameBoard').append();
			var template = _.template(gameTemplate, {
				selfIndex : this.model.selfIndex
			});

			var templateObject = $(template);
			templateObject.filter('.player.player0').append(this.playerViews[0].render().$el);
			templateObject.filter('.player.player1').append(this.playerViews[1].render().$el);
			this.$el.append(templateObject);
			return this;
		},

		startGame : function() {
			this.$el.find("#game_map").empty();
			for ( var i = 0; i < this.model.numOfCols * this.model.numOfRows; ++i)
			{
				var cell = $("<div>").addClass("cell").appendTo(this.$el.find("#game_map"));
				if (i % this.model.numOfCols === 0)
				{
					cell.before('<div>').addClass('clear');
				}
			}

			this.initTurn();
		},

		initTurn : function() {
			this.$el.find("#player_name").text(this.model.getCurrentPlayer().get('first_name'));
			this.$el.find("#player_mark").text(this.model.getCurrentPlayer().mark);

			if (this.model.isMyTurn())
			{
				this.enableGame();
			} else
			{
				this.disableGame();
			}
		},

		enableGame : function() {
			var events = {
				'mousedown #game_map .cell:not(.marked)' : 'playMove',
				'mouseover #game_map .cell:not(.marked)' : 'hoverCell',
				'mouseout #game_map .cell:not(.marked)' : 'leaveCell'
			};
			this.delegateEvents(_.extend(_.clone(this.events), events));
		},

		disableGame : function() {
			this.delegateEvents(this.events);
		},

		playMove : function(e) {
			var cell = this.$el.find(e.currentTarget);
			var cellIndex = this.$el.find("#game_map .cell").index(cell);

			cell.addClass(this.model.getCurrentPlayer().style).addClass("marked").text(this.model.getCurrentPlayer().mark).trigger("mouseout").unbind("mousedown mouseover mouseout");
			this.communicator.sendMove(cellIndex, this.model.currentMoveId);

			this.prepareNextMove();
			return false;
		},

		mimicMove : function(targetCellIndex) {
			var cell = $(this.$el.find("#game_map .cell").get(targetCellIndex));
			cell.addClass(this.model.getCurrentPlayer().style).addClass("marked").text(this.model.getCurrentPlayer().mark).trigger("mouseout").unbind("mousedown mouseover mouseout");

			this.prepareNextMove();
		},

		prepareNextMove : function() {
			if (false === this.checkAndProcessWin())
			{
				this.model.swapTurn();
				this.model.currentMoveId++;
				this.initTurn();
			}
		},

		checkAndProcessWin : function() {
			// Make it quick, don't check if we can't win
			var current_class = this.model.getCurrentPlayer().style;
			var marked_cells = this.$el.find("#game_map ." + current_class);
			var win = false;
			if (marked_cells.length >= this.model.numOfRows)
			{
				/* Check the rows */
				var cells = this.$el.find("#game_map .cell");
				var cells_inspected = {};
				for ( var row = 1; row <= this.model.numOfRows && !win; ++row)
				{
					cells_inspected = cells.filter(":lt(" + this.model.numOfCols * row + ")").filter(":eq(" + (this.model.numOfCols * (row - 1)) + "),:gt(" + (this.model.numOfCols * (row - 1)) + ")").filter("." + current_class);
					if (cells_inspected.length == this.model.numOfCols) win = true;
				}
				/* Check the cols */
				for ( var col = 0; col <= this.model.numOfCols && !win; ++col)
				{
					cells_inspected = cells.filter(":sub_mod(" + col + "," + this.model.numOfRows + ")").filter("." + current_class);

					if (cells_inspected.length == this.model.numOfRows) win = true;
				}
				/* Check the diagonals */
				if (!win)
				{
					cells_inspected = cells.filter(":mod(" + (this.model.numOfRows + 1) + ")").filter("." + current_class);
					if (cells_inspected.length == this.model.numOfRows)
						win = true;
					else
					{
						// From right down to left up
						cells_inspected = cells.filter(":mod(" + (this.model.numOfRows - 1) + "):not(:last,:first)").filter("." + current_class);
						if (cells_inspected.length == this.model.numOfRows) win = true;
					}
				}
			}

			var stopGame = false;
			if (win)
			{
				stopGame = true;
				this.disableGame();

				cells_inspected.addClass("win");
				this.model.getCurrentPlayer().win++;

				this.$el.find("#winner #winner_name").text(this.model.getCurrentPlayer().get('first_name'));
				this.$el.find('#' + this.model.getCurrentPlayer().scoreEl).text(this.model.getCurrentPlayer().win);
				this.$el.find(".gameboard .player.player" + (this.model.currentPlayerIndex)).addClass("ui-state-highlight");
				this.$el.find('.end_game').show();
				this.setQuitButton();
			} else
			{
				// Save the trouble and just restart the game since it a dead end
				if ($("#game_map .marked").length == this.model.numOfRows * this.model.numOfCols)
				{
					stopGame = true;
					disableGame();

					$(".result .restart").show();
					$(".result .button.quit").show();
					this.setQuitButton();
				}
			}
			return stopGame;
		},

		setQuitButton : function() {
			if (this.model.players[this.model.selfIndex].win > this.model.players[(this.model.selfIndex + 1) % 2].win)
			{
				this.$el.find("#quit_game").text('Claim Victory and Leave');
			} else
			{
				this.$el.find("#quit_game").text('Leave');
			}
		}

	});

	return GameView;
});