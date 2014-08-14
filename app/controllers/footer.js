//**************************************************
//*******	FOOTER CONTROLLER	****************
//**************************************************
(function(){
	try{
		exports.hide = function(){
			$.footer.hide();
		};

		function changeColor(e){
			if(e.type === 'touchstart'){
				e.source.setBackgroundColor('#34aadc');
				if(OS_IOS){ children[1].setColor('#fff'); }
			}else{
				e.source.setBackgroundColor('#333');
				if(OS_IOS){ children[1].setColor('#dadada'); }
			}
		}

		//-----------------------------------------
		// MOVED THIS OUT TO THE CLOCK IN/OUT PAGE BCS. OF THE DIALOG CONTEXT
		// ----------------------------------------
		// function employeeOptions_click(e){
		// 	if(Ti.Network.online !== false){
		// 		$.employeeOptions.removeEventListener('click', employeeOptions_click);
		// 		$.employeeOptions.enabled = false;
		// 		$.employeeOptions.hide();

		// 		CloudClock.clock.showEmployeeFlowDialog = false;
		// 		Alloy.createController('employeeOptions');

		// 		$.parent.close();
		// 	}else{
		// 		CloudClock.noNetwork = CloudClock.customAlert.create({
		// 			type: 'alert',
		// 			cancel: 0,
		// 			buttonNames: [CloudClock.customL.strings('ok')],
		// 			title: CloudClock.customL.strings('alert'),
		// 			message: CloudClock.customL.strings('noNetwork'),
		// 			callback:{
		// 				eType: 'click',
		// 				action: function(_e){
		// 					CloudClock.noNetwork.hide.apply($);
		// 				}
		// 			}
		// 		});

		// 		CloudClock.noNetwork.show.apply($);
		// 	}
		// }

		function setLanguage(){
			if(OS_IOS){
				$.more_options.setText(CloudClock.customL.strings('more_options'));
			}else{
				$.employeeOptions.setTitle(CloudClock.customL.strings('more_options'));
			}
		}

		function addEventListeners(){
			// $.employeeOptions.addEventListener('click', employeeOptions_click);
			$.employeeOptions.addEventListener('touchstart', changeColor);
			$.employeeOptions.addEventListener('touchend', changeColor);
		}

		addEventListeners();

		//console.log('footer being read....');
		if(OS_IOS){
			var children = $.employeeOptions.getChildren();
		}
		//set language
		setLanguage();
		//end

	}catch(error){
		CloudClock.error(error);
	}
}());









