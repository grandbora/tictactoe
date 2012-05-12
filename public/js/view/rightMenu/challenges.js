define([ 'view/challenge/send', 'view/challenge/receive', 'text!template/rightMenu/challenges.html' ], function(ChallengeSendView, ChallengeReceiveView, challengesTemplate) {

	var ChallengesView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this);
			this.challengeList = this.options.challengeList;

			this.challengeList.bind('add', this.appendChallenge);
			this.challengeList.bind('remove', this.removeChallenge);
		},

		appendChallenge : function(challenge, challengeList, options) {

			switch (challenge.type)
			{
			case 'send':
				challenge.bind('withdraw', this.parent.withdraw);
				var challengeSendView = new ChallengeSendView({
					model : challenge
				});
				this.$el.append(challengeSendView.render().$el);
				challenge.view = challengeSendView;
				break;
			case 'receive':
				challenge.bind('accept', this.parent.accept);
				challenge.bind('decline', this.parent.decline);
				var challengeReceiveView = new ChallengeReceiveView({
					model : challenge
				});
				this.$el.append(challengeReceiveView.render().$el);
				challenge.view = challengeReceiveView;
				break;
			}

		},

		removeChallenge : function(challenge, challengeList, options) {
			challenge.view.remove();
		},

		render : function() {
			this.$el.append($(challengesTemplate)).addClass('challenges');
			return this;
		}
	});

	return ChallengesView;
});