define([ 'text!template/player/game.html' ], function(playerTemplate) {

	var PlayerView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this);
		},

		render : function() {
			var template = _.template(playerTemplate, {
				id : this.model.get('id'),
				name : this.model.get('name')
			});
			this.$el.addClass('playerContainer').append($(template));
			return this;
		}
	});

	return PlayerView;
});