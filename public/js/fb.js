window.fbAsyncInit = function() {
	FB.init({
		appId : globalConfig.appId,
		channelUrl : globalConfig.domainUrl + 'channel',
		frictionlessRequests : true,
		status : true,
		cookie : true,
		xfbml : true
	});

	$(".top .fbInviteFriends").on("click", function(event) {
		FB.ui({
			method : 'apprequests',
			message : 'Lets play tic tac toe.'
		});
	});
};

// Load the SDK Asynchronously
(function(d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id))
	{
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));