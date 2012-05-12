define([], function() {

	var Challenge = Backbone.Model.extend({

		initialize : function() {
			this.type = this.attributes.type;
			this.home = this.attributes.home;
			this.away = this.attributes.away;
		}

	});

	return Challenge;

});