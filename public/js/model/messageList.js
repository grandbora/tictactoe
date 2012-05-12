define([ 'model/message' ], function(Message) {
	var MessageList = Backbone.Collection.extend({
		model : Message,
	});
	return MessageList;
});