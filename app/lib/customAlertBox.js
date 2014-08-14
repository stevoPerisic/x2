// Custom Xtra large size dialog box
// set up:
//	$.customAlertTest = CloudClock.createCustomAlert({
//		cancel: 0,													-> Index of the button to be the cancel button
//		buttonNames: ['Cancel', 'Maybe', 'For sure'],				-> Array of button names in string format (@ this time up to 3 btns allowed)
//		title: 'Custom Alert Box',									-> Title to be displayed atop of the dialog in string format
//		message: CloudClock.customL.strings('invalid_managerPin')	-> Message to be displayed to the user in string format
//		callback: {													-> Callback fn for the dialog box
//			eType: 'click',											-> type of event to listen to
//			action: function(_e){									-> the actual fn :)
//				if(_e.source.id === this.cancel){
//					do something if the user pressed cancel...
//				}else{
//					do something else...
//				}
//			}
//		}
//	});
// 
// Show 
// To show the dialog:
//
// $.customAlertTest.show.apply($);
//
// runs the show function, apply -> applies the context of the current window
//
// Hide
// To hide the dialog:
//
// $.customAlertTest.hide.apply($)
//
// runs the hide function, apply -> applies the context of the current window
//

exports.create = function(_params){

	var alertBox = {};
	alertBox.forceClose = function(){
		if(!alertBox || _params.stayOpen)
			return false;
		var children = alertBox.alertBox.getChildren();
		
		// find the cancel btn
		_.each(children, function(child){
			if(!_.isUndefined(child.id) && child.id === alertBox.alertBox.cancel){
				console.log(child);
				child.fireEvent('click');
			}
		});
	};
	alertBox.cleanUp = function(){
		if(typeof alertBox.timeout === 'number'){
			clearTimeout(alertBox.timeout);
			delete alertBox.timeout;
		}
		alertBox.context = null;
		alertBox.overlay = null;
		alertBox.alertBox = null;
		alertBoxText = null;
		alertBox = null;
	};
	alertBox.show = function(){
		try{
			alertBox.context = this;
			var topLevel = (_.isFunction(this.getTopLevelViews)) ? this.getTopLevelViews() : (_.isFunction(alertBox.context.getTopLevelViews)) ? alertBox.context.getTopLevelViews() : false;// this.getTopLevelViews();
			if(topLevel){
				topLevel[0].add(CloudClock.alertBox.overlay);
				topLevel[0].add(CloudClock.alertBox.alertBox);
				alertBox.timeout = setTimeout(alertBox.forceClose, 6000);
			}else{
				return false;
			}
		}catch(error){
			CloudClock.error(error);
		}
	};
	alertBox.hide = function(){
		try{
			// alert(_.isFunction(this.getTopLevelViews));
			if(_.isNull(this)||_.isNull(alertBox.context))
				return false;
			var topLevel = (_.isFunction(this.getTopLevelViews)) ? this.getTopLevelViews() : (_.isFunction(alertBox.context.getTopLevelViews)) ? alertBox.context.getTopLevelViews() : false;
			if(topLevel){
				topLevel[0].remove(CloudClock.alertBox.overlay);
				topLevel[0].remove(CloudClock.alertBox.alertBox);
			}

			// clean up :)
			alertBox.cleanUp();
		}catch(error){
			CloudClock.error(error);
		}
	};
	alertBox.changeColor = function (e){
		e.source.removeEventListener(e.type, alertBox.changeColor);
		e.source.backgroundColor = (e.type === 'touchstart') ? "#34aadc" : "#fff";
		e.source.color = (e.type === 'touchstart') ? "#fff" : "#000";
	};
	var defaultEvt = 'click';
	var defaultAction = alertBox.hide;
	alertBox.context = {};

	alertBox.overlay = Ti.UI.createView({
		id: 'alertBoxOverlay',
		top:0,
		left:0,
		width: '100%',
		height: '100%',
		backgroundColor: '#000',
		opacity: '0.7'
	});

	alertBox.alertBox = Ti.UI.createView({
		id: 'customAlert',
		cancel: _params.cancel,
		width: '60%',
		height: '60%',
		top: '20%',
		left: '20%',
		borderColor:
			// (_params.title === 'ALERT!') ? '#ff2d55' : (_params.title === 'WARNING!') ? '#e2f25c' : '#000',
			(_params.type === 'alert') ? '#ff2d55' : (_params.type === 'warning') ? '#e2f25c' : (_params.type === 'success') ? '#62bb47' : '#000',
		borderRadius: 20,
		zindex: 2,
		backgroundColor: '#fff'
	});

	alertBox.alertBox.addEventListener(_params.callback.eType, _params.callback.action);

	var alertBoxTitle = Ti.UI.createLabel({
		top: 0,
		height: '15%',
		width: '100%',
		borderWidth: 1,
		borderColor:
			//(_params.title === 'ALERT!') ? '#ff2d55' : (_params.title === 'WARNING!') ? '#e2f25c' : '#000',
			(_params.type === 'alert') ? '#ff2d55' : (_params.type === 'warning') ? '#e2f25c' : (_params.type === 'success') ? '#62bb47' : '#000',
		backgroundColor:
			// (_params.title === 'ALERT!') ? '#ff2d55' : (_params.title === 'WARNING!') ? '#e2f25c' : '#f2f2f2',
			(_params.type === 'alert') ? '#ff2d55' : (_params.type === 'warning') ? '#e2f25c' : (_params.type === 'success') ? '#62bb47' : '#000',
		font: {
			fontSize: '30dp',
			fontWeight: 'bold'
		},
		text: _params.title,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color: (_params.title === 'ALERT!') ? '#fff' : '#000',
	});

	var alertBoxText = Ti.UI.createLabel({
		top: '15%',
		left: '5%',
		width: '90%',
		height: '75%',
		font: {
			fontSize: '28dp'
		},
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color: '#000',
		text: _params.message
	});

	alertBox.alertBox.add(alertBoxTitle);
	alertBox.alertBox.add(alertBoxText);

	_.each(_params.buttonNames, function(button, i){
		var btn = Ti.UI.createLabel({
			id: i,
			bottom: 0,
			width: (_params.buttonNames.length === 1) ? '100%' : (_params.buttonNames.length === 2) ? '50%' : '33.4%',
			height: '20%',
			left: (_params.buttonNames.length === 1) ? 0 : (_params.buttonNames.length === 2) ? (i === 0) ? 0 : '50%' : (i === 0) ? 0 : (i === 1) ? '33.35%' : '66.7%',
			// left: (i === 0) ? 0 : '50%',
			text: button,
			font: {
				fontSize: '24dp',
				fontWeight: 'bold'
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: '#000',
			borderColor: '#000'
		});

		btn.addEventListener('touchstart', alertBox.changeColor);
		btn.addEventListener('touchend', alertBox.changeColor);

		alertBox.alertBox.add(btn);

		btn = null;
	});

	CloudClock.alertBox = alertBox;

	return alertBox;
};
