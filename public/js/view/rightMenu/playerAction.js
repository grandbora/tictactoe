define([ 'text!template/rightMenu/playerAction.html' ], function(playerActionTemplate) {

	var PlayerActionView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this);

			this.communicator = this.options.communicator;
			this.onlinePlayers = this.options.onlinePlayers;
			this.onlinePlayers.parent = this;
			this.challenges = this.options.challenges;
			this.challenges.parent = this;
		},

		showMenu : function(opponent) {

			$.contextMenu('destroy');

			if (globalConfig.me.id != opponent.id)
			{
				$.contextMenu({
					selector : '.player',
					trigger : 'left',
					callback : function(key, options) {
						opponent.trigger(key, opponent);
					},
					items : this.getMenuLinks(opponent)
				});
			}
		},

		getMenuLinks : function(opponent) {

			var playerReceiveList = this.challenges.challengeList.playerReceiveList;
			var playerSendList = this.challenges.challengeList.playerSendList;

			var menuLinks = {
				"name" : {
					name : opponent.get('name'),
					disabled : true
				},
				"sep1" : "---------",
				"accept" : {
					name : "accept",
					disabled : true
				},
				"challenge" : {
					name : "invite",
					disabled : false
				}
			};

			if (playerReceiveList.get(opponent.get('id')))
			{
				menuLinks['accept']['disabled'] = false;
				menuLinks['challenge']['disabled'] = true;
			}

			if (playerSendList.get(opponent.get('id')))
			{
				//menuLinks['challenge']['disabled'] = true;
			}

			return menuLinks;
		},

		accept : function(opponent) {
			this.communicator.acceptChallenge(opponent);
		},

		challenge : function(opponent) {

			var playerReceiveList = this.challenges.challengeList.playerReceiveList;
			var playerSendList = this.challenges.challengeList.playerSendList;

			// check if already sent a challenge
			if (playerSendList.get(opponent.get('id'))) return;

			// check if already received a challenge
			if (playerReceiveList.get(opponent.get('id'))) return this.accept(opponent);

			// send the challenge
			this.communicator.sendChallenge(opponent);
		},

		withdraw : function(challenge) {
			this.communicator.withdrawChallenge(challenge.away);
		},

		decline : function(challenge) {
			this.communicator.declineChallenge(challenge.home);
		},

		render : function() {
			this.$el.append($(playerActionTemplate));
			this.$el.find('.separator').before(this.onlinePlayers.render().$el);
			this.$el.find('.separator').after(this.challenges.render().$el);
			return this;
		}
	});

	return PlayerActionView;
});