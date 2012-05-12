define([ 'text!template/message/main.html' ], function(messageTemplate) {

	var MessageView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this);
			this.model.bind('change:text', this.update);
			this.model.bind('change:type', this.submit);
		},

		update : function() {
			var newText = this.model.get('text');
			this.$el.find('.text').text(newText);
			this.hideIfEmpty(newText);
			this.moveToBottom();
		},

		submit : function() {
			var newText = this.model.get('text');
			this.$el.removeClass('partial').addClass('final').find('.text').text(newText);
			this.moveToBottom();
		},

		render : function() {
			this.$el.addClass(this.model.get('type'));
			var template = _.template(messageTemplate, {
				name : this.model.get('from').get('first_name'),
				text : this.model.get('text')
			});
			this.$el.append($(template));
			this.hideIfEmpty(this.model.get('text'));
			return this;
		},

		hideIfEmpty : function(newText) {
			if ("" == newText)
			{
				this.$el.hide();
			} else
			{
				this.$el.show();
			}
		},
		moveToBottom : function() {
			this.$el.parent().append(this.$el);
		},
	});

	return MessageView;
});