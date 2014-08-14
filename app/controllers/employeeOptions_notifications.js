//**************************************************
//*******	NOTIFICATIONS CONTROLLER	****************
//*************************************************
//var args = arguments[0] || {};

(function(){
	try{

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeOptions', 'employeeOptions', CloudClock.employeeOptions.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeOptionsDialog = true;
		}

		function changeNotifType(e){
			//console.log(JSON.stringify(e.source));

			try{
				$.notifType.removeEventListener('click', changeNotifType);

				restartTimeout();

				if($[type]){
					$[type].remove(typeChckMark);
				}

				type = e.source.id;

				$[type].add(typeChckMark);

				setNotificationPrefs_cfg.params.type = e.source.id;

				if(setNotificationPrefs_cfg.params.time){
					CloudClock.employeeOptions.activityIndicator.show();
					//console.log(JSON.stringify(setNotificationPrefs_cfg));
					setNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					CloudClock.api.request(setNotificationPrefs_cfg);
				}

				$.notifType.addEventListener('click', changeNotifType);
			}
			catch(error){
				//console.log('\n\n\nError in the changeNotifType fn: '+error);
				CloudClock.error(error);
			}
		}

		function changeNotifDay(e){
			//console.log(JSON.stringify(e.source));

			try{
				$.notifDay.removeEventListener('click', changeNotifDay);

				restartTimeout();


				if($[day]){
					$[day].remove(dayChckMark);
				}

				day = e.source.id;

				$[day].add(dayChckMark);

				$[day].applyProperties({font: {fontSize: '18dp', fontWeight: 'bold'}});

				var paramsDay = day.substr(0,3);
				setNotificationPrefs_cfg.params[paramsDay] = 1;
				setNotificationPrefs_cfg.params.time = '0900';

				if(setNotificationPrefs_cfg.params.time){
					CloudClock.employeeOptions.activityIndicator.show();
					//console.log(JSON.stringify(setNotificationPrefs_cfg));
					setNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					CloudClock.api.request(setNotificationPrefs_cfg);
				}

				$.notifDay.addEventListener('click', changeNotifDay);
			}
			catch(error){
				//console.log('\n\n\nError in the changeNotifDay fn: '+error);
				CloudClock.error(error);
			}
		}

		function setLanguage(){
			$.notifications_header.setText(CloudClock.customL.strings('notifications_header'));
			$.deliveryPref.setText(CloudClock.customL.strings('delivery_prefs'));
			$.deliveryDay.setText(CloudClock.customL.strings('delivery_day'));
			$.EmailLbl.setText(CloudClock.customL.strings('sett_name_email'));
			$.TextLbl.setText(CloudClock.customL.strings('notif_text'));
			$.bothLbl.setText(CloudClock.customL.strings('notif_both'));
			$.sundayLbl.setText(CloudClock.customL.strings('sunday'));
			$.mondayLbl.setText(CloudClock.customL.strings('monday'));
			$.tuesdayLbl.setText(CloudClock.customL.strings('tuesday'));
			$.wednesdayLbl.setText(CloudClock.customL.strings('wednesday'));
			$.thursdayLbl.setText(CloudClock.customL.strings('thursday'));
			$.fridayLbl.setText(CloudClock.customL.strings('friday'));
			$.saturdayLbl.setText(CloudClock.customL.strings('saturday'));
		}

		function updateUI(){
			//set language
			setLanguage();
			//end
		}

		function addEventListeners(){
			$.notifType.addEventListener('click', changeNotifType);
			$.notifDay.addEventListener('click', changeNotifDay);
		}

		var employee = CloudClock.sessionObj.employee;
		var chckMarkParams = {
			image: '/images/icons/1_navigation_accept_blk.png',
			width: '33dp',
			height: '33dp',
			right: '15dp'
		};
		var typeChckMark = Ti.UI.createImageView(chckMarkParams);
		var dayChckMark = Ti.UI.createImageView(chckMarkParams);
		var type;
		var day;

		var params = {
			'badge': employee.get('badge')
		};
		var getNotificationPrefs_cfg = {
			endpoint: 'getSchedule',
			params: params,
			onSuccess: function(response){
				//console.log(JSON.stringify(response));
				_.each(response, function(item, key){

					if(item === 1){
						//console.log("Item: " + item + ", Key: " + key);
						day = key;

						if($[day]){

							$[day].add(dayChckMark);

						}
					}
				});

				type = response.type;

				if($[type]){
					$[type].add(typeChckMark);
				}

				if(CloudClock.employeeOptions !== null){
					CloudClock.employeeOptions.activityIndicator.hide();
				}
			},
			onError: function(response){
				CloudClock.log('Error', 'Error getting notification pref.: ' + JSON.stringify(response));

				if(CloudClock.employeeOptions !== null){
					CloudClock.employeeOptions.activityIndicator.hide();
				}
			}
		};
		//	THIS HERE IS VERY INTERESTING THE ONLY AND I MEAN THE ONLY POST CALL THAT DOES NOT ACCEPT A PAYLOAD BUT INSTEAD WANTS FORM DATA IN THE URL
		var setNotificationPrefs_cfg = {
			endpoint: 'updateSchedule',
			params: params,
			onSuccess: function(response){
				//console.log(response);

				if(CloudClock.employeeOptions !== null){
					CloudClock.employeeOptions.activityIndicator.hide();
				}
			},
			onError: function(response){
				CloudClock.log('Error', 'Error setting notification pref.: ' + JSON.stringify(response));

				if(CloudClock.employeeOptions !== null){
					CloudClock.employeeOptions.activityIndicator.hide();
				}
			}
		};

		updateUI();

		addEventListeners();

		CloudClock.employeeOptions.activityIndicator.show();

		getNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString('TERMID');
		CloudClock.api.request(getNotificationPrefs_cfg);

		restartTimeout();
	
	}catch(error){
		CloudClock.error(error);
	}
}());









