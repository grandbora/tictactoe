define([ 'view/chat/main', 'view/rightMenu/playerAction', 'view/rightMenu/onlinePlayers', 'view/rightMenu/challenges' ], function(ChatView, PlayerActionView, OnlinePlayersView, ChallengesView)
{

	var Layout = function()
	{

		this.run = function()
		{
			var onlinePlayersView = new OnlinePlayersView({
				playerList : app.collections.playerList
			});

			var challengesView = new ChallengesView({
				challengeList : app.collections.challengeList
			});

			var playerActionView = new PlayerActionView({
			    communicator : app.communicator,
			    onlinePlayers : onlinePlayersView,
			    challenges : challengesView
			});

			var chatView = new ChatView({
			    communicator : app.communicator,
			    collection : app.collections.messageList
			});

			app.views.playerActionView = playerActionView;
			app.views.chatView = chatView;

			$('.bottom .right').append(playerActionView.render().$el);
			$('.bottom .left .chatContainer').append(chatView.render().$el);

			app.communicator.initialize();
		};
	};

	return Layout;
});