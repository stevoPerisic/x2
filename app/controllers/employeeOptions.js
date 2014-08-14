//**************************************************
//*******	EMPLOYEE OPTIONS MASTER CONTROLLER	****************
//**************************************************
//console.log('Employee Options being read....');
// var args = arguments[0] || {};
(function(){
	try{

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeOptions', 'employeeOptions', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeOptionsDialog = true;
		}

		function setLanguage(){
			$.employeeOptions.removeEventListener('changeLang', setLanguage);

			$.sidebarHeader.setText(CloudClock.customL.strings('emplOpts_sidebarHeader'));
			$.timesheetsLbl.setText(CloudClock.customL.strings('timesheets'));
			$.notificationsLbl.setText(CloudClock.customL.strings('notifications'));
			$.generalSettingsLbl.setText(CloudClock.customL.strings('genSettings'));
		}

		exports.setLanguage = function(){
			setLanguage();
		};

		function updateUI(){
			//set language
			setLanguage();
			//done

			if(OS_IOS){
				CloudClock.employeeOptions.header.helpButton.hide();
			}else{
				CloudClock.employeeOptions.header.helpButton.setVisible(false);
			}

			CloudClock.dispatcher.route('employeeOptions', 'optionsContent', 'employeeOptions_timecardDetail', false, {
				//employee: employee[0].id,
				location: 'employeeOptions'
			});

			CloudClock.sideMenu.init('employeeOptions', 'optionsContent', $.sideBarMenu.getChildren(), 'timecardDetail', {
				//employee: employee[0].id,
				location: 'employeeOptions'
			});
		}

		function destroy(){
			$.employeeOptions.removeEventListener('close', destroy);

			// clean up timecard
			$.timecard.gc();

			$.destroy();
			$ = null;

			CloudClock.employeeOptions.destroy();
			CloudClock.employeeOptions = null;
		}

		function addEventListeners(){
			$.employeeOptions.addEventListener('close', destroy);
			$.employeeOptions.addEventListener('changeLang', setLanguage);
			$.employeeOptions.addEventListener('open', function(){
				if(Ti.Network.online === false){
					$.noNetworkEmplOpts = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('noNetworkEmplOpts'),
						callback:{
							eType: 'click',
							action: function(_e){
								$.noNetworkEmplOpts.hide.apply($);
								Alloy.createController('index', {doNotSetParams: true});
								$.employeeOptions.close();
							}
						}
					});
					CloudClock.employeeOptions.activityIndicator.hide();
					$.noNetworkEmplOpts.show.apply($);
				}
			});
		}

		$.timecard = require('timecard');
		
		CloudClock.employeeOptions = $;
		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;
		var employee = CloudClock.sessionObj.employee;

		updateUI();

		addEventListeners();

		$.employeeOptions.open();

	}catch(error){
		CloudClock.error(error);
	}
}());





