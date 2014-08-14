//**************************************************
//*******	NEW EMPLOYEE  CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};

try{
	(function(){
		//Private functions
		function newEmployeeTxtFieldChange(){

			try{
				restartTimeout();
				$.newEmployeeTxtField.removeEventListener('change', newEmployeeTxtFieldChange);
				initialsChecker = $.newEmployeeTxtField.getValue();
				if(initialsChecker.length > 4){
					// alert(CloudClock.customL.strings('newEmp_tooManyChars'));

					$.tooManyChars = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('newEmp_tooManyChars'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									$.newEmployeeTxtField.value = "";
									$.newEmployeeTxtField.addEventListener('change', newEmployeeTxtFieldChange);
									$.tooManyChars.hide.apply($);
									$.newEmployeeTxtField.focus();
								}
							}
						}
					});
					$.newEmployeeTxtField.blur();
					$.tooManyChars.show.apply($);
				}

				$.newEmployeeTxtField.addEventListener('change', newEmployeeTxtFieldChange);
			}catch(error){
				//console.log('\n\n\nError in the newEmployeeTxtFieldChange fn: '+error);
				CloudClock.error(error);
			}
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'newEmployee', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function updateUI(){
			//set language
			$.instructions.setText(CloudClock.customL.strings('newEmp_instructions'));
			//end

			$.submitNewEmployeeTxt.setText('Submit');
			$.submitNewEmployee.enabled = true;
		}

		function updateHelp(){
			$.header.exit.windowId = 'newEmployee';
			$.header.helpButton.employeeLang = 'en-US';
			$.header.helpButton.viewNo = '1300';
		}

		function getInitials(e){
			var newEmployeeInitials = '';

			function addTheEventBack(){
				$.submitNewEmployee.addEventListener('click', getInitials);
				$.submitNewEmployee.enabled = true;
				$.newEmployeeTxtField.addEventListener('return', getInitials);
			}

			try{
				$.submitNewEmployee.removeEventListener('click', getInitials);

				$.submitNewEmployee.enabled = false;

				$.newEmployeeTxtField.removeEventListener('return', getInitials);

				newEmployeeInitials = $.newEmployeeTxtField.getValue();

				var n = newEmployeeInitials.match(/^[A-Za-z]+$/);

				if(!n){
					$.invalidChars = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('newEmp_invalidChars'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									
									$.invalidChars.hide.apply($);

									addTheEventBack();

									$.newEmployeeTxtField.focus();
								}
							}
						}
					});

					$.newEmployeeTxtField.blur();

					$.invalidChars.show.apply($);
				}
				else{
					
					if(!newEmployeeInitials){
						$.newEmp_alert = CloudClock.customAlert.create({
							type: 'alert',
							cancel: 0,
							buttonNames: [CloudClock.customL.strings('ok')],
							title: CloudClock.customL.strings('alert'),
							message: CloudClock.customL.strings('newEmp_alert'),
							callback:{
								eType: 'click',
								action: function(_e){
									if(_e.source.id === this.cancel){
										
										$.newEmp_alert.hide.apply($);

										addTheEventBack();

										$.newEmployeeTxtField.focus();
									}
								}
							}
						});
						$.newEmp_alert.show.apply($);
					}
					else{
						var newEmployee = Alloy.createModel('employees', {
							badge: 0,
							pin: newEmployeePin,
							name: newEmployeeInitials,
							primaryDeptNum: Ti.App.Properties.getString('DEFAULTDEPTNO'),
							allowOpenDept: (Ti.App.Properties.getString('OPENDEPT') && Ti.App.Properties.getString('OPENDEPT') === '1') ? 1 : 0,
							byPassBio: 0,
							requestPTO: 0,
							scheduleReport: '',
							replyTo: '0',
							lang: 'en_us',
							fixPunch: 0,
							cellPhone: '',
							cellCarrier: '',
							email: '',
							isBioRegistered: 0,
							type1: '0',
							type2: '0',
							photoFileName: '',
							photoData: ''
						});

						$.newEmployeeTxtField.blur();

						newEmployee.save();

						$.activityIndicator.setMessage('Saving new employee...');
						$.activityIndicator.show();

						Alloy.Collections.employees.fetch({
							success: function(){
								$.activityIndicator.hide();
								$.activityIndicator.setMessage('Loading...');
							},
							error: function(collection, response, options){
								CloudClock.log('Error', JSON.stringify(response));
							}
						});

						//GO TO CLOCK IN/OUT WINDOW
						Alloy.createController('employeeFlow_clockInOut', {
							employees: [newEmployee]
						});

						$.newEmployee.close();
					}
				}
			}catch(error){
				//console.log('\n\n\nGet innitials evt: '+error);
				CloudClock.error(error);
			}
		}

		function changeColor(e){
			e.source.setBackgroundColor('#34aadc');
			e.source.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#62bb47';
		}

		function destroy(){
			$.newEmployee.removeEventListener('touchstart', restartTimeout);
			$.newEmployee.removeEventListener('close', destroy);
			$.submitNewEmployee.removeEventListener('touchstart', changeColor);
			$.submitNewEmployee.removeEventListener('touchend', changeColor);
			$.submitNewEmployee.removeEventListener('click', getInitials);
			$.newEmployeeTxtField.removeEventListener('return', getInitials);
			$.newEmployeeTxtField.removeEventListener('change', newEmployeeTxtFieldChange);
			$.destroy();

			$.newEmployee.removeAllChildren();
			$.destroy();
			$ = null;
		}

		function addListeners(){
			//event listeners
			$.newEmployee.addEventListener('open', function(){
				restartTimeout();
				$.newEmployeeTxtField.focus();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
			$.newEmployee.addEventListener('close', destroy);
			$.newEmployee.addEventListener('touchstart', restartTimeout);
			$.submitNewEmployee.addEventListener('touchstart', changeColor);
			$.submitNewEmployee.addEventListener('touchend', changeColor);
			$.submitNewEmployee.addEventListener('click', getInitials);
			$.newEmployeeTxtField.addEventListener('return', getInitials);
			$.newEmployeeTxtField.addEventListener('change', newEmployeeTxtFieldChange);
		}

		var newEmployeePin = args.newEmployeePin;
		var initialsChecker = '';

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1202';

		addListeners();

		updateUI();

		updateHelp();

		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;

		$.newEmployee.open();
	})();
}
catch(error){
	CloudClock.error(error);
}










