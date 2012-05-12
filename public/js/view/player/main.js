define([ 'text!template/player/main.html' ], function(playerTemplate) {

	var PlayerView = Backbone.View.extend({

		events : {
			'click' : 'renderActionMenu'
		},

		initialize : function() {
			_.bindAll(this);
		},

		renderActionMenu : function(e) {
			this.model.trigger('menu', this.model);
		},

		render : function() {
			var className = this.model.get('id') === globalConfig.me.id ? 'self' : 'opponent';
			this.$el.addClass('player ' + className);
			var template = _.template(playerTemplate, {
				name : this.model.get('name')
			});
			this.$el.append($(template));
			return this;
		}
	});

	return PlayerView;
});