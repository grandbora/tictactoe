define([], function() {

	var Player = Backbone.Model.extend({

		initialize : function() {
			_.bindAll(this);
		},

		getFbData : function() {

			if (!this.fbData)
			{
				this.fbData = {
					id : this.get('id'),
					name : this.get('name'),
					first_name : this.get('first_name'),
					last_name : this.get('last_name'),
					link : this.get('link'),
					gender : this.get('gender'),
					timezone : this.get('timezone'),
					locale : this.get('locale'),
					verified : this.get('verified'),
					updated_time : this.get('updated_time')
				};
			}
			return this.fbData;
		},
	});

	return Player;

});