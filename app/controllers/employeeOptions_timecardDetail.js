//**************************************************
//*******	EMPLOYEE OPTIONS TIMECARD DETAIL CONTROLLER	****************
//*************************************************
(function(){
	try{
		//////////////// private fn's

		function emptyFn(e){
			$[e.source.id].removeEventListener('doubletap', emptyFn);
			return false;
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeOptions', 'employeeOptions', CloudClock.employeeOptions.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeOptionsDialog = true;
		}

		function goBack(e){

			restartTimeout();

			// no action taken if an API call is in progress
			if(CloudClock.APIcallInProgress)
				return false;

			$.back.removeEventListener('click', goBack);

			CloudClock.employeeOptions.optionsContent.left = '30%';
			CloudClock.employeeOptions.optionsContent.width = '70%';
			CloudClock.employeeOptions.sidebar.show();

			console.log(JSON.stringify($.timecardWrap.children));

			_.each($.timecardWrap.children, function(child){
				if(_.has(child, 'id') && child.id === 'timecardWebView')
					$.timecardWrap.remove(child);

				if(_.has(child, 'id') && child.id === 'timecardErrorLabel')
					$.timecardWrap.remove(child);
			});

			//$.timecardWrap.remove($.timecardWrap.children[2]);

			$.timecardWrapHeader.show();

			$.timecardDetail.show();

			$.tableHolder.show();

			$.weekNavBtns.visible = true;

			$.back.hide();

			$.back.addEventListener('click', goBack);
		}

		function moreDetailsClick(e){
			
			restartTimeout();

			// no action taken if an API call is in progress
			if(CloudClock.APIcallInProgress)
				return false;

			$.moreDetails.removeEventListener('click', moreDetailsClick);

			CloudClock.employeeOptions.activityIndicator.show();
			CloudClock.employeeOptions.optionsContent.left = 0;
			CloudClock.employeeOptions.optionsContent.width = '100%';
			CloudClock.employeeOptions.sidebar.hide();

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

		function printTimecard(e){
			$.print.removeEventListener('click', printTimecard);

			restartTimeout();

			//CloudClock.employeeOptions.activityIndicator.show();

			timecardPrint_cfg.params.weekId = week;

			timecardPrint_cfg.params.termID = Ti.App.Properties.getString('TERMID');
			CloudClock.api.request(timecardPrint_cfg);

			$.print.addEventListener('click', printTimecard);
		}

		function getTimecardPrint_success(response){
			//	DIRECTORIES AND STORING PICS
			// get a handle to the as-yet non-existent directory
			var printTimecardDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'printTimecard');

			printTimecardDir.createDirectory(); // this creates the directory

			var printTimecardFile = 'timecardDetails.txt';

			var timecard = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, printTimecardFile);

			timecard.write(response.timecard);

			timecard.move('printTimecard/' + printTimecardFile);

			timecard = null;

			printer.print({
				file: 'printTimecard/' + printTimecardFile,
				text:{
					isMarkup: true
				},
				orientation : 'landscape',
				view : $.commIconsWrap,
				sentToPrinter: function(r){
					//console.log('SentToPrinter callback: ' + JSON.stringify(r));
				}
			});
		}

		function setText(){
			
			if(OS_IOS)
			{
				$.backBtnLbl.setText(CloudClock.customL.strings('back_btn'));
				$.previousWeekLbl.setText(CloudClock.customL.strings('previous'));
				$.nextWeekLbl.setText(CloudClock.customL.strings('next'));
			}
			else
			{
				$.back.setTitle(CloudClock.customL.strings('back_btn'));
				$.previousWeek.setTitle(CloudClock.customL.strings('previous'));
				$.nextWeek.setTitle(CloudClock.customL.strings('next'));
			}

			$.weeklySummLbl.setText(CloudClock.customL.strings('weekly_summ'));

			$.dailySummLbl.setText(CloudClock.customL.strings('daily_summ'));

			$.moreDetails.setText(CloudClock.customL.strings('more_details'));

			$.printLbl.setText(CloudClock.customL.strings('print'));
			$.smsLbl.setText(CloudClock.customL.strings('sms'));
			$.emailLbl.setText(CloudClock.customL.strings('email'));
		}

		function updateUI(){

			CloudClock.employeeOptions.activityIndicator.show();
			
			timecard.viewDetails();

			$.back.setVisible(false);
			$.timecardDetail.setVisible(false);

			setText();

			var parm = CloudClock.getAppParameters();
			$.email.setVisible(parm.isEmailAllowed);
			$.text.setVisible(parm.isTextAllowed);
			$.print.setVisible(parm.isPrintAllowed);
		}

		function addEventListeners(){
			//	EVENT LISTENERS

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

		$.week = 0;
		$.weekEnding = true; //for showing the no-timesheet-details view
		$.restartTimeout = restartTimeout;
		//disable the next week button right away
		$.nextWeek.enabled = false;
		$.previousWeek.week = 1;
		$.nextWeek.week = 0;

		var timecard = CloudClock.employeeOptions.timecard; //require('timecard');
		timecard.init($);

		updateUI();

		addEventListeners();

		restartTimeout();

	}catch(error){
		CloudClock.error(error);
	}
}());






