define([ 'view/player/main', 'text!template/rightMenu/onlinePlayers.html' ], function(PlayerView, onlinePlayersTemplate) {

	var OnlinePlayersView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this);

			this.playerList = this.options.playerList;
			this.playerList.bind('reset', this.reset);
		},

		reset : function() {

			var self = this;
			this.$el.find('.player').remove();
			this.playerList.each(function(player) {

				player.bind('menu', self.parent.showMenu);
				player.bind('accept', self.parent.accept);
				player.bind('challenge', self.parent.challenge);

				var playerView = new PlayerView({
					model : player
				});
				self.$el.append(playerView.render().$el);
			});
		},

		render : function() {
			this.$el.append($(onlinePlayersTemplate)).addClass('onlinePlayers');
			return this;
		}
	});

	return OnlinePlayersView;
});