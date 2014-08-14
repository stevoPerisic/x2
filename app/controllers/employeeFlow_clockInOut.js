//**************************************************
//*******	CLOCK IN/OUT  CONTROLLER	****************
//*************************************************

// passed in arguments from the index.js controller
var args = arguments[0] || {};

(function(){
	try{
		var clockInOut = {
			clockWorkSpan:  parseInt(Ti.App.Properties.getString('WORKSPAN'), 10)*3600000, // work span hours (comes in hours) in milliseconds
			restrictionIN: parseInt(Ti.App.Properties.getString('INPUNCHRESTRICT'), 10) * 60000, // INPUNCHRESTRICT (comes in minutes) in milliseconds
			restrictionINOUT: parseInt(Ti.App.Properties.getString('OUTINPUNCHRESTRICT'), 10) * 60000, // OUTINPUNCHRESTRICT (comes in minutes) in milliseconds
			restrictionOUT: parseInt(Ti.App.Properties.getString('OUTPUNCHRESTRICT'), 10) * 60000, // OUTPUNCHRESTRICT (comes in minutes) in milliseconds
			softScheduling_param: Ti.App.Properties.getString('SOFTSCHEDULING'),
			shortLunch: Ti.App.Properties.getString('SHORTLUNCH'),
			ninetyMinuteRule: 5400000, // 90 mins in miliseconds
			timeOfAction: {}, // will get this once the button is clicked
			direction: '',
			recordTransaction: function(_direction, _moment){
				try{
					sessionObj.currentPunch = {
						idType: (sessionObj.employee.get('badge')) ? 'U' : 'P',
						employeeBadge: (sessionObj.employee.get('badge') !== 0) ? sessionObj.employee.get('badge') : sessionObj.employee.get('pin'),
						transType: (_direction === 'clockIn') ? 'I' : 'O',
						departmentNum: (sessionObj.last_inPunch.departmentNum !== 0) ? sessionObj.last_inPunch.departmentNum : sessionObj.employee.get('primaryDeptNum'),
						transTime: _moment.secondsSince111970,
						transDateTime: _moment.convertedUnix,
						initials: (sessionObj.employee.get('badge') !== 0) ? false : sessionObj.employee.get('name'),
						shiftID: 0,
						// overrideFlag: 0,
						overrideFlag: 1, // changed so that we can display correct times on the confirmation and the IN/OUT buttons 
						sent: 0, // in progress
						reasonCodeID: 0,
						reasonCodeType: 0,
						amount: 0
					};
				}catch(error){
					CloudClock.error(error);
				}
			},
			checkRestrictions: function(){
				if(clockInOut.direction === 'clockIn'){
					if(CloudClock.punchRestrictions.inPunch()){
						// no restrictions keep going
						console.log('No restrictions!');
						return true;
					}else{
						// alert of restriction
						console.log('Yes restrictions!');
						if(sessionObj.restrictionDialog === 3){// INOUT restriction
							// tell them how much longer they have until they can clock back in
							var untilCanGoBackIn = clockInOut.restrictionINOUT - sessionObj.difference;

							$.restrictionINOUT_dialog = CloudClock.customAlert.create({
								type: 'alert',
								cancel: 0,
								buttonNames: [CloudClock.customL.strings('ok')],
								title: CloudClock.customL.strings('alert'),
								message: CloudClock.customL.strings('cantGoBackIn')+(moment(untilCanGoBackIn).format('mm [minutes.]')),
								callback:{
									eType: 'click',
									action: function(_e){
										if(_e.source.id === this.cancel){
											$.restrictionINOUT_dialog.hide.apply($);

											CloudClock.sessionObj.clearSession();

											CloudClock.clock.showEmployeeFlowDialog = false;
							
											Alloy.createController('index', {doNotSetParams: true});

											$.clockInOut.close();
										}
									}
								}
							});
							$.restrictionINOUT_dialog.show.apply($);
						}else{
							$.restrictionIN_dialog = CloudClock.customAlert.create({
								type: 'alert',
								cancel: 0,
								buttonNames: [CloudClock.customL.strings('ok')],
								title: CloudClock.customL.strings('alert'),
								message: CloudClock.customL.strings('alreadyClockedIn')+
								CloudClock.buttonLabelTime(sessionObj.last_inPunch.transDateTime).format('h:mm a'),
								callback:{
									eType: 'click',
									action: function(_e){
										if(_e.source.id === this.cancel){
											$.restrictionIN_dialog.hide.apply($);

											CloudClock.sessionObj.clearSession();
											
											CloudClock.clock.showEmployeeFlowDialog = false;
							
											Alloy.createController('index', {doNotSetParams: true});

											$.clockInOut.close();
										}
									}
								}
							});

							$.restrictionIN_dialog.show.apply($);
						}

						return false;
					}
				}else{
					if(CloudClock.punchRestrictions.outPunch()){
						// no restriction keep going
						console.log('No restrictions!');
						return true;
					}else{
						// alert of restriction
						console.log('Yes restrictions!');
						$.restrictionOUT_dialog = CloudClock.customAlert.create({
							type: 'alert',
							cancel: 0,
							buttonNames: [CloudClock.customL.strings('ok')],
							title: CloudClock.customL.strings('alert'),
							message: CloudClock.customL.strings('alreadyClockedOut')+
							CloudClock.buttonLabelTime(sessionObj.last_outPunch.transDateTime).format('h:mm a'),
							callback:{
								eType: 'click',
								action: function(_e){
									if(_e.source.id === this.cancel){
										$.restrictionOUT_dialog.hide.apply($);
										CloudClock.clock.showEmployeeFlowDialog = false;
						
										Alloy.createController('index', {doNotSetParams: true});

										$.clockInOut.close();
									}
								}
							}
						});
						$.restrictionOUT_dialog.show.apply($);
						return false;
					}
				}
			},
			// dispatch to next window
			nextWindow: function(){
				// dispatch to next window
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			},
			// now the action
			action: function(e){
				try{
					// direction in or out
					clockInOut.direction = e.source.customAttr;

					// time of user interaction
					clockInOut.timeOfAction = CloudClock.clock.getCurrentTime();

					if(Ti.App.Properties.getString('QAFLAG') === '1'){
						// this only for QA testing when we alter the actual time
						clockInOut.recordTransaction(clockInOut.direction, $.alteredTime);
						// get the difference betwee the current punch and the last punch transaction on the clock
						sessionObj.difference = ( $.alteredTime.secondsSince111970 - sessionObj.latestTransaction.transTime) *1000;
					}else{
						clockInOut.recordTransaction(clockInOut.direction, clockInOut.timeOfAction);
						// get the difference betwee the current punch and the last punch transaction on the clock
						sessionObj.difference = ( clockInOut.timeOfAction.secondsSince111970 - sessionObj.latestTransaction.transTime) *1000;
					}

					// runs every function in the order provided, if a fn returns false breaks the loop
					_.every(clockInOut[clockInOut.direction+'_order'], function(doThis){
						return doThis() === true;
					});
				}catch(error){
					CloudClock.error(error);
				}
			},
			init: function(){
				this.clockIn_order = {
					0: this.checkRestrictions,
					1: this.nextWindow
				};

				this.clockOut_order = {
					0: this.checkRestrictions,
					1: this.nextWindow
				};
			}
		};

		function emptyFn(e){
			$[e.source.id].removeEventListener('doubletap', emptyFn);
			return false;
		}

		function notMeClick(e){
			$.notMe.removeEventListener('click', notMeClick);

			if(Ti.App.Properties.getString('ALLOWCROSSPUNCH') === '0'){ // flag not on, new employees are not allowed to clock in

				$.contactManagerDialog = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('contact_manager'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								$.header.exit.fireEvent('click');
								$.contactManagerDialog.hide.apply($);
							}
						}
					}
				});
				$.contactManagerDialog.show.apply($);
			}else{
				Alloy.createController('employeeFlow_newEmployee', {
					newEmployeePin: sessionObj.employee.get('pin')
				});

				$.clockInOut.close();
			}
		}

		function changeColor(e){
			$[e.source.id].removeEventListener(e.type, changeColor);
			e.source.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#000';
		}

		function changeColorIN(e){
			$.clockIn.removeEventListener(e.type, changeColorIN);
			$.clockIn.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#62bb47';
		}

		function changeColorOUT(e){
			$.clockOut.removeEventListener(e.type, changeColorOUT);
			$.clockOut.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#ff2d55';
		}

		function populateSession(){
			try{
				sessionObj.employee = args.employees[0];
				sessionObj.last_inPunch = Alloy.Collections.clockHistory.getLatestClockIn(sessionObj.employee.get('alloy_id'));
				sessionObj.last_outPunch = Alloy.Collections.clockHistory.getLatestClockOut(sessionObj.employee.get('alloy_id'));
				sessionObj.latestTransaction = Alloy.Collections.clockHistory.getLatest(sessionObj.employee.get('alloy_id'));
				// let's get departments associated with this employee
				sessionObj.employeeDepartments = Alloy.Collections.employeeDepartments.getByEmployeeBadge(sessionObj.employee.get('badge'));
				// let's get the list of previous clock ins
				sessionObj.previousClockIns = Alloy.Collections.clockHistory.getPreviousClockIns(sessionObj.employee.get('alloy_id'));
				// let's get the ;ist of previous clock outs
				sessionObj.previousClockOuts =  Alloy.Collections.clockHistory.getPreviousClockOuts(sessionObj.employee.get('alloy_id'));

				CloudClock.log('Info', 'Session started for: '+JSON.stringify(sessionObj.employee));

			}catch(error){
				CloudClock.error(error);
			}
		}

		function updateUIclock(){
			// Clock
			CloudClock.UIClock = $.time; // update the UI clock
			$.time.setText(CloudClock.moment().format('h:mm a'));
			$.date.setText(CloudClock.moment().format('dddd[, ] MMMM D[,] YYYY'));
		}

		function updateUI(){

			function buttonLabelTime(t){
				//DAMN TIME ZONES ;)
				var time = t;

				//console.log('\n\n\nTime in button label time: '+time);

				var n = time.lastIndexOf("-");
				var l = time.length;
				var timeZone = time.substr(n, l);

				time = time.replace(timeZone, '');

				var formattedTime = CloudClock.moment(time).zone(timeZone);

				//console.log('\n\n\nFormatted time for the clock in / out button' + formattedTime);

				//returns a string with formated time for display
				return formattedTime;
			}

			CloudClock.buttonLabelTime = buttonLabelTime;

			//********************* UI updating *******************************
			// 
			// hide the help button - no help content for this screen
			// $.header.helpButton.setVisible(false);
			// new eemployee ? hide the employee options button else set the id on the button
			if(sessionObj.employee.get('badge') === 0){
				$.footer.employeeOptions.visible = false; // new employee not on server yet hide more options
			}else{
				//$.footer.employeeOptions.employeeAlloyID = sessionObj.employee.get('alloy_id'); //Set the employee id on the footer
			}
			//set language
			$.clockInLbl.setText(CloudClock.customL.strings('clock_in'));
			$.clockOutLbl.setText(CloudClock.customL.strings('clock_out'));

			if(OS_IOS){
				$.notMeLabel.setText(CloudClock.customL.strings('not_me'));
			}
			else{
				$.notMe.setTitle(CloudClock.customL.strings('not_me'));
			}
			//
			// employee name label trimmed whitespace off the end
			$.name.setText(sessionObj.employee.get('name').replace(/\s*$/,""));
			// employee pin number
			$.pinNo.setText(CloudClock.customL.strings('pin') + Ti.App.Properties.getString('PINFORSHOW'));
			// employee badge on the clock in button
			$.clockIn.badgeNo = sessionObj.employee.get('badge');
			// is photo capture turned on?
			if(Ti.App.Properties.getString('CAPTUREPHOTO') === '1')
			{
				// set employee pic
				if(sessionObj.employee.get('photoFileName').indexOf('/images/icons/') === 0){
					$.employeePic.setImage(sessionObj.employee.get('photoFileName'));
				}else{
					CloudClock.getLocalPhoto($.employeePic, sessionObj.employee.get('photoFileName'));
				}
			}
			else
			{
				// default ghost pic
				$.employeePic.setImage('/images/icons/no-photo-256-gray.png');
			}
			//Find the latest transaction to display on the clock in/out buttons if exists
			// 
			// let's check for SOFTSCHEDULING bcs. we might have to display the SCHEDULED time here instead of the ACTUAL
			// let's get the shift they used if it exists
			var lastShiftUsed = (sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime) ?
				Alloy.Collections.deptShifts.where({deptShiftID : sessionObj.last_inPunch.shiftID}) :
				Alloy.Collections.deptShifts.where({deptShiftID : sessionObj.last_outPunch.shiftID});

			if(Ti.App.Properties.getString('SOFTSCHEDULING') === '0' || _.isEmpty(lastShiftUsed)){
				console.log("\n\nEither no last shift used or no softscheduling :)");
				if(sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime){
					$.lastTimeInLbl.setText(buttonLabelTime(sessionObj.last_inPunch.transDateTime).format('ddd MMM D[ @ ]h:mm a'));

				}else if(sessionObj.last_inPunch.transTime < sessionObj.last_outPunch.transTime){
					$.lastTimeOutLbl.setText(buttonLabelTime(sessionObj.last_outPunch.transDateTime).format('ddd MMM D[ @ ]h:mm a'));
				}
			}else{
				var minutes = 0;
				var lastPunchTime = '';
				var timeString = function(minutes){
					var punchTime = moment(lastPunchTime);
					// var timeString = ((minutes-(minutes%60))/60) + ":" + (minutes%60);
					// have to set the current year and day, above was set to January 1st, NOT GOOD
					var timeString = moment(lastPunchTime);
					var hour = (minutes-(minutes%60))/60;
					var minute = minutes%60;
					timeString = timeString.hour(hour);
					timeString = timeString.minute(minute);
					var displayTime = (sessionObj.latestTransaction.overrideFlag) ? punchTime.format('ddd MMM D[ @ ]h:mm a') :  timeString.format('ddd MMM D[ @ ]h:mm a');

					return displayTime;
				};

				try{
					if(sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime){
						// lastShiftUsed = Alloy.Collections.deptShifts.where({deptShiftID : sessionObj.last_inPunch.shiftID});
						lastPunchTime = sessionObj.last_inPunch.transDateTime;
						minutes = lastShiftUsed[0].get('shiftStart');
						$.lastTimeInLbl.setText(timeString(minutes));

					}else if(sessionObj.last_inPunch.transTime < sessionObj.last_outPunch.transTime){
						// lastShiftUsed = Alloy.Collections.deptShifts.where({deptShiftID : sessionObj.last_outPunch.shiftID});
						lastPunchTime = sessionObj.last_outPunch.transDateTime;
						minutes = lastShiftUsed[0].get('shiftEnd');
						$.lastTimeOutLbl.setText(timeString(minutes));
					}
				}catch(error){
					console.log('\n\nError found, no lastShiftUsed, line 373 and 379');
					CloudClock.error(error);
				}
			}


			// if(sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime){
			// 	$.lastTimeInLbl.setText(buttonLabelTime(sessionObj.last_inPunch.transDateTime).format('ddd MMM D[ @ ]h:mm a'));

			// }else if(sessionObj.last_inPunch.transTime < sessionObj.last_outPunch.transTime){
			// 	$.lastTimeOutLbl.setText(buttonLabelTime(sessionObj.last_outPunch.transDateTime).format('ddd MMM D[ @ ]h:mm a'));
			// }
		}

		function startPunch(e){
			if(sessionObj.punchStarted){
				console.log('Punch already started, get out!');
				return false;
			}else{
				sessionObj.punchStarted = 1;
				if(Ti.App.Properties.getString('QAFLAG') === '1'){
					alterCurrentTime(e);
				}else{
					clockInOut.action(e);
				}
			}
		}

		function employeeOptions_click(e){
			if(Ti.Network.online !== false){

				// to turn off the help file audio
				if(CloudClock.sound)
					CloudClock.sound.stop();

				$.footer.employeeOptions.removeEventListener('click', employeeOptions_click);
				$.footer.employeeOptions.enabled = false;
				$.footer.employeeOptions.hide();

				CloudClock.clock.showEmployeeFlowDialog = false;
				Alloy.createController('employeeOptions');

				$.clockInOut.close();
			}else{
				CloudClock.noNetwork = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('noNetworkEmplOpts'),
					callback:{
						eType: 'click',
						action: function(_e){
							CloudClock.noNetwork.hide.apply($);
						}
					}
				});

				CloudClock.noNetwork.show.apply($);
			}
		}

		function addListeners(){
			// now let's add our event listeners
			$.clockInOut.addEventListener('open', Alloy.Collections.deviceHelp.audioPlayer.play);
			$.clockInOut.addEventListener('close', destroy); // destroy the controller and view
			$.clockInOut.addEventListener('touchstart', restartTimeout);
			// --------------------------------------------------------------------------------
			$.notMe.addEventListener('click', notMeClick);	// not me button in the sidebar
			$.notMe.addEventListener('touchstart', changeColor);
			$.notMe.addEventListener('touchend', changeColor);
			// --------------------------------------------------------------------------------
			$.clockIn.addEventListener('doubletap', emptyFn); // clock in button
			$.clockIn.addEventListener('click', startPunch);// (Ti.App.Properties.getString('QAFLAG') === '1') ? alterCurrentTime : clockInOut.action);
			
			$.clockIn.addEventListener('touchstart', changeColorIN);
			$.clockIn.addEventListener('touchend', changeColorIN);
			// --------------------------------------------------------------------------------
			$.clockOut.addEventListener('doubletap', emptyFn); // clock out button
			$.clockOut.addEventListener('click', startPunch); // (Ti.App.Properties.getString('QAFLAG') === '1') ? alterCurrentTime : clockInOut.action);
			
			$.clockOut.addEventListener('touchstart', changeColorOUT);
			$.clockOut.addEventListener('touchend', changeColorOUT);
			// --------------------------------------------------------------------------------

			// footer employee options listener
			$.footer.employeeOptions.addEventListener('click', employeeOptions_click);
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'clockInOut', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function destroy(){

			// now let's remove our event listeners
			$.clockInOut.removeEventListener('open', Alloy.Collections.deviceHelp.audioPlayer.play);
			$.clockInOut.removeEventListener('close', destroy); // destroy the controller and view
			$.clockInOut.removeEventListener('touchstart', restartTimeout);
			// --------------------------------------------------------------------------------
			$.notMe.removeEventListener('click', notMeClick);	// not me button in the sidebar
			$.notMe.removeEventListener('touchstart', changeColor);
			$.notMe.removeEventListener('touchend', changeColor);
			// --------------------------------------------------------------------------------
			$.clockIn.removeEventListener('doubletap', emptyFn); // clock in button
			$.clockIn.removeEventListener('click', (Ti.App.Properties.getString('QAFLAG') === '1') ? alterCurrentTime : clockInOut.action);
			
			$.clockIn.removeEventListener('touchstart', changeColorIN);
			$.clockIn.removeEventListener('touchend', changeColorIN);
			// --------------------------------------------------------------------------------
			$.clockOut.removeEventListener('doubletap', emptyFn); // clock out button
			$.clockOut.removeEventListener('click', (Ti.App.Properties.getString('QAFLAG') === '1') ? alterCurrentTime : clockInOut.action);
			
			$.clockOut.removeEventListener('touchstart', changeColorOUT);
			$.clockOut.removeEventListener('touchend', changeColorOUT);
			// --------------------------------------------------------------------------------

			$.destroy();

			$.clockInOut.removeAllChildren();

			//dispatcher = null;

			leavingFortheDayDialog = null;

			softScheduling = null;
			
			$.sessionObj = null;
			
			$ = null;
		}

		// for QA testing of soft scheduling
		function alterCurrentTime(_e){

			$.alteredTime = {
				secondsSince111970: 0,
				convertedUnix: ''
			};
			
			var changeActualTimeDialog = {};

			if(OS_ANDROID){
				var dateTimetextField =  Ti.UI.createTextField({
					backgroundColor: '#fff',
					keyboardType: Ti.UI.KEYBOARD_NAMEPHONE_PAD,
					color: "#333"
				});
				dateTimetextField.addEventListener('change', function(){ restartTimeout(); });

				changeActualTimeDialog = Ti.UI.createAlertDialog({
					title: 'ENTER THE ACTUAL TIME, FORMAT: YYYY-MM-DD HH:MM:SS',
					androidView: dateTimetextField,
					buttonNames: ['OK']
				});
			}
			else
			{
				changeActualTimeDialog = Ti.UI.createAlertDialog({
					title: 'ENTER THE ACTUAL TIME, FORMAT: YYYY-MM-DD HH:MM:SS',
					style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
					buttonNames: ['OK']
				});
			}
			
			changeActualTimeDialog.addEventListener('click', function(e){
				var date = '';
				var time = '';
				var match;

				if(OS_ANDROID){
					match = dateTimetextField.value.match(/\d+[\-:]*/g); // ReGex to match the desired format :)

					if(match && match.length === 6){
						date = dateTimetextField.value.slice(0, 10);
						time = dateTimetextField.value.slice(11, 16);
					}else{
						alert('Please enter a value in the textbox.');
						return false;
					}

				}else{
					match = e.text.match(/\d+[\-:]*/g);

					if(match && match.length === 6){
						date = e.text.slice(0, 10);
						time = e.text.slice(11, 19);
					}else{
						alert('Please enter a valid value in the textbox.');
						return false;
					}

					// ONLY FOR IOS CAUSE WE CAN NOT BIND A CHANGE EVENT TO THE TEXTBOX IN THE ALERT POP UP
					CloudClock.clock.showEmployeeFlowDialog = false;
				}

				// changing the calculation here a bit
				// going to take the current time and than replace values for date and time with the text box entry
				// seems like the whole timezone stuff and seasonal time change is messing up the calculations

				var now = CloudClock.clock.getCurrentTime();
				console.log(now);


				var timeZone = now.convertedUnix.slice(19,25);

				$.alteredTime.convertedUnix = date+"T"+time+timeZone;
				//console.log($.alteredTime.convertedUnix);

				$.alteredTime.secondsSince111970 = Math.round((new Date($.alteredTime.convertedUnix)).getTime() / 1000);
				//console.log($.alteredTime.secondsSince111970);

				clockInOut.action(_e); // this is the button _e not the alert e !!!!!
			});

			changeActualTimeDialog.show();

			if(OS_IOS){
				restartTimeout();
				CloudClock.clock.showEmployeeFlowDialog = false;
			}
		}

		// add punch restrictio logic to the CloudClock
		CloudClock.punchRestrictions = require('punchRestrictions');
		var softScheduling = require('softScheduling');
		// local session object
		var sessionObj = CloudClock.sessionObj;

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1200';
		
		populateSession();

		CloudClock.dispatcher.emplFlowInit();

		updateUIclock();

		updateUI();

		addListeners();

		clockInOut.init();

		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;

		// open the window
		$.clockInOut.open();

		// restart screen timeout
		restartTimeout();
	}
	catch(error){
		CloudClock.error(error);
	}
})();





