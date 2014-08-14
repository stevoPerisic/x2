var args = arguments[0] || {};

// do not forget:
// here we start to build the exceptions object for missed break/meal period
// exceptions: {
// 	0: {
// 		transId: -> transaction id that comes down from the server with the screens/exceptions JSON
// 		itemType: -> comes from the particular input selected by the employee - button or the text box
// 		itemId: -> comes from the input selected by the employee
// 		itemvalue: -> comes from the input selected by the employee
// 	}
// }

// If this or any of the subsequent screens times out we need to still send the exceptions object up to the server
// the exceptions will be empty, well not everything we still have the transId
// but everything else will be zero

// think about how to render this same screen multiple times
//
// logic:
// if there are more exception screens upon selecting a reason we record the object into exceptions
// than we iterate over the next screen in the returned JSON object and re-create the buttons and/or inputs
// once we go through all of the screens we than send the POST call up to the server using the hoursVerification endpoint
// is the above endpoint maybe -> "updateSchedule" ?

// ofcourse we need to add the restart timeout function here
// in case the screen times out we still need to send the POST request

// Also need to add validation on the input here to make sure that the value is greater than zero and is a certain number

try{
	(function(){

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'missedBreak', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function captureTextFieldVal(e){
			// do validation, make sure this is a valid number
			var value = $.pinPad.pinPadTxtField.value;
			var n = value.match('^[0-9]+$'); // check that the value is numbers only

			if(n){
				$.missedBreakReasons.removeAllChildren();

				// capture the value and add to the exceptions object
				sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemType = $.pinPad.pinPadTxtField.itemType;//-> comes from the particular input selected by the employee - button or the text box
				sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemId = $.pinPad.pinPadTxtField.itemID;//-> comes from the input selected by the employee
				sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemValue = value;//-> comes from the input selected by the employee

				// capture the value and add to the exceptions object
				postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemType = $.pinPad.pinPadTxtField.itemType;//-> comes from the particular input selected by the employee - button or the text box
				postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemId = $.pinPad.pinPadTxtField.itemID;//-> comes from the input selected by the employee
				postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemValue = value;//-> comes from the input selected by the employee

				console.log(sessionObj.currentPunch);

				//go to the next screen in order of exception screens
				$.missedBreak.screenNum = $.missedBreak.screenNum + 1;

				// first let's check if there are any screens left
				console.log($.missedBreak.screenNum);
				console.log(_.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]));

				if(_.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]) === true){

					updateUI(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]);
				}else{
					//hoursVerification_cfg.payload.processExceptions = sessionObj.currentPunch.exceptions.valueOf();
					//make the call to hours verification
					postExceptions_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					$.activityIndicator.show();
					CloudClock.api.request(postExceptions_cfg);
				}
			}else{
				alert('invalid input');
				$.pinPad.pinPadTxtField.value = 0;
			}
		}

		function reasonSelected(e){
			// restartTimeout();

			// remove tha badges
			$.missedBreakReasons.removeAllChildren();

			// capture the reason code and all that jazz
			sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemType = e.source.itemType;//-> comes from the particular input selected by the employee - button or the text box
			sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemId = e.source.itemID;//-> comes from the input selected by the employee
			sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemValue = e.source.itemValue;//-> comes from the input selected by the employee

			// capture the value and add to the exceptions object
			postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemType = e.source.itemType;//-> comes from the particular input selected by the employee - button or the text box
			postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemId = e.source.itemID;//-> comes from the input selected by the employee
			postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemValue = e.source.itemValue;//-> comes from the input selected by the employee

			// check for the itemvalue property
			if(e.source.itemValue === 'M'){
				// change the instructions
				$.missedBreakLbl.text = sessionObj.missedBreakData.exceptionScreens[0].screenInputs[0].itemText;

				// change the layout
				$.missedBreakReasons.layout = 'vertical';

				// insert the textField if the choice was took more than 30 minutes
				_.each(sessionObj.missedBreakData.exceptionScreens[0].screenInputs, function(input){
					var textField = Ti.UI.createTextField({
						top: 10,
						height: '100dp',
						width: '550dp',
						borderWidth: 1,
						borderColor: '#e4e4e4',
						borderRadius: 10,
						textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
						font: {
							fontSize: '40dp'
						},
						color: '#333',
						keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
						// custom props
						itemID: input.itemID,
						itemOrder: input.itemOrder,
						itemType: input.itemType,
						recordID: input.recordID
					});

					textField.addEventListener('change', function(){
						restartTimeout();
					});
					textField.addEventListener('return', captureTextFieldVal);

					$.missedBreakReasons.add(textField);

					textField = null;
				});

				var handle = $.missedBreakReasons.getChildren();
				handle[0].focus();

			}else{
				//go to the next screen in order of exception screens
				$.missedBreak.screenNum = $.missedBreak.screenNum + 1;

				// console.log($.missedBreak.screenNum);
				// console.log(_.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]));

				// first let's check if there are any screens left
				if(_.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]) === true){

					updateUI(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]);
				}else{

					//make the call to hours verification
					//hoursVerification_cfg.payload.processExceptions = sessionObj.currentPunch.exceptions.valueOf();
					postExceptions_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					$.activityIndicator.show();
					CloudClock.api.request(postExceptions_cfg);
				}
			}
		}

		function changeLabelColor(e){
			e.source.removeEventListener(e.type, changeLabelColor);
			e.source.backgroundColor = (e.type === 'touchstart') ? "#34aadc" : "#fff";
			e.source.color = (e.type === 'touchstart') ? "#fff" : "#333";
		}

		function updateUI(_exceptionScreen){
			var numOfButtons = _exceptionScreen.screenButtons.length;

			if(_.isEmpty(_exceptionScreen.screenInputs)){
				// adding view number for the help audio files
				Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1503';

				$.missedBreakReasons.remove($.pinPadWrap);
				$.buttonsWrap.width = '100%';
				$.buttonsWrap.layout = 'horizontal';
			}else{

				// adding view number for the help audio files
				Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1505';

				$.submitBreakHoursTxt.setText('Submit');
				$.pinPad.changeMode({
					mode: 'enterBreakAmount',
					hintText: _exceptionScreen.screenInputs[0].itemText,
					itemID: _exceptionScreen.screenInputs[0].itemID,
					itemType: _exceptionScreen.screenInputs[0].itemType
				});
				$.pinPad.pinPad.top = "10dp";
				$.pinPad.pinPadTxtField.font = {
					fontSize: '30dp'
				};
			}

			$.missedBreakTitle.text = _exceptionScreen.screenTitle;
			$.missedBreakLbl.text = _exceptionScreen.screenTitle2;

			if(numOfButtons > 2){
				$.missedBreakReasons.layout = 'horizontal';
			}

			_.each(_exceptionScreen.screenButtons, function(button){
				var label = Ti.UI.createLabel({
					top: 10,
					left: '5%',
					rigth: '5%',
					height: '100dp',
					//width: '40%',
					width: (_.isEmpty(_exceptionScreen.screenInputs)) ? '40%' : '90%',
					backgroundColor: '#fff',
					borderWidth: 1,
					borderColor: '#e4e4e4',
					borderRadius: 5,
					font: {
						fontSize: '22dp',
						fontWeight: 'bold'
					},
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					color: '#333',
					// custom props 
					itemID: button.itemID,
					itemOrder: button.itemOrder,
					text: button.itemText,
					itemType: button.itemType,
					itemValue: button.itemValue,
					recordID: button.recordID
				});

				label.addEventListener('click', reasonSelected);
				label.addEventListener('touchstart', changeLabelColor);
				label.addEventListener('touchend', changeLabelColor);

				// $.missedBreakReasons.add(label);
				$.buttonsWrap.add(label);

				label = null;
			});
		}

		function destroy(e){
			$.missedBreak.addEventListener('touchstart', restartTimeout);
			$.missedBreak.removeEventListener('close', destroy);
			// perhaps not necessary bcs. there are no data bindings in the controller
			$.destroy();

			// if the session has timed out still send exceptions
			if($.missedBreak.screenTimedOut){
				// have to change the success fn in here bcs we are timed out and we don't want to open the hoursVerification screen here
				postExceptions_cfg.onSuccess = function(response){
					console.log('Screen timed out, exceptions sent, error? : '+response.isError);
				};
				postExceptions_cfg.onError = function(response){
					console.log('Screen timed out, tried sending exceptions, error? : '+response.isError);
				};
				postExceptions_cfg.payload.processExceptions.flowTimedOut = true;
				postExceptions_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				CloudClock.api.request(postExceptions_cfg);
			}
		}

		function changeColor(e){
			e.source.setBackgroundColor('#34aadc');
			e.source.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#62bb47';
		}

		function addEvents(){
			$.missedBreak.addEventListener('close', destroy);
			$.missedBreak.addEventListener('open', function(){
				restartTimeout();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
			$.missedBreak.addEventListener('touchstart', restartTimeout);

			$.submitBreakHours.addEventListener('touchstart', changeColor);
			$.submitBreakHours.addEventListener('touchend', changeColor);
			$.submitBreakHours.addEventListener('click', captureTextFieldVal);
		}

		var sessionObj = CloudClock.sessionObj;
		// clear the nextWindow value
		sessionObj.shift.nextWindow = "";
		
		// exceptions screen
		var postExceptions_cfg = {
			endpoint: 'postExceptions',
			params: {
				'termID': Ti.App.Properties.getString('TERMID'),
				'badge': CloudClock.sessionObj.employee.get('badge'),
				'weekId': 0,
				'shiftId': ((CloudClock.sessionObj.currentPunch.shiftId) ? CloudClock.sessionObj.currentPunch.shiftId : 0),
				'screenId': 0
			},
			payload: {
				punch: {
					idType: CloudClock.sessionObj.currentPunch.idType,	//U|
					employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,//4480358|
					transType: CloudClock.sessionObj.currentPunch.transType,//O|
					departmentNum: CloudClock.sessionObj.currentPunch.departmentNum,//0|
					transTime: CloudClock.sessionObj.currentPunch.transTime,//1398968340|
					transSrc: 0,//0|
					verified: 0,//0|
					transDateTime: CloudClock.sessionObj.currentPunch.transDateTime,//2014-05-01T14:19:00-04:00|
					shiftID: CloudClock.sessionObj.currentPunch.shiftID,
					overrideFlag: CloudClock.sessionObj.currentPunch.overrideFlag,
					initials: CloudClock.sessionObj.currentPunch.initials//|
				},
				processExceptions: [{}]
			},
			onSuccess: function(response){
				// console.log(response);
				//
				// if we get a true response go to the new confirmation screen and get the timecard data
				//	MAKE NOTE!!!!
				// I will use the hours verification files to show this screen, so that there is no more confusion, this should be cleaned up
				// - STEVO
				//
				if(response){
					CloudClock.log('Info', 'Success posting exceptions to postExceptions API endpoint.');
				}else{
					CloudClock.log('Error', 'Error posting exceptions to postExceptions API endpoint.');
				}

				var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');

				if(CONFIRMATION === '0'){
					CloudClock.flashConfirmation = true;
					CloudClock.sessionObj.nextWindow = 'index';
				}else{
					CloudClock.sessionObj.nextWindow = 'employeeFlow_hoursVerification';
				}
				
				$.activityIndicator.hide();

				// dispatch to next window
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			},
			onError: function(response){
				// console.log(response);
				CloudClock.log('Error', 'Error in post exceptions API call: '+JSON.stringify(response));

				var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');
				
				if(CONFIRMATION === '0'){
					CloudClock.flashConfirmation = true;
					CloudClock.sessionObj.nextWindow = 'index';
				}else{
					CloudClock.sessionObj.nextWindow = '';
				}

				$.activityIndicator.hide();

				CloudClock.dispatcher.nextWindow({
					context: $
				});
			}
		};

		// based on the number of screens we will generate the objects for exceptions
		var numOfScreens = sessionObj.missedBreakData.exceptionScreens.length;

		sessionObj.currentPunch.exceptions = {};
		for(var i=0; i<numOfScreens; i++){
			sessionObj.currentPunch.exceptions[i] = {
				transId: sessionObj.missedBreakData.transID,//-> transaction id that comes down from the server with the screens/exceptions JSON
				itemType: 0,//-> comes from the particular input selected by the employee - button or the text box
				itemId: 0,//-> comes from the input selected by the employee
				itemValue: 0,//-> comes from the input selected by the employee
			};

			postExceptions_cfg.payload.processExceptions[i] = {
				transId: sessionObj.missedBreakData.transID,//-> transaction id that comes down from the server with the screens/exceptions JSON
				itemType: 0,//-> comes from the particular input selected by the employee - button or the text box
				itemId: 0,//-> comes from the input selected by the employee
				itemValue: 0,//-> comes from the input selected by the employee
			};
		}

		// update the UI based on the first screen in the JSON response
		updateUI(sessionObj.missedBreakData.exceptionScreens[0]);
		// make sure we remember this is the first screen
		$.missedBreak.screenNum = 0;

		addEvents();
	})();
}
catch(error){
	CloudClock.error(error);
}