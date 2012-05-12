define([ 'view/game/main' ], function(GameView)
{

	var Game = function()
	{
		this.run = function()
		{
			var gameView = new GameView({
				communicator : app.communicator,
				model : app.game
			});
			
			app.currentRouteViews.push(gameView);
			
			//set the new room for the chat 
			app.views.chatView.room = app.game.roomName; 

			$('.bottom .left .pageContainer').append(gameView.render().$el);
			gameView.startGame();
		};
	};

	return Game;
});