define(['model/player'], function(Player) {

	var PlayerList = Backbone.Collection.extend({
		model : Player
	});

	return PlayerList;

});