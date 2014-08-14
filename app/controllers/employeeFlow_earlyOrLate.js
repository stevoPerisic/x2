//******************************************************************
//*******	EARLY OR LATE REASON SELECTION CONTROLLER	****************
//*****************************************************************
(function(){
	try{
		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'earlyOrLate', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function changeLabelColor(e){

			e.source.removeEventListener(e.type, changeLabelColor);

			if(e.type === 'touchstart')
			{
				e.source.backgroundColor = "#34aadc";
			}
			else
			{
				e.source.backgroundColor = "#fff";
			}
		}

		function reasonSelected(e){
			try{
				e.source.removeEventListener('click', reasonSelected);
				sessionObj.currentPunch.shiftID = (_.isFunction(sessionObj.shift.get)) ? sessionObj.shift.get('deptShiftID') : sessionObj.shift[0].get('deptShiftID');
				sessionObj.currentPunch.reasonCodeID = e.source.reasonCodeID;
				sessionObj.currentPunch.reasonCodeType = e.source.reasonCodeType;
				//
				// let's do the immediate punch here
				// softScheduling.immediatePunch($);
				// sessionObj.nextWindow = "";
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			}
			catch(error){
				CloudClock.error(error);
			}
		}

		function destroy(){
			$.earlyOrLate.removeEventListener('touchstart', restartTimeout);
			$.earlyOrLate.removeEventListener('close', destroy);
			$.destroy();

			$.earlyOrLate.removeAllChildren();

			sessionObj = null;

			$ = null;
		}

		function updateUI(){

			//text="Select the reason for working outside of your scheduled start time."
			// $.earlyOrLateLbl.text = CloudClock.customL.strings('earlyOrLate');
			// $.earlyOrLateLbl.text += reasonType+' punch.';
			$.earlyOrLateLbl.text =
				(sessionObj.punchException === 2) ?
				CloudClock.customL.strings('earlyIn') :
				(sessionObj.punchException === 15) ?
				CloudClock.customL.strings('earlyOut') :
				(sessionObj.punchException === 14) ?
				CloudClock.customL.strings('lateIn') :
				(sessionObj.punchException === 9) ?
				CloudClock.customL.strings('lateOut') :
				(sessionObj.punchException === 1) ?
				CloudClock.customL.strings('veryEarlyIn') :
				(sessionObj.punchException === 16) ?
				CloudClock.customL.strings('veryLateOut') :
				CloudClock.customL.strings('earlyOrLate')+reasonType+' punch.';


			_.each(earlyOrLateReasons, function(reason, i){

				var reasonLabel = Ti.UI.createLabel({
					// model attrs
					reasonCodeID: reason.get('reasonCodeID'),
					reasonCodeType: reason.get('reasonCodeType'),
					text: reason.get('reasonLabel'),
					// graphic props
					top: '20dp',
					left: '10%',
					width: '35%',
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
				});

				$.earlyOrLateReasons.add(reasonLabel);

				$.earlyOrLateReasons.children[i].addEventListener('click', reasonSelected);

				$.earlyOrLateReasons.children[i].addEventListener('touchstart', changeLabelColor);

				$.earlyOrLateReasons.children[i].addEventListener('touchend', changeLabelColor);

				reasonlabel = null;

			});
		}

		function addEventListeners(){
			$.earlyOrLate.addEventListener('close', destroy);
			$.earlyOrLate.addEventListener('open', function(){
				restartTimeout();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
			$.earlyOrLate.addEventListener('touchstart', restartTimeout);
		}

		// should move this out
		Alloy.Collections.reasonCodes.fetch({
			success: function(){
				console.log('Reason codes successfuly retrieved from local DB.');
			},
			error: function(collection, response, options){
				CloudClock.log('Error', JSON.stringify(response));
			}
		});

		var sessionObj = CloudClock.sessionObj;
		var earlyOrLateReasons = Alloy.Collections.reasonCodes.where({reasonCodeType: sessionObj.punchException});
		var reasonType = Alloy.Collections.reasonCodes.reasonCodeTypes[sessionObj.punchException];
		var softScheduling = require('softScheduling');

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo =
			(sessionObj.punchException === 2) ?
				"1501" :
				(sessionObj.punchException === 15) ?
				"1502" :
				(sessionObj.punchException === 14) ?
				"1504" :
				(sessionObj.punchException === 9) ?
				"1507" :
				// (sessionObj.punchException === 1) ?
				// "1506" :
				// (sessionObj.punchException === 16) ?
				// "1507" :
				"0";

		// check if we have reasons loaded in the table
		if(earlyOrLateReasons.length === 0){
			CloudClock.log('Error', 'The clock does not have data in the Reasons table, please set them up and initiate a Long Update.');
			CloudClock.log('Info', 'Taking the shift ID: '+sessionObj.currentPunch.shiftID+', Reason Code: '+sessionObj.currentPunch.reasonCodeID+', Reason type:'+sessionObj.currentPunch.reasonCodeType+'.');
			sessionObj.nextWindow = '';
			CloudClock.dispatcher.nextWindow({
				context: $
			});
		}else{
			updateUI();

			addEventListeners();
		}

	}catch(error){
		CloudClock.error(error);
	}
}());
