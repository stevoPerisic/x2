module.exports = {
	i: 0, // counter
	t: 0, // transaction counter
	m: 0, // maintenance counter
	indexTimeout: 0, // screen saver counter
	showScreenSaver: true,
	employeeFlow: 0, // employee flow counter
	employeeFlowWindow: '',
	showEmployeeFlowDialog: false,
	employeeOptions: 0, // employee options counter
	showEmployeeOptionsDialog: false,
	managerOptions: 0, // manager options counter
	showManagerOptionsDialog: false,
	dialogTimeout: 0, // session expiration dialog counter
	// clock interval is set to repeat every second, if for any reason we need to change this change the interval value :)
	clockInterval: 1000,
	init: function(){
		try{
			var that = (this.id === 'clock') ? this : CloudClock.clock;
			if(!CloudClock.clockStarted){
				CloudClock.clockStarted = true;
				that.updateTime();
			}
		}catch(error){
			CloudClock.error(error);
		}
	},
	updateTime: function(){
		try{
			if(typeof CloudClock.clock.timeout === 'number'){
				clearTimeout(CloudClock.clock.timeout);
				delete CloudClock.clock.timeout;
			}

			CloudClock.clock.setTime();


			CloudClock.clock.timeout = setTimeout(CloudClock.clock.updateTime, CloudClock.clock.clockInterval);
		}catch(error){
			CloudClock.error(error);
		}
	},
	setTime: function(){
		try{
			var that = (this.id === 'clock') ? this : CloudClock.clock;
			that.i = that.i+1000;
			that.t = that.t+1000;
			that.m = that.m+1000;
			that.indexTimeout = that.indexTimeout+1000;
			that.employeeFlow = that.employeeFlow+1000;
			that.employeeOptions = that.employeeOptions+1000;
			that.managerOptions = that.managerOptions+1000;
			that.dialogTimeout = that.dialogTimeout+1000;

			// update the UI clock
			if(!_.isEmpty(CloudClock.UIClock)){
				CloudClock.UIClock.setText(CloudClock.moment().format('h:mm a'));
			}

			if(that.i%60000 === 0){// every minute from app start
				that.comm(); // run communication

				// check if the index is on screen and the manager button is selected, if so switch back to employee
				if(CloudClock.parent !== null && CloudClock.parent.manager.classes.length > 1){
					CloudClock.parent.changeToEmployeeMode({mode: 'enterPin'});
				}
			}

			if(that.i%86400000 === 0){ // every 24 hours from app start remove clock history entries
				Alloy.Collections.clockHistory.removeHistory();

				// also send the transactions.csv file
				Alloy.Collections.logging.sendTransactionsCSV();

				// at the 24 hour mark set that.i back to zero
				that.i = 0;
			}

			//screen saver animation and when to start it
			if(that.indexTimeout%CloudClock.screenTimeout.homeScreenTimeout === 0 && CloudClock.parent !== null && that.showScreenSaver === true){
				
				if(CloudClock.parent.screenSaver.running === false){
					console.log('\n\n\nAbout to start screen saver');

					CloudClock.screenTimeout.startScreenSaver();
					that.indexTimeout = 0;
				}

			}else if(that.indexTimeout%10000 === 0 && CloudClock.parent !== null && that.showScreenSaver === true){
				// console.log('\n\n\nWant to re animate screensaver');

				if(CloudClock.parent.screenSaver.running === true){
					// console.log('\n\n\nAbout to re animate screensaver');

					CloudClock.parent.animateBall();
				}

			}

			if(that.employeeFlow%CloudClock.screenTimeout.employeeFlow === 0 && that.showEmployeeFlowDialog === true){
				console.log('Employee flow timed out');

				CloudClock.screenTimeout.flowTimeout(this.employeeFlowWindow, 'employeeFlow');
				
				that.employeeFlow = 0;
			}

			//double check this first conditional
			if(that.employeeOptions !== 0 && that.employeeOptions%CloudClock.screenTimeout.employeeOptions === 0 && that.showEmployeeOptionsDialog === true){
				console.log('employeeOptions flow timed out');
				CloudClock.screenTimeout.flowTimeout('', 'employeeOptions');
				that.employeeOptions = 0;
			}

			if(that.managerOptions%CloudClock.screenTimeout.managerOptions === 0 && that.showManagerOptionsDialog === true){
				console.log('managerOptions flow timed out');
				CloudClock.screenTimeout.flowTimeout('', 'managerOptions');
				that.managerOptions = 0;
			}
		}catch(error){
			CloudClock.error(error);
		}
	},
	getCurrentTime: function(){
		try{
			var time = {
				secondsSince111970 : 0,
				convertedUnix: ''
			};

			//THIS IS VERY TRICKY THE TIME CALCULATIONS....HMM :(
			var now = CloudClock.moment();

			time.secondsSince111970 = Math.round((new Date()).getTime() / 1000);

			if(_.isNull(time.secondsSince111970) || _.isNaN(time.secondsSince111970)){
				CloudClock.log('Error', 'CloudClock clock could not get the seconds past 1970, retry...');
				time.secondsSince111970 = Math.round((new Date()).getTime() / 1000);
				CloudClock.log('Info', 'After retry: '+time.secondsSince111970);
			}

			var convertedUnix = moment.unix(time.secondsSince111970);
			time.convertedUnix = moment.utc(convertedUnix).format();

			return time;
		}catch(error){
			CloudClock.error(error);
		}
	},
	comm: function(){
		try{
			console.log('start comm');
			var that = (this.id === 'clock') ? this : CloudClock.clock;
			
			//Communication intervals come down from the server in the "amount of minutes"
			var transactionInterval = parseInt(Ti.App.Properties.getString('COMMINTERVAL1'), 10)*60000;
			var maintenaceInterval = parseInt(Ti.App.Properties.getString('COMMINTERVAL2'), 10)*60000;
			
			if(that.t === transactionInterval){
				// CloudClock.log('Info', 'SEND TRANSACTIONS INTERVAL FIRED...');
				Alloy.Collections.transactions.sendTransactions();

				// if soft scheduling and camera on send batch mode pics
				var SOFTSCHEDULING = Ti.App.Properties.getString('SOFTSCHEDULING');
				var CAPTUREPHOTO = Ti.App.Properties.getString('CAPTUREPHOTO');
				if(SOFTSCHEDULING === '1' && CAPTUREPHOTO === '1'){
					console.log('About to send batch mode pics....');
					Alloy.Collections.employees.sendPhotos_batchMode();
				}

				that.t = 0;
			}

			if(that.m === maintenaceInterval){
				CloudClock.log('Info', 'AVAILABLE MEMORY ON DEVICE: '+Math.ceil(Ti.Platform.availableMemory)+' MB');

				var dataSize = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).spaceAvailable();
				CloudClock.log('Info', 'Data directory size: '+Math.ceil(dataSize/1048576)+' MB');
				dataSize = null;

				var resourcesSize = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory).spaceAvailable();
				CloudClock.log('Info', 'Resources directory size: '+Math.ceil(resourcesSize/1048576)+' MB');
				resourcesSize = null;

				var tempSize = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).spaceAvailable();
				CloudClock.log('Info', 'Temp directory size: '+Math.ceil(tempSize/1048576)+' MB');
				tempSize = null;

				var cacheSize = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory).spaceAvailable();
				CloudClock.log('Info', 'Cache directory size: '+Math.ceil(cacheSize/1048576)+' MB');
				cacheSize = null;
				
				console.log('Is screen saver visible: '+CloudClock.screensaverON);

				if(CloudClock.parent !== null && CloudClock.screensaverON){
					CloudClock.log('Info', 'REQUEST MAINTENACE...');
					CloudClock.maintenace_cfg.params.messageType = 'MAINT';
					CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					CloudClock.api.request(CloudClock.maintenace_cfg);

					// save logs into a csv file
					Alloy.Collections.logging.saveToCSVandRemove();
				}

				// is screen saver on? send logs also
				// if(CloudClock.parent !== null && CloudClock.parent.screenSaver){
				// 	CloudClock.log('Info', 'SEND LOGS...');
				// 	Alloy.Collections.logging.sendLogs();
				// }else{
				// 	console.log('Screen saver is not on wait to send logs');
				// }

				that.m = 0;
			}
		}catch(error){
			CloudClock.error(error);
		}
	}
};


