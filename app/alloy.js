// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `CloudClock`
// object. For example:
//
// CloudClock.someGlobalFunction = function(){};

// Declare the Cloud clock namespace
var CloudClock = CloudClock || {};

(function(){
	try{
		// Now let's cache some helpful objects

		// 1) This is the persisitent context of the app on the server
		CloudClock.serverContext = {
			'ver': Ti.App.version,
			'hid': Ti.Platform.osname,
			'mac': Ti.Platform.macaddress,
			'pw': 'test',
			'api': '2.0'
		};
		// 2) All the API method calls
		CloudClock.pplNetApi = require('pplNetApi_routes');
		// 3) The communication plugin, patches together the server calls, URLs, stringifies the payloads
		CloudClock.api = require('api');
		// 4) TIME ! :)
		CloudClock.moment = require('alloy/moment'); // moment.js lib
		CloudClock.clock = require('clock'); // Clocud Clock time keeper
		// 5) Language
		CloudClock.customL = require('L_strings');
		// 6) Cloud clock navigation 
		CloudClock.dispatcher = require('dispatcher');
		CloudClock.sideMenu = require('sideMenu');
		// 7) Screen timeouts
		CloudClock.screenTimeout = require('screenTimeouts');
		// 8) Custom alertBox
		CloudClock.customAlert = require('customAlertBox');
		// 9) Save to CSV module
		CloudClock.csv = require('exportCSVData');
		// 10)
		// outbound call in progress
		CloudClock.APIcallInProgress = false;
		// 11)
		// Flag for DB upgrade so we can go fetch new data from the host
		CloudClock.migratedUp = false;
		// 12)
		// Flag for the audio help
		CloudClock.playHelp = false;
		// 13)
		// Flag for the screensaver
		CloudClock.screensaverON = false;


		// Now add some commonly used functions
		// 1) Log anything to the logging table
		CloudClock.log = function(severity, message){
			var time = CloudClock.clock.getCurrentTime();

			// below gets miliseconds so we can better sort
			var now = new Date();
			now = now.getTime();
			
			var log = Alloy.createModel('logging', {
				severity: severity,
				message: message,
				// time: time.secondsSince111970,
				time: now,
				readableTime: moment(time.convertedUnix).format('M/D h:mm:ss a')
			});

			console.log(JSON.stringify(log));
			
			log.save();
		};
		// 2) Capture errors cross-platform
		CloudClock.error = function(_error){
			// some depth to this error object:
			//
			// on iOS we will have these properties within the error object itself:
			// 1) backtrace
			// 2) line -> this will be the line of code in the actual compiled file found in the resources folder and not this one
			// 3) message
			// 4) name
			// 5) sourceId -> not sure what tis is, however it is a long integer
			// 6) sourceURL
			// 
			// console.log(error);
			//
			// on Android we do not get any of those properties, which sucks
			// so this is what we are going to do for android, so after this the newly created error object has some props to look at :)
			// after doing this we have these properties in the newError:
			// 1) arguments
			// 2) message
			// 3) stack
			// 4) type
			var newError = {};
			var members;
			var logString = '';

			if(_.isObject(_error)){
				members = Object.getOwnPropertyNames(_error);

				for(var i=0;i<members.length;i++){
					newError[members[i]] = _error[members[i]];
					logString = logString+members[i]+': '+_error[members[i]]+'\n';
				}

				console.log('Error: '+newError.message);
				CloudClock.log('Error', 'Message: '+newError.message);
				CloudClock.log('Error', 'Full stack: '+logString);
			}else{
				CloudClock.log('Error', 'Message: '+_error);
			}

			newError = null;
			members = null;
		};
		// 3) Get the locally stored photos cross-platform
		CloudClock.getLocalPhoto = function(_el, localPhotoFileName){

			console.log('\n\n\nGetting local photo...');

			//var employeePhoto;
			var f = null;
			var masterPicture = null;

			try{
				//get file url
				//employeePhoto = employee.get('photoFileName');
				f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localPhotoFileName);
				f = f.read();

				if(!_.isObject(f)){
					localPhotoFileName = (OS_IOS) ? "MasterPhoto/"+CloudClock.sessionObj.employee.get('badge')+'.jpg' :"MasterPhoto/"+CloudClock.sessionObj.employee.get('badge');
					f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localPhotoFileName);
					f = f.read();
				}

			}catch(error){
				CloudClock.error(error);
			}

			if(OS_ANDROID){
				_el.setImage(Ti.Utils.base64decode(f));
				f = null;
				_el = null;
			}else{
				try{
					masterPicture = Ti.Utils.base64decode(f);
					f = null;
				}catch(error){
					CloudClock.error(error);
				}

				// image file might be malformatted or not a blob
				if(masterPicture !== undefined){
					try{
						_el.setImage(masterPicture);
						masterPicture = null;
						_el = null;
					}catch(error){
						CloudClock.error(error);
					}
				}else{
					_el.setImage('/images/icons/no-photo-256-gray.png');
				}
			}

			console.log('\n\n\nDONE - getting local photo...' + ' _el: '+JSON.stringify(_el)+' masterPicture: '+masterPicture+' f: '+f);
		};
		// 4) Fetching local data and parameters
		CloudClock.dbSeeded = {
			fetchParams: function(fetchLogo){
				Alloy.Collections.parameters.fetch({
					success: function(){

						// Problem here bcs server does not return the correct URL back
						CloudClock.pplNetApi.base = Ti.App.Properties.getString('PNET');
						console.log('Changed the API base to: '+Ti.App.Properties.getString('PNET'));
						
						Ti.App.Properties.setString('CURRLANGUAGETYPE', Ti.App.Properties.getString('LANGUAGETYPE'));

						//Set screen timeout values
						CloudClock.screenTimeout.homeScreenTimeout = parseInt(Ti.App.Properties.getString('SCREENSAVER'), 10) * 60000;
						CloudClock.screenTimeout.employeeFlow = parseInt(Ti.App.Properties.getString('PAGETIMEOUTSHORT'), 10) * 1000;
						CloudClock.screenTimeout.employeeOptions = parseInt(Ti.App.Properties.getString('PAGETIMEOUTMED'), 10) * 1000;
						CloudClock.screenTimeout.managerOptions = parseInt(Ti.App.Properties.getString('PAGETIMEOUTLONG'), 10) * 1000;

						//get logo
						if(fetchLogo){
							CloudClock.getLogo_cfg.params.termID = Ti.App.Properties.getString('TERMID');
							CloudClock.getLogo_cfg.params.logoImage = Ti.App.Properties.getString('LOGOIMAGENAME').replace('\\logo\\', '');
							CloudClock.api.request(CloudClock.getLogo_cfg);
						}

						//Show main menu
						try{
							if(CloudClock.parent){
								CloudClock.parent.mainMenu.setVisible(true);
								CloudClock.parent.pinPad.getPinSettings();
							}
						}catch(error){
							CloudClock.error(error);
						}

						//Print out App properties to the console
						// var props = Ti.App.Properties.listProperties();
						// for (var i=0, ilen=props.length; i<ilen; i++){
						// 	var value = Ti.App.Properties.getString(props[i]);
						// 	Ti.API.info(props[i] + ' = ' + value);
						// }
					},
					error: function(collection, response, options){
						CloudClock.log('Error', JSON.stringify(response));
					}
				});
			},
			fetchLocalData: function(){
				try{
					Alloy.Collections.employees.fetch({
						success: function(){
							console.log('Employees successfuly retrieved from local DB.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.employeeDepartments.fetch({
						success: function(){
							console.log('Employee Departments fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.departments.fetch({
						success: function(){
							console.log('Departments fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					// this could be done in the soft scheduling module maybe?
					Alloy.Collections.deptShifts.fetch({
						success: function(){
							console.log('Department shifts fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.clockHistory.fetch({
						success: function(){
							console.log('Clock History fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.transactions.fetch({
						success: function(){
							console.log('Transactions fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.deviceHelp.fetch({
						success: function(){
							console.log('Employees successfuly retrieved from local DB.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
				}catch(error){
					CloudClock.error(error);
				}

				// set the index screen saver to enabled again
				CloudClock.clock.showScreenSaver = true;
			}
		};

		CloudClock.getAppParameters = function (){  // TODO: expand to other paramters and convert to exports to consolidate
			var isEmail = Ti.App.Properties.getString('ALLOWEMAIL');
			var isText  = Ti.App.Properties.getString('ALLOWTEXT');
			var isPrint = Ti.App.Properties.getString('ALLOWPRINT');
			var isView  = Ti.App.Properties.getString('ALLOWVIEW');
			var parmObj = {
				"isEmailAllowed" : ((isEmail && isEmail !=='0') ? true : false),
				"isTextAllowed"  : ((isText && isText !=='0') ? true : false),
				"isPrintAllowed" : ((isPrint && isPrint !=='0') ? true : false),
				"isViewAllowed"  : ((isView && isView !=='0') ? true : false),
			};
			console.log('getAppParameters() returning: ' + JSON.stringify(parmObj));
			return parmObj;
		};

		// lets make a global state object to house all the properties of the current employee session
		// params: 
		// 1) employee
		// 2) last clock in
		// 3) last clock out
		// 4) last transaction overall with the clock
		// 5) current punch
		//		5a) idType: ($.sessionObj.employee.get('badge')) ? 'U' : 'P',
		//		5b) employeeBadge: ($.sessionObj.employee.get('badge') !== 0) ? $.sessionObj.employee.get('badge') : $.sessionObj.employee.get('pin'),
		//		5c) transType: (_direction === 'clockIn') ? 'I' : 'O',
		//		5d) departmentNum: returnDeptNum(_direction),
		//		5e) transTime: _moment.secondsSince111970,
		//		5f) transDateTime: _moment.convertedUnix,
		//		5g) initials: ($.sessionObj.employee.get('badge') !== 0) ? false : employeeName,
		//		5h) shiftID: 0,
		//		5i) overrideFlag: 0
		//
		CloudClock.sessionObj = {
			currentPunch: {},
			employee: {},
			employeeDepartments: [],
			last_inPunch: {},
			last_outPunch: {},
			difference: 0,
			latestTransaction: {},
			previousClockIns: {},
			previousClockOuts: {},
			nextWindow: '',
			punchException: 0,
			shift: {},
			showActual: 0,
			restrictionDialog: 0,
			punchStarted: 0,
			saveTransaction: function(){
				try{
					var that = this;

					that.currentPunch.sent = 0;

					CloudClock.log('Info', 'Creating punch transaction for '+ that.employee.get('name')+ ', '+ JSON.stringify(_.omit(that.currentPunch, 'photoData')));

					var newTransactionModel = Alloy.createModel('transactions', that.currentPunch);

					that.currentPunch.employee_alloyID = that.employee.get('alloy_id');

					var newClockHistoryModel = Alloy.createModel('clockHistory', that.currentPunch);

					// save transaction
					newTransactionModel.save(null, {
						success: function(model, response, options){
							CloudClock.log('Info', 'Transaction saved for '+ CloudClock.sessionObj.employee.get('name')+'\n'+JSON.stringify(_.omit(newTransactionModel.attributes, 'photoData')));
						},
						error: function(model, response){
							CloudClock.log("Error", "Transaction Model: "+JSON.stringify(_.omit(newTransactionModel.attributes, 'photoData')));
						}
					});
					//save to CSV text file
					var forCSV = [{
						idType : newTransactionModel.attributes.idType,
						employeeBadge : newTransactionModel.attributes.employeeBadge,
						transType : newTransactionModel.attributes.transType,
						departmentNum : (newTransactionModel.attributes.transType === 'I') ? newTransactionModel.attributes.departmentNum : 0,
						transTime : newTransactionModel.attributes.transTime,
						transDateTime : newTransactionModel.attributes.transDateTime,
						shiftID : newTransactionModel.attributes.shiftID,
						overrideFlag : newTransactionModel.attributes.overrideFlag,
						exceptions: [{
							reasonCodeID: newTransactionModel.attributes.reasonCodeID,
							reasonCodeType: newTransactionModel.attributes.reasonCodeType,
							amount: newTransactionModel.attributes.amount
						}],
						initials: newTransactionModel.attributes.initials
					}];
					CloudClock.csv.exportCsvData(forCSV, 'transactions.csv');
					// save transaction to history
					newClockHistoryModel.save(null, {
						success: function(model, response, options){
							CloudClock.log('Info', 'Clock history entry saved for '+ CloudClock.sessionObj.employee.get('name')+'\n'+JSON.stringify(_.omit(newTransactionModel.attributes, 'photoData')));
						},
						error: function(model, response){
							CloudClock.log("Error", "Clock history entry Model: "+JSON.stringify(_.omit(newTransactionModel.attributes, 'photoData')));
						}
					});
					Alloy.Collections.clockHistory.fetch({
						add: true, // only add the new items to the collection instaed of replacing all of it
						success: function(){
							console.log('Clock History fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
					Alloy.Collections.transactions.fetch({
						add: true,
						success: function(){
							console.log('Transactions fetched.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
				}
				catch(error){
					CloudClock.error(error);
				}
			},
			clearSession: function(){
				var that = this;
				try{

					if(!_.isEmpty(that.employee)){CloudClock.log('Info', 'Session for: '+that.employee.get('name')+' cleared.');}

					that.currentPunch = {};
					that.employee = {};
					that.employeeDepartments = [];
					that.last_inPunch = {};
					that.last_outPunch = {};
					that.difference = 0;
					that.latestTransaction = {};
					that.nextWindow = '';
					that.previousClockIns = {};
					that.previousClockOuts = {};
					that.punchException = 0;
					that.shift = {};
					that.showActual = 0;
					this.restrictionDialog = 0;
					this.punchStarted = 0;
				}catch(error){
					CloudClock.error(error);
				}
			}
		};

		// Time to initialize our app, mind you this all happens during the splash screen
		// 1) Start the internal clock
		CloudClock.clock.init();
		// 2) Session timeout notification
		// CloudClock.screenTimeout.timeoutNotification.create();
		// Instantiate collections on app start
		Alloy.Collections.instance('logging');
		Alloy.Collections.instance('transactions');
		Alloy.Collections.instance('clockHistory');
		Alloy.Collections.instance('parameters');
		Alloy.Collections.instance('deptShifts');
		Alloy.Collections.instance('reasonCodes');
		Alloy.Collections.instance('departments');
		Alloy.Collections.instance('employeeDepartments');
		Alloy.Collections.instance('employees');
		Alloy.Collections.instance('deviceHelp');
		Alloy.Collections.instance('extraFields');
		Alloy.Collections.instance('messages');
		Alloy.Collections.instance('extraFieldsParms');

		CloudClock.log('Info', 'Hello, Cloud Clock is starting up...');

		// Check if we are online
		Ti.API.info("Is the device online: " + Ti.Network.online);

		if(Ti.Network.online === false){
			// alert('No network available.');
			CloudClock.log('Error', 'This device is not connected to a network!');
		}

		// To monitor the network status, still need to add any functionality here bcs these events are firing and there are no catchers
		Ti.Network.addEventListener('change', function(e){
			if(e.online === false){
				//Ti.App.fireEvent('offline_mode');
				CloudClock.log('Error', 'Network connection lost: ' + JSON.stringify(e));

				if(CloudClock.parent){
					CloudClock.parent.noNetwork.setText(CloudClock.customL.strings('limitedFunctionality'));
					CloudClock.parent.noNetwork.show();
				}
			}else{
				//Ti.App.fireEvent('online_mode');
				CloudClock.log('Info', 'Network regained: ' + JSON.stringify(e));

				if(CloudClock.parent){
					CloudClock.parent.noNetwork.hide();
				}
			}
		});

		// This is used during development process bcs the app gets re-built a lot
		// - the app is already seeded in this case
		// - this is would happen in production in case we send an update to the app, than the app has to be re-started
		if(Ti.App.Properties.hasProperty('seeded')){
			CloudClock.dbSeeded.fetchParams(false); // fetch params but not the logo
			CloudClock.dbSeeded.fetchLocalData();
		}

	}catch(error){
		CloudClock.error(error);
	}
}(CloudClock));









