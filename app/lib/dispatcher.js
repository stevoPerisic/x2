//----------	THIS RIGHT HERE IS JUST FREAKIN' AWESOME! --------------------
//	a little router through the application, it's just awesome, I think
//
//DISPATCHER FUNCTION TO TAKE US THROUGH THE VIEWS BASED ON ALL THE SETTINGS :)
//extraParams will hold any other UI items we need to manipulate
var previousView = '';

exports.route = function (global, container, viewToOpen, viewToClose, data, extraParams){
	//console.log('VIEW TO OPEN: ' + viewToOpen + ' VIEW TO CLOSE: ' + viewToClose + ', data: ' + JSON.stringify(data));
	console.log(global);
	
	try{
		// have a view to close? destroy and garbage collect the controller check if it exists first
		if(viewToClose && CloudClock[global][container][previousView] !== undefined){

			CloudClock[global][container].removeAllChildren();

			CloudClock[global][container][previousView].destroy();

			// deallocate memory
			//CloudClock.deallocate(CloudClock[global][container]);

			CloudClock[global][container][previousView] = null;
		}

		CloudClock[global][container][viewToOpen] = Alloy.createController(viewToOpen, {data: data, extraParams: extraParams});

		CloudClock[global][container].add(CloudClock[global][container][viewToOpen].getView());

		previousView = viewToOpen;
	}catch(error){
		CloudClock.error(error);
	}
};


// this should check the parameters and decide which window is next based on those
// it should also close the previous window 
// _params should contain the previous window context

// properties of context that are useful
// 1) __controllerPath
var softScheduling = require('softScheduling');

var employeeFlow = {
	checkPhoto: function(_context){
		console.log('Checking photo...');
		var CAPTUREPHOTO = Ti.App.Properties.getString('CAPTUREPHOTO');
		console.log('Checking photo...'+CAPTUREPHOTO);
		if(CAPTUREPHOTO === '1'){
			CloudClock.sessionObj.nextWindow = 'employeeFlow_cameraView';
			
			return false;
		}else{
			console.log('Keep checking down the line!');
			return true;
		}
	},
	checkDepartments: function(_context){
		console.log('Checking depts...');
		var OPENDEPT = Ti.App.Properties.getString('OPENDEPT');
		var employee = CloudClock.sessionObj.employee;
		var employeeDepartments = CloudClock.sessionObj.employeeDepartments;

		console.log('Checking Open depts...'+OPENDEPT);

		// console.log(JSON.stringify(employeeDepartments));
		if(OPENDEPT === '1' || employee.get('allowOpenDept') === '1' || employee.get('allowOpenDept') === 1 || employeeDepartments.length > 0){

			CloudClock.sessionObj.nextWindow = 'employeeFlow_departmentSelection';
			
			return false;
		}else{
			console.log('Keep checking down the line!');
			return true;
		}
	},
	checkSoftScheduling: function(_context){
		console.log('Checking Soft scheduling...');
		var SOFTSCHEDULING = Ti.App.Properties.getString('SOFTSCHEDULING');
		if(SOFTSCHEDULING === '1'){
			if(CloudClock.sessionObj.currentPunch.transType === "I"){
				if(softScheduling.inPunch(_context)){
					console.log('Break out!');
					return false;
				}else{
					console.log('Keep checking down the line!');
					return true;
				}
			}else{
				if(softScheduling.outPunch(_context)){
					console.log('Break out!');
					return false;
				}else{
					console.log('Keep checking down the line!');
					return true;
				}
			}
		}else{
			return true;
		}
	},
	checkShortLunch: function(_context){
		console.log('Checking Short lunch...');
		var SHORTLUNCH = Ti.App.Properties.getString('SHORTLUNCH');
		if(SHORTLUNCH !== 0){
			if(softScheduling.shortLunch(_context)){
				console.log('Break out!');
				return false;
			}else{
				console.log('Keep checking down the line!');
				return true;
			}
		}else{
			return true;
		}
	},
	checkConfirmation: function(_context){
		console.log('Checking Confirmation...');
		var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');
		var SOFTSCHEDULING = Ti.App.Properties.getString('SOFTSCHEDULING');

		if(CONFIRMATION === '1' && SOFTSCHEDULING === '0'){
			CloudClock.sessionObj.nextWindow = 'employeeFlow_clockInConfirmation';
			console.log('Go to confirmation!');
			return false;

		}else if(CONFIRMATION === '1' && SOFTSCHEDULING !== '0'){
			if(softScheduling.immediatePunch(_context)){
				CloudClock.sessionObj.nextWindow = 'employeeFlow_missedBreak';
				console.log('Go to missed break!');
			}else{
				CloudClock.sessionObj.nextWindow = 'employeeFlow_hoursVerification';
				console.log('Go to hours verif/SS confirmation!');
			}

			return false;

		}else if(CONFIRMATION === '0' && SOFTSCHEDULING !== '0'){
			if(softScheduling.immediatePunch(_context)){
				CloudClock.sessionObj.nextWindow = 'employeeFlow_missedBreak';
				console.log('Go to missed break!');
			}else{
				CloudClock.sessionObj.nextWindow = 'index';
				CloudClock.flashConfirmation = true;
				console.log('Go to back to index, flash confirmation!');
			}
			return false;
		}else{
			CloudClock.sessionObj.saveTransaction();
			CloudClock.sessionObj.clearSession();
			CloudClock.clock.showEmployeeFlowDialog = false;
			// Alloy.createController('index', {doNotSetParams: true});

			CloudClock.sessionObj.nextWindow = "index";
			console.log('Go to back to index!');
			return true;
		}
	},
	init: function(){
		employeeFlow.I_order = {
			0: employeeFlow.checkPhoto,
			1: employeeFlow.checkDepartments,
			2: employeeFlow.checkSoftScheduling,
			3: employeeFlow.checkShortLunch,
			// if ss immediate punch
			4: employeeFlow.checkConfirmation
		};
		employeeFlow.O_order = {
			0: employeeFlow.checkPhoto,
			1: employeeFlow.checkSoftScheduling,
			// if ss immediate punch
			2: employeeFlow.checkConfirmation
		};
	},
	action: function(e){
		try{
			// runs every function in the order provided, if a fn returns false breaks the loop
			_.every(employeeFlow[e.direction+'_order'], function(doThis, i){
				console.log(i);
				delete employeeFlow[e.direction+'_order'][i]; // delete the param that represents the previous screen check
				return doThis(e.context) === true;
			});
		}catch(error){
			CloudClock.error(error);
		}
	}
};

exports.emplFlowInit = employeeFlow.init;
exports.stopFlow = false;


exports.nextWindow = function(_params){

	try{
		var currentContext = {};

		if(CloudClock.sessionObj.nextWindow.length === 0 || _.isUndefined(CloudClock.sessionObj.nextWindow)){
			employeeFlow.action({
				direction: CloudClock.sessionObj.currentPunch.transType,
				context: _params.context
			});
		}

		console.log('Next Window: '+CloudClock.sessionObj.nextWindow);
		// CloudClock.log('Info', 'Next window to create: '+CloudClock.sessionObj.nextWindow);

		if(!CloudClock.dispatcher.stopFlow && CloudClock.sessionObj.nextWindow.length !== 0){
			// createContext();
			CloudClock.log('Info', 'Creating next window: '+CloudClock.sessionObj.nextWindow);
			currentContext = Alloy.createController(CloudClock.sessionObj.nextWindow);

			// pass the context to the screenTimeout 
			CloudClock.screenTimeout._context = currentContext;
			// trigger open
			currentContext.getView().open();

			CloudClock.sessionObj.nextWindow = "";
			_params.context.getView().close();
			return false;
		}

	}catch(error){
		CloudClock.error(error);
	}
};
























