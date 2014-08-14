
// SOFT SCHEDULING
//*****************************************************
var shiftInWindow = 0;
var shiftOutWindow = 0;
var outsideGraceWindow = 0;

function getProps(){
	shiftInWindow = parseInt(Ti.App.Properties.getString('SHIFTINWINDOW'), 10);
	shiftOutWindow = parseInt(Ti.App.Properties.getString('SHIFTOUTWINDOW'), 10);
	outsideGraceWindow = parseInt(Ti.App.Properties.getString('OUTSIDEGRACE'), 10);
}

exports.inPunch = function(_context){
	var sessionObj = CloudClock.sessionObj;
	var shift = {};
	var ninetyMinuteRule = 5400000; // 90 mins in miliseconds
	getProps();

	if(sessionObj.latestTransaction.transType === "O" && ninetyMinuteRule > sessionObj.difference && sessionObj.latestTransaction.shiftID){
		// find by ID
		sessionObj.shift = Alloy.Collections.deptShifts.findByID(sessionObj.latestTransaction.shiftID);
		sessionObj.currentPunch.shiftID = sessionObj.shift[0].get('deptShiftID');
	}else{
		// find with current
		sessionObj.shift = Alloy.Collections.deptShifts.findWithCurrentPunch();
	}

	shift = sessionObj.shift[0]; // in case we had more than one shift, and to get rid of the array wrapping...

	function checkForExceptions(shift){
		try{
			if(shift.get('absDiff') <= shiftInWindow){
				if(shift.get('actDiff') < 0){
					console.log('Early In'); // in the window show actual vs scheduled

					CloudClock.sessionObj.showActual = 1;
					CloudClock.sessionObj.punchException = false;

				}else if(shift.get('actDiff') > 0){
					console.log('Late In'); // late in exceptions, lateIn = 1, lateInMins

					CloudClock.sessionObj.showActual = false;

					if(shift.get('lateIn') === '1' && shift.get('absDiff') >= shift.get('lateInMins')){
						CloudClock.sessionObj.punchException = 14;
					}else{
						CloudClock.sessionObj.punchException = false;
					}
				}
			}
			else if(
				shiftInWindow < shift.get('absDiff') &&
				shift.get('absDiff') <= outsideGraceWindow
			){
				if(shift.get('actDiff') < 0){
					console.log('Very Early In'); // very early in exceptions, veryEarlyIn = 1, 

					CloudClock.sessionObj.showActual = false;

					if(shift.get('veryEarlyIn') === '1'){
						console.log('Show Very Early In exceptions');
						CloudClock.sessionObj.punchException = 1;
					}else{
						// don't do exceptions, process as actual
						CloudClock.sessionObj.punchException = false;
					}
				}else if(shift.get('actDiff') > 0){
					console.log('Very Late In'); // vary late in exceptions

					CloudClock.sessionObj.showActual = false;
					CloudClock.sessionObj.punchException = false;
					// per Dale we are no longer tracking very Late in exceptions bcs. they are not set up on the host
				}
			}
			return true;
		}catch(error){
			CloudClock.error(error);
			return false;
		}
	}

	if(checkForExceptions(shift)){

		// this to make the activity indicator look the same like the other ones on the camera page after the leaving for day comes up
		// and there is no exceptions present
		_context.activityIndicator.hide();
		_context.activityIndicator.applyProperties({
			top: '25%',
			left: '20%',
			height: '50%',
			width: '60%'
		});

		// check actual and exception flags, and the num of shifts to decide the next screen
		if(!sessionObj.showActual && !sessionObj.punchException && sessionObj.shift.length === 1){
			// sessionObj.nextWindow = '';
			sessionObj.currentPunch.shiftID = sessionObj.shift[0].get('deptShiftID');
			return false;
		}

		if(sessionObj.showActual || sessionObj.shift.length > 1){
			sessionObj.nextWindow = 'employeeFlow_actualVsScheduled';
			return true;
		}

		// if(sessionObj.punchException && ninetyMinuteRule > sessionObj.difference){
		// 	//  && sessionObj.latestTransaction.idType === "O"
		// 	console.log('Considered back from lunch punch');
		// 	// sessionObj.currentPunch.shiftID = sessionObj.latestTransaction.shiftID;
		// 	return false;
		// }

		if(sessionObj.punchException){
			sessionObj.nextWindow = 'employeeFlow_earlyOrLate';
			return true;
		}
		
	}else{
		CloudClock.log('Error', 'Soft scheduling inPunch flow error.');
		return false;
	}
};

exports.outPunch = function(_context){
	var sessionObj = CloudClock.sessionObj;
	var shift = {};
	var clockWorkSpan = parseInt(Ti.App.Properties.getString('WORKSPAN'), 10)*3600000; // work span hours (comes in hours) in milliseconds
	getProps();

	if(sessionObj.latestTransaction.transType === "I" && clockWorkSpan > sessionObj.difference && sessionObj.latestTransaction.shiftID){
		// find by ID
		sessionObj.shift = Alloy.Collections.deptShifts.findByID(sessionObj.latestTransaction.shiftID);
		sessionObj.currentPunch.shiftID = sessionObj.shift[0].get('deptShiftID');
	}else{
		// find with current
		sessionObj.shift = Alloy.Collections.deptShifts.findWithCurrentPunch();
	}

	shift = sessionObj.shift[0]; // in case we had more than one shift


	function checkForExceptions(shift){
		try{
			if(shift.get('absDiff') <= shiftOutWindow){
				if(shift.get('actDiff') < 0){
					console.log('Early Out'); // check early out flag - earlyOut = 1, earlyOutMins

					if(shift.get('earlyOut') === '1' && shift.get('absDiff') >= shift.get('earlyOutMins')){
						// show early out exceptions
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = 15;
					}else{
						// take actual no exceptions
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = false;
					}
				}else if(shift.get('actDiff') > 0){
					console.log('Late Out'); // show actual vs Scheduled
					CloudClock.sessionObj.showActual = 1;
					CloudClock.sessionObj.punchException = false;
				}
			}// else if(shiftOutWindow < shift.get('absDiff') < outsideGraceWindow){
			else if(
				shiftOutWindow < shift.get('absDiff') &&
				shift.get('absDiff') <= outsideGraceWindow
			){
				if(shift.get('actDiff') < 0){
					console.log('Very Early Out'); // check very early out flag = varyEarlyOout = 1,

					if(shift.get('earlyOut') === '1'){
						// show very early out exceptions
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = 15;
					}else{
						// take actual
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = false;
					}
				}else if(shift.get('actDiff') > 0){
					console.log('Very Late Out'); // check veryLateOut = 1

					if(shift.get('veryLateOut') === '1'){
						// show very Late out exceptions
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = 16;
					}else{
						// take actual
						CloudClock.sessionObj.showActual = false;
						CloudClock.sessionObj.punchException = false;
					}
				}
			}
			return true;
		}catch(error){
			CloudClock.error(error);
			return false;
		}
	}

	function lateOutEarlyOut(){
		if(sessionObj.showActual || sessionObj.shift.length > 1){
			sessionObj.nextWindow = 'employeeFlow_actualVsScheduled';
			return true;
		}

		if(sessionObj.punchException){
			sessionObj.nextWindow = 'employeeFlow_earlyOrLate';
			return true;
		}
	}

	if(checkForExceptions(shift)){
		// this for LUNCH out punch
		var workSpan1 = parseInt((sessionObj.shift[0].get('workSpan1')), 10);
		var workSpan2 = parseInt((sessionObj.shift[0].get('workSpan2')), 10);

		if(sessionObj.latestTransaction.transType === "I" && sessionObj.shift.length === 1 && workSpan1 >= sessionObj.shift[0].attributes.absDiff || workSpan2 >= sessionObj.shift[0].attributes.absDiff){
			
			// this to make the activity indicator look the same like the other ones on the camera page after the leaving for day comes up
			// and there is no exceptions present
			_context.activityIndicator.hide();
			_context.activityIndicator.applyProperties({
				top: '25%',
				left: '25%',
				height: '50%',
				width: '50%'
			});

			_context.areYouLeavingForDay = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('no'), CloudClock.customL.strings('yes')],
				title: CloudClock.customL.strings('alert'),
				message: CloudClock.customL.strings('leavingForDay'),
				callback:{
					eType: 'click',
					action: function(_e){
						if(_e.source.id === this.cancel){
							sessionObj.currentPunch.shiftID = shift.get('deptShiftID');
							sessionObj.nextWindow = "";
						}else{
							lateOutEarlyOut();
						}
						_context.areYouLeavingForDay.hide.apply(_context);

						CloudClock.dispatcher.stopFlow = false;
						CloudClock.dispatcher.nextWindow({
							context: _context
						});
					}
				},
				stayOpen: true
			});
			_context.areYouLeavingForDay.show.apply(_context);
			CloudClock.dispatcher.stopFlow = true;

			return true;
		}else if(lateOutEarlyOut()){
			return true;
		}else{
			return false;
		}
	}else{
		CloudClock.log('Error', 'Soft scheduling outPunch flow error.');
		return false;
	}
};

exports.shortLunch = function(_context){
	var sessionObj = CloudClock.sessionObj;
	var restrictionINOUT = parseInt(Ti.App.Properties.getString('OUTINPUNCHRESTRICT'), 10) * 60000; // OUTINPUNCHRESTRICT (comes in minutes) in milliseconds
	var shortLunch = Ti.App.Properties.getString('SHORTLUNCH');
	var ninetyMinuteRule = 5400000; // 90 mins in miliseconds
	getProps();
	
	_context.clokingInEarlyFromBreak = CloudClock.customAlert.create({
		type: 'alert',
		cancel: 0,
		buttonNames: [CloudClock.customL.strings('no'), CloudClock.customL.strings('yes')],
		title: CloudClock.customL.strings('alert'),
		message: CloudClock.customL.strings('earlyFromBreak'),
		callback:{
			eType: 'click',
			action: function(_e){
				if(_e.source.id === this.cancel){
					sessionObj.nextWindow = 'index';
					CloudClock.clock.showEmployeeFlowDialog = false;
					return false;
				}else{
					CloudClock.sessionObj.currentPunch.shiftID = CloudClock.sessionObj.shift[0].get('deptShiftID');
					return true;
				}

				CloudClock.dispatcher.stopFlow = false;
				CloudClock.dispatcher.nextWindow({
					context: _context
				});
				_context.clokingInEarlyFromBreak.hide.apply(_context);
			}
		}
	});

	if(sessionObj.latestTransaction.transType === 0 || sessionObj.latestTransaction.transType === "I"){
		return false;
	}else{
		if(sessionObj.difference < restrictionINOUT && // the diff between current punch and the last transaction is less or equal to the INOUT restriction
			shortLunch === '1' // short lunch param is 1
		){
			sessionObj.nextWindow = '';
			sessionObj.punchException = 0;
			_context.clokingInEarlyFromBreak.show.apply(_context);
			CloudClock.dispatcher.stopFlow = true;

			return true;
		}else if(
			sessionObj.difference < restrictionINOUT && // the diff between current punch and the last transaction is less or equal to the INOUT restriction
			shortLunch === '2' // short lunch param is 2
		){
			sessionObj.nextWindow = 'employeeFlow_earlyOrLate';
			sessionObj.punchException = 12;
			_context.clokingInEarlyFromBreak.show.apply(_context);
			CloudClock.dispatcher.stopFlow = true;

			return true;

		}else if(ninetyMinuteRule > sessionObj.difference){
			// softScheduling.immediatePunch($);
			// sessionObj.nextWindow = "";
			// CloudClock.dispatcher.nextWindow({
			// 	context: _context
			// });
			return false;
		}else{
			return false;
		}
	}
};

//
// We are not calculating the break on the device anymore
// instead send immediate punch right away no matter what
// if the response from this call is an empty object aor it has data go to hours verification
// and poost that server call
//
// in case we have no network:
// save the transaction, and pop up a dialog that notifies them that the
// transaction has been saved (punch IN/OUT) + device is off line and exceptions can not be processed
// than go to the next screen my the parameters, or back to index if none left
//

function immediatePunchHandler(_params){
	try{
		var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');
		CloudClock.dispatcher.stopFlow = false;
		_params.context.activityIndicator.hide();

		if(_params.error){
			CloudClock.flashConfirmation = 'error';

			CloudClock.log('Error', 'Error in missed break API call: '+JSON.stringify(_params.response));
			CloudClock.sessionObj.missedBreakData = false;
			
			CloudClock.sessionObj.nextWindow = (CONFIRMATION === '0') ? 'index' : 'employeeFlow_hoursVerification';
			
		}else{
			CloudClock.flashConfirmation = true;

			CloudClock.sessionObj.missedBreakData = (!_.has(_params.response, 'exceptionScreens')) ? false : _params.response;
			CloudClock.sessionObj.nextWindow = (!_.has(_params.response, 'exceptionScreens')) ? (CONFIRMATION === '0') ? 'index' : 'employeeFlow_hoursVerification' : 'employeeFlow_missedBreak';

			// find the appropriate transaction by time and badge number and mark it as sent
			var sentTransaction = Alloy.Collections.transactions.where({
				employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,
				transTime: CloudClock.sessionObj.currentPunch.transTime
			});

			if(sentTransaction){
				sentTransaction[0].save({sent: 1}, {
					success: function(model, response, options){
						CloudClock.log('Info', 'Transaction saved as sent after immediate punch for '+ model.get('name')+'\n'+JSON.stringify(_.omit(model.attributes, 'photoData')));
					},
					error: function(model, response){
						CloudClock.log("Error", "Transaction Model: "+JSON.stringify(response));
					}
				});
			}
		}

		CloudClock.dispatcher.nextWindow({
			context: _params.context
		});

	}catch(error){
		CloudClock.error(error);
	}
}

exports.immediatePunch = function(_context){
	var immediatePunch_cfg = {
		endpoint: 'missedBreak',
		params: {
			'termID': Ti.App.Properties.getString('TERMID'),
			'badge': CloudClock.sessionObj.employee.get('badge'),
			'weekId': 0,//week,
			'screenId': 0
		},
		payload:{
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
				exceptions: [{
					reasonCodeID : CloudClock.sessionObj.currentPunch.reasonCodeID,//448485|
					reasonCodeType : CloudClock.sessionObj.currentPunch.reasonCodeType//1|
				}],
				initials: CloudClock.sessionObj.currentPunch.initials//|
			}
			// REMEMBER TO ADD PHOTO DATA!!!
		},
		onSuccess: function(response){
			console.log('recieved success response from immediate punch: '+JSON.stringify(response));

			if(_.has(response, 'status')){
				if(response.status !== 0){
					immediatePunchHandler({error: true, response: response, context: _context});
				}else{
					immediatePunchHandler({error: false, response: response, context: _context});
				}
			}else{
				if(!_.isEmpty(response.exceptionScreens)){
					immediatePunchHandler({error: false, response: response, context: _context});
				}else{
					immediatePunchHandler({error: true, response: response, context: _context});
				}
			}
		},
		onError: function(response){
			console.log('recieved error response from immediate punch: '+JSON.stringify(response));
			immediatePunchHandler({error: true, response: response, context: _context});
		}
	};

	_context.activityIndicator.setMessage(CloudClock.customL.strings('savingPunch'));
	_context.activityIndicator.show();


	// NOT USING THIS ANYMORE
	// - have to change sending photos into batch mode in case of Soft Scheduling
	// - so we can save photos to the filesystem here instead, either as a base64 encoded striung as text file or a real image
	// - whichever takes up less space
	//
	var CAPTUREPHOTO = Ti.App.Properties.getString('CAPTUREPHOTO');
	if(CAPTUREPHOTO === "1" && CloudClock.sessionObj.currentPunch.photoData){
		// console.log('\n\nAbout to save the photo locally....');
		var batchModePhotosDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'BatchModePhotos');
		if(!batchModePhotosDir.exists())
			batchModePhotosDir.createDirectory();

		// console.log('\nDirectory created...');
		var immediatePunchPic_path = CloudClock.sessionObj.currentPunch.employeeBadge +'_'+ CloudClock.sessionObj.currentPunch.photoTime + '.jpg';
		var immediatePunchPic_data = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, immediatePunchPic_path);

		if(OS_IOS){
			immediatePunchPic_data.write(CloudClock.sessionObj.currentPunch.photoData);
		}else{
			immediatePunchPic_data.write((CloudClock.sessionObj.currentPunch.photoData).toString());
		}
		// console.log('Photo data written....');

		immediatePunchPic_data.move('BatchModePhotos/' + immediatePunchPic_path);
		immediatePunchPic_data.deleteFile();

		// console.log('File saved and moved...');
	}
	

	// at this point we have to save this punch in the transactions table as well
	CloudClock.sessionObj.saveTransaction();

	if(Ti.Network.online === true){
		// STOP THE DISPATCHER FLOW UNTIL THE RESPONSE COMES BACK
		CloudClock.dispatcher.stopFlow = true;
		console.log('\n\nFlow stopped waiting for immediate punch response...');
		CloudClock.api.request(immediatePunch_cfg);
	}else{
		_context.activityIndicator.hide();
		var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');
		CloudClock.flashConfirmation = 'error';
		CloudClock.sessionObj.missedBreakData = false;
		CloudClock.sessionObj.nextWindow = (CONFIRMATION === '0') ? 'index' : 'employeeFlow_hoursVerification';
	}
};





