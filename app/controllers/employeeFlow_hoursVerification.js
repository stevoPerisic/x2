var args = arguments[0] || {};

(function(){

	try{

		function emptyFn(e){
			$[e.source.id].removeEventListener('doubletap', emptyFn);
			return false;
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'hoursVerification', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function changeBackground(e){
			e.source.backgroundColor = (e.type === 'touchstart') ? "#34aadc" : "#62bb47";
		}

		function setText(){
			if(OS_IOS){
				$.backBtnLbl.setText(CloudClock.customL.strings('back_btn'));
				$.previousWeekLbl.setText(CloudClock.customL.strings('previous'));
				$.nextWeekLbl.setText(CloudClock.customL.strings('next'));
				$.header.exitLbl.setText(CloudClock.customL.strings('done'));
			}else{
				$.back.setTitle(CloudClock.customL.strings('back_btn'));
				$.previousWeek.setTitle(CloudClock.customL.strings('previous'));
				$.nextWeek.setTitle(CloudClock.customL.strings('next'));
				$.header.exit.setTitle(CloudClock.customL.strings('done'));
			}

			$.weeklySummLbl.setText(CloudClock.customL.strings('weekly_summ'));
			// $.dailySummLbl.setText(CloudClock.customL.strings('daily_summ'));
			$.moreDetails.setText(CloudClock.customL.strings('more_details'));
		}

		function updateUI(){
			
			// $.header.helpButton.hide();
			$.back.hide();

			if(Ti.Network.online === true){
				$.activityIndicator.show();
				timecard.viewDetails();
				$.timecardDetail.setVisible(false);
				$.printLbl.setText(CloudClock.customL.strings('print'));
				$.smsLbl.setText(CloudClock.customL.strings('sms'));
				$.emailLbl.setText(CloudClock.customL.strings('email'));
			}else{
				$.noNetwork.setText(CloudClock.customL.strings('error_lbl_3'));
				$.tableHeaderWrap.hide();
				$.tableWeeklySum.hide();
				$.weekNavBtns.hide();
				$.commIconsWrap.hide();
			}

			setText();

			var parm = CloudClock.getAppParameters();
			$.email.setVisible(parm.isEmailAllowed);
			$.text.setVisible(parm.isTextAllowed);
			$.print.setVisible(parm.isPrintAllowed);

			// punch review
			$.masterPhotoLbl.setText(CloudClock.customL.strings('master_photo'));
			$.reviewPicLabel.setText(CloudClock.customL.strings('punch_photo'));

			var CAPTUREPHOTO = Ti.App.Properties.getString('CAPTUREPHOTO');
			if(CAPTUREPHOTO === '1'){
				if(sessionObj.currentPunch.photoData){
					// $.punchPhoto.image = sessionObj.currentPunch.photoData;
					var decodedFace = Ti.Utils.base64decode(sessionObj.currentPunch.photoData);

					var properties = Object.getOwnPropertyNames(decodedFace);
					for(var i=0;i<properties.length;i++)
						console.log("Property: " + properties[i] + "\nValue: " + decodedFace[properties[i]]);

					$.punchPhoto.image = decodedFace;
				}else{
					$.punchPhoto.setImage('images/icons/no-photo-256-gray.png');
				}
				//alert(sessionObj.employee.get('photoFileName'));
				if(sessionObj.employee.get('photoFileName').indexOf('/images/icons/') === 0){
					$.masterPhoto.setImage(sessionObj.employee.get('photoFileName'));
				}else{
					CloudClock.getLocalPhoto($.masterPhoto, sessionObj.employee.get('photoFileName'));
				}
			}else{
				$.reviewLeft.remove($.photoReview);
			}

			// $.reviewText.setText(CloudClock.customL.strings('review_Text'));
			$.nameAndPin.setText(sessionObj.employee.get('name').replace(/\s*$/,"") + ' (' + sessionObj.employee.get('badge') + ')');
			$.pin.setText(CloudClock.customL.strings('pin') + Ti.App.Properties.getString('PINFORSHOW'));
			var punchTime = moment(sessionObj.currentPunch.transDateTime);
			//	SET DATE LABEL
			$.date.setText(CloudClock.customL.strings('date') + punchTime.format('dddd[, ] MMMM D'));
			//	SET CLOCK IN/OUT TIME LABEL
			//
			// IF the employee chose the SCHEDULED time we should display that tme instead of the actual time
			// We can use the override flag from the current punch to see if they took actual time or not
			var minutes = 0;
			var clockInOutString = '';
			var timeString = function(minutes){
				var timeString = ((minutes-(minutes%60))/60) + ":" + (minutes%60);
				var displayTime = (sessionObj.currentPunch.overrideFlag) ?
									clockInOutString + punchTime.format('h:mm a') :
									clockInOutString + moment(timeString, 'h:mm').format('h:mm a');

				return displayTime;
			};
			if(sessionObj.currentPunch.transType === 'O'){
				minutes = sessionObj.shift[0].get('shiftEnd');
				clockInOutString = CloudClock.customL.strings('clock_out_time');
			}else{
				minutes = sessionObj.shift[0].get('shiftStart');
				clockInOutString = CloudClock.customL.strings('clock_in_time');
			}
			$.clockInTime.setText(timeString(minutes));

			//	SET DEPARTMENT NAME LABEL
			var departmentName = Alloy.Collections.departments.where({departmentNum: sessionObj.currentPunch.departmentNum});
			$.departmentName.text = (departmentName.length !== 0) ? "Dept: " + departmentName[0].get('name') : CloudClock.customL.strings('openDept_deptNotFound');
		}

		function goBack(e){

			// no action taken if an API call is in progress
			if(CloudClock.APIcallInProgress)
				return false;

			$.back.removeEventListener('click', goBack);

			$.timecardWrap.remove($.timecardWrap.children[2]);

			timecard.viewDetails();

			$.timecardWrapHeader.show();

			$.timecardDetail.show();

			$.tableHolder.show();

			$.weekNavBtns.visible = true;

			$.back.hide();

			$.back.addEventListener('click', goBack);

			// adding view number for the help audio files
			Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1600';
			Alloy.Collections.deviceHelp.audioPlayer.play();
		}

		function destroy(){
			// if the session times out ... all hell breaks loose :)
			if(sessionObj.employee.id){
				// clear session
				sessionObj.clearSession();
			}
		
			// unbind the event listeners
			$.hoursVerification.removeEventListener('touchstart', restartTimeout);
			$.hoursVerification.removeEventListener('close', destroy);

			CloudClock.clock.showEmployeeFlowDialog = false;
		}

		function moreDetailsClick(e){
			
			restartTimeout();

			// no action taken if an API call is in progress
			if(CloudClock.APIcallInProgress)
				return false;

			$.moreDetails.removeEventListener('click', moreDetailsClick);

			$.activityIndicator.show();

			$.weekNavBtns.visible = false;

			$.back.show();

			$.tableHolder.hide();

			timecard.viewDetailsPrint();

			$.moreDetails.addEventListener('click', moreDetailsClick);
		}

		function moreDetailsBackgroundChange(e){
			e.source.backgroundColor = (e.type === 'touchstart') ? "#34aadc" : '#fff';
			e.source.borderColor = (e.type === 'touchstart') ? "#fff" : '#34aadc';
			e.source.color = (e.type === 'touchstart') ? "#fff" : '#34aadc';
		}

		function addEventListeners(){
			//	EVENT LISTENERS
			$.hoursVerification.addEventListener('close', destroy);
			$.hoursVerification.addEventListener('open', function(){
				restartTimeout();

				Alloy.Collections.deviceHelp.audioPlayer.play();

				// dialog with user if the immediate punch was processed or not
				if(CloudClock.flashConfirmation){
					if(CloudClock.flashConfirmation === 'error'){
						$.immediatePunchConfirmation.color = "#ff2d55";
						$.immediatePunchConfirmation.setText(CloudClock.customL.strings('immediatePunchFail'));
					}else{
						$.immediatePunchConfirmation.color = "#62bb47";
						$.immediatePunchConfirmation.setText(CloudClock.customL.strings('immediatePunchSuccess'));
					}
				}
			});
			$.hoursVerification.addEventListener('touchstart', restartTimeout);

			$.previousWeek.addEventListener('click', timecard.navigateWeeks);
			$.previousWeek.addEventListener('doubletap', emptyFn);
			$.previousWeek.addEventListener('touchstart', timecard.prevNextChangeBackground);
			$.previousWeek.addEventListener('touchend', timecard.prevNextChangeBackground);

			$.nextWeek.addEventListener('click', timecard.navigateWeeks);
			$.nextWeek.addEventListener('doubletap', emptyFn);
			$.nextWeek.addEventListener('touchstart', timecard.prevNextChangeBackground);
			$.nextWeek.addEventListener('touchend', timecard.prevNextChangeBackground);

			$.back.addEventListener('click', goBack);

			$.moreDetails.addEventListener('click', moreDetailsClick);
			$.moreDetails.addEventListener('touchstart', moreDetailsBackgroundChange);
			$.moreDetails.addEventListener('touchend', moreDetailsBackgroundChange);

			//commButtonsChangeColor
			$.text.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.email.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.print.addEventListener('touchstart', timecard.commButtonsChangeColor);
			$.text.addEventListener('touchend', timecard.commButtonsChangeColor);
			$.email.addEventListener('touchend', timecard.commButtonsChangeColor);
			$.print.addEventListener('touchend', timecard.commButtonsChangeColor);
			// actions
			$.print.addEventListener('click', timecard.printMe);
			$.text.addEventListener('click',
				// if employee has cell phone set up?
				(CloudClock.sessionObj.employee.get('cellPhone')) ?
				timecard.textMe :
				timecard.setUpEmplComm
			);

			$.email.addEventListener('click',
				// if employee has cell phone set up?
				(CloudClock.sessionObj.employee.get('email')) ?
				timecard.emailMe :
				timecard.setUpEmplComm
			);
		}

		var sessionObj = CloudClock.sessionObj;

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1600';

		$.week = 0;
		$.weekEnding = true; //for showing the no-timesheet-details view
		$.restartTimeout = restartTimeout;
		//disable the next week button right away
		$.nextWeek.enabled = false;
		$.previousWeek.week = 1;
		$.nextWeek.week = 0;
		var timecard = require('timecard');
		if(Ti.Network.online === true){
			timecard.init($);
		}
		updateUI();

		addEventListeners();
	}
	catch(error){
		CloudClock.error(error);
	}
})();