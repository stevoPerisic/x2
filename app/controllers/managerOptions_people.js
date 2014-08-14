//**************************************************
//*******	MANAGER OPTIONS PEOPLE CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};
Ti.API.info('Args Data: ' + JSON.stringify(args.data));

(function(){
	try{
		var url = Ti.App.Properties.getString('MANAGEUSERS');
		var webView = Ti.UI.createWebView({
			url: url,
			ignoreSslError: true,
			height: "100%",
			width: "100%"
		});

		CloudClock.managerOptions.restartTimeout();

		$.peopleWebViewWrap.add(webView);

	}catch(error){
		CloudClock.error(error);
	}
}());

