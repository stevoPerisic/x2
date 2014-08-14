//**************************************************
//*******	MANAGER OPTIONS REPORTS CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};
Ti.API.info('Args Data: ' + JSON.stringify(args.data));

(function(){
	try{
		var url = Ti.App.Properties.getString('MANAGEREPORTS');
		var webView = Ti.UI.createWebView({
			url: url,
			ignoreSslError: true,
			height: "100%",
			width: "100%"
		});

		$.reportsWebViewWrap.add(webView);

		CloudClock.managerOptions.restartTimeout();
	}catch(error){
		CloudClock.error(error);
	}
}());


