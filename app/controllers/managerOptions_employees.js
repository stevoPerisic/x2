//**************************************************
//*******	MANAGER OPTIONS EMPLOYEES CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};
Ti.API.info('Args Data: ' + JSON.stringify(args.data));

(function(){
	try{
		var url = Ti.App.Properties.getString('MANAGEEMPLS');

		if(Ti.Network.online === true){
			var webView = Ti.UI.createWebView({
				url: url,
				ignoreSslError: true,
				height: "100%",
				width: "100%"
			});

			webView.evalJS('document.getElementsByClassName("ListTable").style.fontSize = "10em"');

			$.employeesWebViewWrap.add(webView);
		}else{
			var noNetwork = Ti.UI.createLabel({
				text: CloudClock.customL.strings('noNetworkToSendLogs')
			});
			$.employeesWebViewWrap.add(noNetwork);
		}

		CloudClock.managerOptions.restartTimeout();
	}catch(error){
		CloudClock.error(error);
	}
}());



