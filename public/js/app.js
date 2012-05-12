define([ 'communicator', 'router', 'model/playerList', 'model/challengeList', 'model/messageList' ], function(Communicator, Router, PlayerList, ChallengeList, MessageList)
{

	var App = function()
	{

		this.collections = {};
		this.views = {};
		this.currentRouteViews = [];
		this.vent = _.extend({}, Backbone.Events);

		this.bootstrap = function()
		{
			var playerList = new PlayerList();
			var playerReceiveList = new PlayerList();
			var playerSendList = new PlayerList();

			var challengeList = new ChallengeList(null, {
			    playerReceiveList : playerReceiveList,
			    playerSendList : playerSendList
			});

			var messageList = new MessageList();

			this.collections.playerList = playerList;
			this.collections.challengeList = challengeList;
			this.collections.messageList = messageList;

			this.communicator = new Communicator({
			    domainUrl : globalConfig.domainUrl,
			    playerList : playerList,
			    challengeList : challengeList,
			    messageList : messageList
			});

			this.router = new Router();
			this.vent.bind("app:startGame", this.router.navigateToGame);
			this.vent.bind("app:endGame", this.router.navigateToLounge);
			return this;
		};
	};

	return App;
});