define([ 'route/layout', 'route/lounge', 'route/game' ], function(Layout, LoungeRoute, GameRoute)
{

	var Router = function(options)
	{

		var self = this;
		var internalRouter;

		this.internalRouter = Backbone.Router.extend({
		    routes : {
		        'game/:id' : 'gameAction',
		        '' : 'loungeAction'
		    },
		    gameAction : function()
		    {
			    self.clearCurrentRouteContent();
			    new GameRoute().run();
		    },
		    loungeAction : function()
		    {
			    self.clearCurrentRouteContent();
			    new LoungeRoute().run();
		    }
		});

		this.clearCurrentRouteContent = function()
		{
			_.each(app.currentRouteViews, function(view)
			{
				view.remove();
				view.unbind();
				if (view.onClose) {
					view.onClose();
				}
			});
		};

		this.startRouting = function()
		{
			new Layout().run();
			internalRouter = new this.internalRouter();
			Backbone.history.start();
		};

		this.navigateToGame = function(game)
		{
			internalRouter.navigate("#/game/" + game.id, {
				trigger : true
			});
		};

		this.navigateToLounge = function()
		{
			internalRouter.navigate("#/", {
				trigger : true
			});
		};

	};

	return Router;
});