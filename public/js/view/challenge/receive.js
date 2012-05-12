define([ 'text!template/challenge/receive.html' ], function(challengeReceiveTemplate) {

	var ChallengeReceiveView = Backbone.View.extend({

		events : {
			'click .action.accept' : 'accept',
			'click .action.decline' : 'decline'
		},

		initialize : function(options) {
			_.bindAll(this);
		},

		accept : function() {
			this.model.trigger('accept', this.model.home);
		},

		decline : function() {
			this.model.trigger('decline', this.model);
		},

		render : function() {

			this.$el.addClass('challenge receive');

			var template = _.template(challengeReceiveTemplate, {
				name : this.model.home.get('name')
			});
			this.$el.append($(template));
			return this;
		}
	});

	return ChallengeReceiveView;
});