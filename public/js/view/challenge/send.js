define([ 'text!template/challenge/send.html' ], function(challengeSendTemplate) {

	var ChallengeSendView = Backbone.View.extend({

		events : {
			'click .action.withdraw' : 'withdraw'
		},

		initialize : function(options) {
			_.bindAll(this);
		},

		withdraw : function() {
			this.model.trigger('withdraw', this.model);
		},

		render : function() {

			this.$el.addClass('challenge send');

			var template = _.template(challengeSendTemplate, {
				name : this.model.away.get('name')
			});
			this.$el.append($(template));
			return this;
		}
	});

	return ChallengeSendView;
});