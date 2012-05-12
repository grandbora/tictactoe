define([ 'model/challenge' ], function(Challenge) {

	var ChallengeList = Backbone.Collection.extend({
		model : Challenge,

		initialize : function(models, options) {

			_.bindAll(this);
			this.playerReceiveList = options.playerReceiveList;
			this.playerSendList = options.playerSendList;

			this.playerSendList.bind('add', this.addChallengeSend);
			this.playerReceiveList.bind('add', this.addChallengeReceive);

			this.playerSendList.bind('remove', this.removeChallengeSend);
			this.playerReceiveList.bind('remove', this.removeChallengeReceive);
		},

		addChallengeSend : function(opponent, playerSendList, options) {
			var challenge = new Challenge({
				type : 'send',
				home : null, //bdnf
				away : opponent,
			});
			this.add(challenge);
		},

		addChallengeReceive : function(opponent, playerReceiveList, options) {
			var challenge = new Challenge({
				type : 'receive',
				home : opponent,
				away : null, //bdnf
			});
			this.add(challenge);
		},

		removeChallengeSend : function(opponent, playerSendList, options) {
			var challenge = _.find(this.models, function(challenge) {
				return challenge.away === opponent;
			});
			this.remove(challenge);
		},

		removeChallengeReceive : function(opponent, playerReceiveList, options) {
			var challenge = _.find(this.models, function(challenge) {
				return challenge.home === opponent;
			});
			this.remove(challenge);
		}

	});

	return ChallengeList;
});