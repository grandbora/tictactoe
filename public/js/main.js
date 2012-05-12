require.config({
	paths : {
		socket : '/socket.io/socket.io.js',
		jquery : 'lib/jquery/jquery-1.7.1.min',
		jqueryContextMenu : 'lib/jquery/jquery.contextMenu',
		jqueryExpression : 'lib/jquery/jquery.expression',
		underscore : 'lib/backbone/underscore-1.3.3.min',
		backbone : 'lib/backbone/backbone-0.9.2.min',
		text : 'lib/require/text',
		order : 'lib/require/order',
		template : '../template'
	}
});

require([ 
	'socket',
	'order!jquery',
	'order!jqueryContextMenu',
	'order!jqueryExpression',
	'order!underscore', 
	'order!backbone',
	'order!app',
	'order!fb' ], 
	function(io, $, jqueryContextMenu, jqueryExpression, _, Backbone, App) {
	
		app = new App().bootstrap(); // global app object
		$(function() {
			app.router.startRouting();
		});

});