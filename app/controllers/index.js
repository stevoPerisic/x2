//**************************************************
//*******	INDEX CONTROLLER	****************
//**************************************************
var args = arguments[0] || {};
var initializeClock = require('initAndMaint_cfg');

//Check if the DB has been seeded
Ti.API.info('From index.js, seeded: ' + Ti.App.Properties.hasProperty('seeded'));

// ***************************************************************************

(function(){
	try{
		//private fn's
		function wrongManagerDialogClick(e){
			if(e.source.id === this.cancel){
				$.pinPad.clearPinPadTxtField();
				$.pinPad.addBtnEvents();
				clockIn_click({mode: 'enterPin'});
				$.wrongManagerPinDialog.hide.apply($);
			}
		}

		function closeIndex(e){
			$.index.removeEventListener('touchstart', CloudClock.screenTimeout.restartTimeoutIndex);
			$.clockIn.removeEventListener('click', clockIn_click);
			$.manager.removeEventListener('click', manager_click);

			$.index.hide();
			$.index.removeAllChildren();

			logoImg = null;
			wrongManagerPinDialog = null;
			initializeClock = null;

			$.destroy();

			$ = null;
			CloudClock.parent = null;
			//console.log('From index: '+JSON.stringify(CloudClock.parent));
		}

		// Check for prior db installations and get rid of the old DB 
		// CAN NOT GET RID OF THE WHOLE DB BCS OF THE sqlite_sequence TABLE CAN NOT BE DROPPED
		function oldDbRemoval(){
			//this for android:
			//	var fname=Ti.Filesystem.getFile("file://data/data/"+ Ti.App.getId()+"/databases/"+ Nameyoudatabase);

			//and this below for ios
			var oldDBFileName = privateDocumentsDirectory() +'peopleNetData.sql';
			var oldDBFile = Ti.Filesystem.getFile(oldDBFileName);
			////console.log(oldDBFile.size);
			if(oldDBFile.size !== 0){
				var oldDB = Ti.Database.open('peopleNetData');
				////console.log('Get the terminal id before removing old Db');
				var oldTermIDRow = oldDB.execute('SELECT value FROM parameters WHERE id="TERMID"');
				////console.log(oldTermIDRow.fieldCount());
				////console.log(oldTermIDRow.field(0));
				var odlTermID = oldTermIDRow.field(0);
				oldTermIDRow.close();

				//console.log('About to remove the old db');

				oldDB.execute('DROP TABLE IF EXISTS clockHistory');
				oldDB.execute('DROP TABLE IF EXISTS confirmRequests');
				oldDB.execute('DROP TABLE IF EXISTS databaseData');
				oldDB.execute('DROP TABLE IF EXISTS departments');
				oldDB.execute('DROP TABLE IF EXISTS employeeDepartments');
				oldDB.execute('DROP TABLE IF EXISTS employeeMessages');
				oldDB.execute('DROP TABLE IF EXISTS employees');
				oldDB.execute('DROP TABLE IF EXISTS extraFields');
				oldDB.execute('DROP TABLE IF EXISTS extraFieldsParms');
				oldDB.execute('DROP TABLE IF EXISTS helpInfo');
				oldDB.execute('DROP TABLE IF EXISTS logEntries');
				oldDB.execute('DROP TABLE IF EXISTS messages');
				oldDB.execute('DROP TABLE IF EXISTS parameters');
				//oldDB.execute('DROP TABLE IF EXISTS sqlite_sequence');
				oldDB.execute('DROP TABLE IF EXISTS transactionExtras');
				oldDB.close();
				oldDBFile.deleteFile();

				return odlTermID;
			}
		}

		function privateDocumentsDirectory(){
			//Ti.API.info('We need to open a file object to get our directory info');
			var testFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
			//Ti.API.info('Now we remove the Documents folder reference');
			var privateDir = testFile.nativePath.replace('Documents/','');
			//Ti.API.info('This is our base App Directory =' + privateDir);
			//Ti.API.info('Now we add the Private Documents Directory');
			privateDir+='Library/Private%20Documents/';
			//Ti.API.info('Our new path is ' + privateDir);
			return privateDir;
		}

		function updateUIclock(){
			CloudClock.UIClock = $.time; // update the UI clock
			$.time.setText(CloudClock.moment().format('h:mm a'));
			$.date.setText(CloudClock.moment().format('dddd[, ] MMMM D[,] YYYY'));
		}

		function removeActiveState(){
			$.removeClass($.clockIn, 'active');
			$.removeClass($.manager, 'active');
		}

		function manager_click(e){
			e.cancelBubble = true;

			//console.log('This will change the pinPad setting to accept manager mode.');
			CloudClock.log('Info', 'Manager menu item selected, changing pin pad to the manager mode.');

			try{
				removeActiveState();
				$.addClass($.manager, 'active');
				$.pinPad.changeMode({mode: 'manager'});
			}
			catch(error){
				CloudClock.error(error);
			}
		}

		function clockIn_click(e){
			e.cancelBubble = true;

			//console.log('This will change the pinPad setting to accept employee mode.');
			CloudClock.log('Info', 'Employee menu item selected, changing pin pad to the employee mode.');

			try{
				removeActiveState();
				$.addClass($.clockIn, 'active');
				$.pinPad.changeMode({mode: 'enterPin'});
			}
			catch(error){
				CloudClock.error(error);
			}
		}

		exports.changeToEmployeeMode = clockIn_click;

		function updateUI(){
			$.versionLbl.setText('V.'+Titanium.App.version+' Development Daily Build - B');
			$.pinPad.pinPadTxtField.setVisible(true);

			$.employeeLbl.setText(CloudClock.customL.strings('employee'));
			$.managerLbl.setText(CloudClock.customL.strings('manager'));

			$.screenSaver.hide();
			$.header.btnWrap.layout = 'absolute';
			$.header.helpButton.right = 5;
			$.header.exit.hide();

			if(Ti.Network.online === false){
				$.noNetwork.setText(CloudClock.customL.strings('limitedFunctionality'));
			}else{
				$.noNetwork.hide();
			}
		}

		function updateUI_notSeed(){
			updateUI();

			$.largeLogo.setVisible(false);
			$.mainMenu.setVisible(false);
		}

		function updateUI_seeded(){

			updateUI();

			var logoImg = (OS_IOS) ?
				Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'logo.png') :
				Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'logo');

			logoImg = logoImg.read();

			// in case we had an issue getting the logo initally
			if(_.isUndefined(logoImg)){
				$.largeLogo.setImage('images/peoplenet-default-logo.png');
			}else{
				$.largeLogo.setImage(Ti.Utils.base64decode(logoImg));
			}

			$.largeLogo.setVisible(true);
		}

		function addListeners(){
			$.index.addEventListener('touchstart', CloudClock.screenTimeout.restartTimeoutIndex);
			$.index.addEventListener('open', function(){
				var CONFIRMATION = Ti.App.Properties.getString('CONFIRMATION');
				if(CloudClock.flashConfirmation && CONFIRMATION === "0"){
					if(CloudClock.flashConfirmation === 'error'){
						// alert('Error processing punch.');

						$.immediatePunchFail = CloudClock.customAlert.create({
							type: 'alert',
							cancel: 0,
							buttonNames: [CloudClock.customL.strings('ok')],
							title: CloudClock.customL.strings('alert'),
							message: CloudClock.customL.strings('immediatePunchFail'),
							callback:{
								eType: 'click',
								action: function(_e){
									$.immediatePunchFail.hide.apply($);
									CloudClock.flashConfirmation = false;
								}
							}
						});

						$.immediatePunchFail.show.apply($);
					}else{
						CloudClock.clock.showEmployeeFlowDialog = false;

						$.immediatePunchSuccess = CloudClock.customAlert.create({
							type: 'success',
							cancel: 0,
							buttonNames: [CloudClock.customL.strings('ok')],
							title: CloudClock.customL.strings('success'),
							message: CloudClock.customL.strings('immediatePunchSuccess'),
							callback:{
								eType: 'click',
								action: function(_e){
									$.immediatePunchSuccess.hide.apply($);
									CloudClock.flashConfirmation = false;
								}
							}
						});

						$.immediatePunchSuccess.show.apply($);
					}
				}

				// turn off the automatic help audio
				if(CloudClock.playHelp)
					$.header.helpButton.fireEvent('click');

			});

			if(CloudClock.migratedUp && Ti.App.Properties.hasProperty('seeded')){
				CloudClock.log('Info', 'DB upgrade in progress, fetching new data from host. Terminal ID: '+Ti.App.Properties.getString('TERMID'));
				// we are changing the messageType in the params here to INIT inside of this fn
				CloudClock.maintenace_cfg.params.messageType = 'INIT';
				
				CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				$.activityIndicator.show();
				CloudClock.api.request(CloudClock.maintenace_cfg);
				CloudClock.migratedUp = false;
			}

			$.clockIn.addEventListener('click', clockIn_click);
			$.manager.addEventListener('click', manager_click);
		}

		function reInitializedByManager(){
			$.activityIndicator.show();

			// disable the screen saver while loading data from server bcs. it might take some time
			// specially in the help files portion
			CloudClock.clock.showScreenSaver = false;

			CloudClock.reInit = args.reInit;
			initializeClock.initialize(args.terminalID);
			
			$.pinPad.changeMode({mode: 'enterPin'});
		}

		// adding parent win to globals
		CloudClock.parent = $;
		CloudClock.parent.running = true;
		CloudClock.reInit = false;

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1100';
		
		$.screenSaver.running = false;

		// public functions
		$.initialize = function(e){

			// disable the screen saver while loading data from server bcs. it might take some time
			// specially in the help files portion
			CloudClock.clock.showScreenSaver = false;

			initializeClock.initialize(e.terminalID);
		};

		$.employee_login = function(e){

			function closeSelf(){
				CloudClock.parent.activityIndicator.hide();
				CloudClock.parent.activityIndicator.setMessage('Loading...');
				closeIndex();
			}

			var employeesToPass = Alloy.Collections.employees.searchByPin(e.employeePin);
			var l = employeesToPass.length;

			if(l === 0 && Ti.App.Properties.getString('ALLOWCROSSPUNCH') === '1')
			{
				// first let's ask if they in fact are a new employee
				$.newEmployeeDialog = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('no'), CloudClock.customL.strings('yes')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('newEmp_dialog'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								$.pinPad.clearPinPadTxtField();
								$.pinPad.addBtnEvents();
								$.newEmployeeDialog.hide.apply($);
							}else{
								Alloy.createController('employeeFlow_newEmployee', { newEmployeePin: e.employeePin });
								$.newEmployeeDialog.hide.apply($);
								closeSelf();
							}
						}
					}
				});

				$.activityIndicator.hide();
				$.newEmployeeDialog.show.apply($);
			}
			else if(l === 1) // we have employee that matches the pin
			{
				Ti.App.Properties.setString('CURRLANGUAGETYPE', employeesToPass[0].get('lang'));

				Alloy.createController('employeeFlow_clockInOut', {employees: employeesToPass});

				closeSelf();
			}
			else if(l > 1)	// multiple employees that have the same pin
			{
				Alloy.createController('employeeFlow_selectEmployee', {employees: employeesToPass});

				closeSelf();
			}
			else // no employees found, ALLOWCROSSPUNCH is not on, try another pin num
			{
				$.activityIndicator.hide();
				$.activityIndicator.setMessage('Loading...');

				//Prompt the user to enter a different PIN, we could offer to enter as new employee here as well?
				$.badPinAlert = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('invalid_employeePin'),
					message: CloudClock.customL.strings('enterDifferentPin'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								$.pinPad.clearPinPadTxtField();
								$.badPinAlert.hide.apply($);
							}
						}
					}
				});

				$.badPinAlert.show.apply($);

				$.pinPad.clearPinPadTxtField();
				$.pinPad.addBtnEvents();
			}
		};

		$.manager_login = function(e){

			if(!CloudClock.managerOptions){

				if( e.managerPin === Ti.App.Properties.getString('MGRPIN') || e.managerPin === Ti.App.Properties.getString('MGR2PIN') ){
					closeIndex();

					Alloy.createController('managerOptions');
					CloudClock.managerOptions.managerOptions.open();
				}
				else if(e.managerPin === '9111'){
					closeIndex();

					Alloy.createController('managerOptions', {debugMode: true});
					CloudClock.managerOptions.managerOptions.open();
				}
				else{
					$.wrongManagerPinDialog = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('invalid_managerPin'),
						callback:{
							eType: 'click',
							action: wrongManagerDialogClick
						}
					});

					$.wrongManagerPinDialog.show.apply($);
				}
			}
			else
			{
				//console.log('manageroption opened already');
				var error = new Error();
				//console.log(error);
			}
		};

		$.animateBall = function(){
			var matrix = Ti.UI.create2DMatrix();
			matrix = matrix.translate(-890, -660);
			var a = Ti.UI.createAnimation({
				transform : matrix,
				duration : 5000,
				autoreverse : true,
				repeat : 0
			});
			$.screenSaverLogo.animate(a);
		};

		$.startAnimation = function(){
			$.screenSaver.running = true;
			$.animateBall();
		};

		$.hide = function(){
			$.screenSaver.hide();
		};

		var oldTermID = 0;
		
		Ti.App.Properties.setString('CURRLANGUAGETYPE', Ti.App.Properties.getString('LANGUAGETYPE'));
		$.header.setLanguage();

		updateUIclock();

		addListeners();

		// is DB populated
		if(Ti.App.Properties.hasProperty('seeded')){
			updateUI_seeded();

			// restart timeout
			CloudClock.screenTimeout.restartTimeoutIndex();

			$.index.open();

			// manager has entered a new terminal ID in the manager options
			if(args.reInit === true){
				reInitializedByManager();
			}
		}else{
			updateUI_notSeed();

			oldTermID = parseInt(oldDbRemoval(), 10);
			// if this is an update to the older version of the app we will have the old terminal id
			// and now we have to auto update the data
			if(!isNaN(oldTermID)){
				$.activityIndicator.show();
				initializeClock.initialize(oldTermID);
				$.pinPad.changeMode({mode: 'enterPin'});
			}

			$.index.open();
		}
	}catch(error){
		CloudClock.error(error);
	}

}());




