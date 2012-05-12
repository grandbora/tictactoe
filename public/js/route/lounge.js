define([], function()
{

	var Lounge = function()
	{
		this.run = function()
		{

			// reset the room for the chat
			app.views.chatView.room = 'lounge';

		};
	};

	return Lounge;
});