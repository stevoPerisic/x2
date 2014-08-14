//**********************************************************
//*******	ACTUAL VS. SCHEDULED SELECTION CONTROLLER	****************
//*****************************************************************
// here we need to show actual time on one side and the avialable shifts on the other side
//
// on the IN Punch look for SHIFT IN WINDOW
// if within the window but early (actDiff < 0) offer actual button to override time and scheduled shift(s)
// if outside SHIFT IN WINDOW but within the GRACE window AND EARLY DO NOT offer actual button and ONLY SHOW SHIFTS IF MORE THAN ONE
//			if only one shift just go to exceptions
// if within the window but late (actDiff > 0) skip the screen and go straight to exception screen
// if outside the SHIFT IN WINDOW but within the GRACE window AND VERY LATE DO NOT offer actual button and ONLY SHOW SHIFTS IF MORE THAN ONE
//			if only one shift skip this screen and go to exceptions
//
// on the OUT Punch look for SHIFT OUT WINDOW
// if within the window but lateOUT (actDiff > 0) offer actual button to override time and scheduled shift(s)
// if outside the SHIFT OUT WINDOW but within the GRACE window AND LATE OUT DO NOT offer actual button and ONLY SHOW SHIFTS IF MORE THAN ONE
//			if only one shift just go to exceptions
// if within the SHIFT OUT WINDOW but earlyOUT (actDiff < 0) skip this screen and go to exceptions
// if outside the window but within the GRACE WINDOW and veryEarlOUT DO NOT offer actual button and ONLY SHOW SHIFTS IF MORE THAN ONE
//			if only one shift skip this screen and go to exceptions
// 
(function(){
	try{

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'actualVsScheduled', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function changeLabelColor(e){
			e.source.removeEventListener(e.type, changeLabelColor);
			e.source.backgroundColor = (e.type === 'touchstart') ? "#34aadc" : "#fff";
			e.source.color = (e.type === 'touchstart') ? "#fff" : "#333";
		}

		function actualTimeSelected(e){
			try{
				e.source.removeEventListener('click', actualTimeSelected);
				
				// at this point the exception can only be earlyIn or lateOut,
				//	man I need a table for these exception numbers os some object, clean that up!
				if(sessionObj.currentPunch.transType === 'I'){
					sessionObj.punchException = 2;
				}else{
					sessionObj.punchException = 9;
				}
				sessionObj.nextWindow = 'employeeFlow_earlyOrLate';
				// sessionObj.currentPunch.overrideFlag = 1; // removed this bcs the currentPunch starts with the flag set to 1

				if(sessionObj.shift.length !== 1){// more than one shift with same starting/ending time
					// let them choose the shift they are overriding
					updateUI_pickShift();
				}else{
					sessionObj.currentPunch.shiftID = e.source.shiftID;
					
					CloudClock.dispatcher.nextWindow({
						context: $
					});
				}
			}
			catch(error){
				CloudClock.error(error);
			}
		}

		function scheduledShiftSelected(e){
			// at this point we have to set the scheduled time and shift ID on to the
			// current punch 
			try{
				e.source.removeEventListener('click', scheduledShiftSelected);
				sessionObj.currentPunch.shiftID = e.source.shiftID;
				
				sessionObj.currentPunch.overrideFlag = 0; // change the flag here if they are NOT overriding the actual time

				// no exceptions to be shown cause they are punching in/out for the scheduled time
				// send immediate punch to get the next screen
				// softScheduling.immediatePunch($);
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			}
			catch(error){
				CloudClock.error(error);
			}
		}

		function multiShiftPicked(e){
			// shift picked after ACTUAL TIME WAS SELECTED or NOT ?
			e.source.removeEventListener('click', multiShiftPicked);

			// let's reduce the number of shifts in the session object
			sessionObj.shift = sessionObj.shift.splice([e.source.shiftOrder], 1);
			sessionObj.currentPunch.shiftID = e.source.shiftID;

			if(sessionObj.punchException){
				sessionObj.nextWindow = 'employeeFlow_earlyOrLate';
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			}else{
				// no exceptions to be shown cause they are punching in/out for the scheduled time
				// send immediate punch to get the next screen
				softScheduling.immediatePunch($);
			}
		}

		function buildScheduledShiftView(_shift, _parentView, _evtFunc){

			var scheduledShiftLbl = Ti.UI.createLabel({
				text: "Scheduled\n"+_shift.get('displayName'),
				top: '10dp',
				left: (numOfShifts > 4 && _parentView.id !== 'scheduledTimeWrap') ? '5%' : '20%',
				right: (numOfShifts > 4 && _parentView.id !== 'scheduledTimeWrap') ? '5%' : '20%',
				width: (numOfShifts > 4 && _parentView.id !== 'scheduledTimeWrap') ? '40%' : '60%',
				height: '100dp',
				backgroundColor: '#fff',
				borderRadius: 5,
				borderWidth: '1dp',
				borderColor: "#e4e4e4",
				font: {
					fontSize: '22dp',
					fontWeight: 'bold'
				},
				color: '#333',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

				// OVERRIDE FLAG TO BE SET SINCE WE NEED TO RECORD THE SCHEDULED TIME HERE
				shiftOrder: 0,
				shiftID: _shift.get('deptShiftID'),
				overrideFlag: 0
			});

			scheduledShiftLbl.addEventListener('click', _evtFunc.click);
			scheduledShiftLbl.addEventListener('touchstart', _evtFunc.touch);
			scheduledShiftLbl.addEventListener('touchend', _evtFunc.touch);

			_parentView.add(scheduledShiftLbl);

			scheduledShiftLbl = null;
		}

		function destroy(){
			$.actualVsScheduled.removeEventListener('touchstart', restartTimeout);
			$.actualVsScheduled.removeEventListener('close', destroy);
			$.destroy();

			$.actualVsScheduled.removeAllChildren();

			sessionObj = null;

			$ = null;
		}

		function addEventListeners(){
			$.actualVsScheduled.addEventListener('close', destroy);
			$.actualVsScheduled.addEventListener('open', function(){
				restartTimeout();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
			$.actualVsScheduled.addEventListener('touchstart', restartTimeout);
			$.actualTimeLbl.addEventListener('click', actualTimeSelected);
			$.actualTimeLbl.addEventListener('touchstart', changeLabelColor);
			$.actualTimeLbl.addEventListener('touchend', changeLabelColor);
		}

		function updateUI_pickShift(){
			$.actualTimeWrap.hide();
			$.scheduledTimeWrap.setWidth('100%');

			$.actualVsScheduledLbl.setText(
				(sessionObj.currentPunch.transType === 'I') ? CloudClock.customL.strings('selectShiftIN') : CloudClock.customL.strings('selectShiftOUT')
			);
		}

		function updateUI(){
			// we are here in the first place bcs the actual flag is turned on or there are multiple shifts to choose from
			if(!sessionObj.showActual){
				// show actual if off but we are here? we must have multi shifts
				
				updateUI_pickShift();
			}else{
				// show actual on?
				// pass the shift ID to the actual time button ONLY if one shift available
				$.actualTimeLbl.shiftID = (sessionObj.shift.length !== 1) ? 0 : sessionObj.shift[0].get('deptShiftID');
				$.actualTimeLbl.setText("Now\n"+actualMoment.format("h:mmA")); // set the text on the actual btn

				$.actualVsScheduledLbl.setText(
					(sessionObj.currentPunch.transType === 'I') ? CloudClock.customL.strings('selectTimeIN') : CloudClock.customL.strings('selectTimeOUT')
				);
			}

			_.each(sessionObj.shift, function(shift, i){

				buildScheduledShiftView(
					shift, // shift object
					$.scheduledTimeWrap, // parent container to be populated
					{ // event functions
						click: (sessionObj.shift.length !== 1) ? multiShiftPicked : scheduledShiftSelected,
						touch: changeLabelColor
					}
				);
			});
		}

		var sessionObj = CloudClock.sessionObj;
		var numOfShifts = sessionObj.shift.length;
		var actualMoment = moment(sessionObj.currentPunch.transDateTime);
		var softScheduling = require('softScheduling');

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = (sessionObj.currentPunch.transType === "I") ? '1500' : '1600';

		updateUI();

		addEventListeners();
	}
	catch(error){
		CloudClock.error(error);
	}
})();
