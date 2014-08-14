//**************************************************
//*******	TIMECARD DETAIL CONTROLLER	****************
//*************************************************
try{
	(function(){
		'use strict';

		var timecard = require('timecard');

		//Private FUNCTIONS
		function emptyFn(e){
			$[e.source.id].removeEventListener('doubletap', emptyFn);
			return false;
		}
		
		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'timecardDetail', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function destroy(){

			timecard.gc();
			
			$.timecardDetail.removeEventListener('touchstart', restartTimeout);
			$.timecardDetail.removeEventListener('close', destroy);

			$.previousWeek.removeEventListener('click', timecard.navigateWeeks);
			$.previousWeek.removeEventListener('doubletap', emptyFn);
			$.previousWeek.removeEventListener('touchstart', timecard.prevNextChangeBackground);
			$.previousWeek.removeEventListener('touchend', timecard.prevNextChangeBackground);

			$.nextWeek.removeEventListener('click', timecard.navigateWeeks);
			$.nextWeek.removeEventListener('doubletap', emptyFn);
			$.nextWeek.removeEventListener('touchstart', timecard.prevNextChangeBackground);
			$.nextWeek.removeEventListener('touchend', timecard.prevNextChangeBackground);

			$.text.removeEventListener('click', timecard.textMe);
			$.text.removeEventListener('click', timecard.setUpEmplComm);

			$.email.removeEventListener('click', timecard.emailMe);
			$.email.removeEventListener('click', timecard.setUpEmplComm);

			$.print.removeEventListener('click', timecard.printMe);

			//commButtonsChangeColor
			$.text.removeEventListener('touchstart', timecard.commButtonsChangeColor);
			$.email.removeEventListener('touchstart', timecard.commButtonsChangeColor);
			$.print.removeEventListener('touchstart', timecard.commButtonsChangeColor);
			$.text.removeEventListener('touchend', timecard.commButtonsChangeColor);
			$.email.removeEventListener('touchend', timecard.commButtonsChangeColor);
			$.print.removeEventListener('touchend', timecard.commButtonsChangeColor);

			if(!_.isEmpty($.sessionObj.employee)){
				$.sessionObj.clearSession();
			}

			$.destroy();

			$.timecardDetail.removeAllChildren();

			timecard = null;
			
			$.sessionObj = null;
			
			$ = null;

			console.log('\n\n\nEmployee flow timecard detail destroyed: '+ JSON.stringify($));
		}

		function addEvents(){
			//	EVENT LISTENERS
			$.timecardDetail.addEventListener('close', destroy);
			$.timecardDetail.addEventListener('touchstart', restartTimeout);
			$.timecardDetail.addEventListener('open', Alloy.Collections.deviceHelp.audioPlayer.play);

			$.previousWeek.addEventListener('click', timecard.navigateWeeks);
			$.previousWeek.addEventListener('doubletap', emptyFn);
			$.previousWeek.addEventListener('touchstart', timecard.prevNextChangeBackground);
			$.previousWeek.addEventListener('touchend', timecard.prevNextChangeBackground);

			$.nextWeek.addEventListener('click', timecard.navigateWeeks);
			$.nextWeek.addEventListener('doubletap', emptyFn);
			$.nextWeek.addEventListener('touchstart', timecard.prevNextChangeBackground);
			$.nextWeek.addEventListener('touchend', timecard.prevNextChangeBackground);

			$.text.addEventListener('click',
				// if employee has cell phone set up?
				($.sessionObj.employee.get('cellPhone')) ?
				timecard.textMe :
				timecard.setUpEmplComm
			);

			$.email.addEventListener('click',
				// if employee has email set up?
				($.sessionObj.employee.get('email')) ?
				timecard.emailMe :
				timecard.setUpEmplComm
			);

			$.print.addEventListener('click', timecard.printMe);

			//commButtonsChangeColor
			$.text.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.email.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.print.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.text.addEventListener('touchend', timecard.commButtonsChangeColor);
			$.email.addEventListener('touchend', timecard.commButtonsChangeColor);
			$.print.addEventListener('touchend', timecard.commButtonsChangeColor);
		}

		function getAppParameters(){  // TODO: expand to other paramters and convert to exports to consolidate
			var isEmail = Ti.App.Properties.getString('ALLOWEMAIL');
			var isText  = Ti.App.Properties.getString('ALLOWTEXT');
			var isPrint = Ti.App.Properties.getString('ALLOWPRINT');
			var isView  = Ti.App.Properties.getString('ALLOWVIEW');
			var parmObj = {
				"isEmailAllowed" : ((isEmail && isEmail !=='0') ? true : false),
				"isTextAllowed"  : ((isText && isText !=='0') ? true : false),
				"isPrintAllowed" : ((isPrint && isPrint !=='0') ? true : false),
				"isViewAllowed"  : ((isView && isView !=='0') ? true : false),
			};
			console.log('getAppParameters() returning: ' + JSON.stringify(parmObj));
			return parmObj;
		}

		function updateUI(){
			if(OS_IOS){
				$.previousWeekLbl.setText(CloudClock.customL.strings('previous'));
				$.nextWeekLbl.setText(CloudClock.customL.strings('next'));
			}
			else{
				$.previousWeek.setTitle(CloudClock.customL.strings('previous'));
				$.nextWeek.setTitle(CloudClock.customL.strings('next'));
			}

			$.printLbl.setText(CloudClock.customL.strings('print'));
			$.smsLbl.setText(CloudClock.customL.strings('sms'));
			$.emailLbl.setText(CloudClock.customL.strings('email'));

			// $.header.helpButton.setVisible(false); // hide the help button - no help content for this screen

			// if network available hide the done button until the timecard loads
			if(Ti.Network.online === true){
				$.header.exit.hide();
			}
	
			var parm = getAppParameters();
			$.email.setVisible(parm.isEmailAllowed);
			$.text.setVisible(parm.isTextAllowed);
			$.print.setVisible(parm.isPrintAllowed);

			if(OS_IOS){

				$.header.exitLbl.setText(CloudClock.customL.strings('done'));

				$.previousWeek.applyProperties({ week: 1 });
				$.nextWeek.applyProperties({ week: 0 });
			}else{

				$.header.exit.setTitle(CloudClock.customL.strings('done'));

				$.previousWeek.week = 1;
				$.nextWeek.week = 0;
			}
		}

		//get the handle of the session
		$.sessionObj = CloudClock.sessionObj;
		$.week = 0;
		$.restartTimeout = restartTimeout;
		timecard.init($);

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1602';

		updateUI();

		addEvents();

		// show the punch card -> could try doing this call before we open the window?
		timecard.submitPunchAndView();

		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;

		$.timecardDetail.open();

		restartTimeout();

		$.activityIndicator.show();

	})();
}
catch(error){
	CloudClock.error(error);
}



