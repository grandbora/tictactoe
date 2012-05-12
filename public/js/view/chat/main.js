define([ 'view/message/main', 'text!template/chat/main.html' ], function(MessageView, chatTemplate) {

	var ChatView = Backbone.View.extend({

		events : {
			'keypress .private input' : 'submit'
		},

		initialize : function() {
			_.bindAll(this);
			this.communicator = this.options.communicator;
			this.room = this.options.room;
			this.oldText = "";

			this.collection.bind('add', this.appendMessage);
		},

		submit : function(e) {

			var chatTypeBox = this.$el.find('.private input');
			if (e.keyCode == 13)
			{ // enter pressed
				var msg = chatTypeBox.val();
				if ("" != msg)
				{
					this.communicator.publishMessageFinal(this.room, chatTypeBox.val());
					chatTypeBox.val("");
				}
				return false;
			}
		},

		appendMessage : function(message, messageList, options) {

			var messageView = new MessageView({
				model : message
			});

			this.$el.find('.public').append(messageView.render().$el);
			this.scrollBottom();
		},

		scrollBottom : function() {
			// @todo what if user is manually scrolling?
			var chatPublic = this.$el.find('.public');
			chatPublic.prop({
				scrollTop : chatPublic.prop("scrollHeight")
			});
		},

		startListening : function() {

			var self = this;
			var chatTypeBox = this.$el.find('.private input');
			var chatTypeBoxInterval = setInterval(function() {
				if (chatTypeBox.val() != self.oldText)
				{
					self.communicator.publishMessagePartial(self.room, chatTypeBox.val());
					self.oldText = chatTypeBox.val();
				}
			}, 100);
		},

		render : function() {
			this.$el.addClass('chat').append($(chatTemplate));
			this.startListening();
			return this;
		}

	});

	return ChatView;
});