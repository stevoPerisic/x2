var api = require('api');

exports.definition = {
	config: {
		columns: {
			"severity": "text",
			"message": "text",
			"time": "integer",
			"readableTime": "text",
			"sent": "integer",// 0 - unsent, 1 - sent,
		},
		defaults:{
			sent: 0
		},
		adapter: {
			type: "sql",
			collection_name: "logging"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(){
				// console.log('Log entry initialized.');
				// console.log('check if it was sent ...');

				if(this.get('sent') === 1){
					this.destroy();
				}
			},
			change: function(){
				// console.log('Attributes changed: '+JSON.stringify(this.changed));
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			logs_cfg: {
				endpoint: 'sendLogs',
				params: {},
				payload: {
					log: {
						logs: []
					}
				},
				onSuccess: function(response){
					console.log(JSON.stringify(response));

					var that = Alloy.Collections.logging;

					if(response.error){
						CloudClock.log('Error', 'Server responded to the log sending call: ' + JSON.stringify(response));
					}else{

						try{
							// check flags to see what was sent logs and/or csv file
							if(that.sendingLogs === true){

								// delete CSV files
								Alloy.Collections.logging.deleteLogsCSV();

								// perhaps we don't need to perform the log removal below since we removed them all when we created the csv file
								_.each(that.models, function(log){
									// check sent flag
									if(log.get('sent') === 0){
										// set to one for deletion
										log.save({sent: 1});
									}
								});

								that.sendingLogs = false;

								console.log('Logs sent successfully: ' + JSON.stringify(response));
								CloudClock.log('Info', 'Logs sent successfully: ' + JSON.stringify(response));

								if(CloudClock.parent !== null && CloudClock.parent.screenSaver.visible){
									console.log('Screen saver is on, do not make the dialog and remove sent logs...');
									// perhaps we don't need to perform the log removal below since we removed them all when we created the csv file
									while(Alloy.Collections.logging.models.length > 0){
										Alloy.Collections.logging.models[0].destroy();
									}
								}else{
									console.log('Screensaver NOT on show dialog...');

									CloudClock.logsSentDialog = CloudClock.customAlert.create({
										type: 'success',
										cancel: 0,
										buttonNames: [CloudClock.customL.strings('ok')],
										title: CloudClock.customL.strings('success'),
										message: 'Logs sent.',
										callback:{
											eType: 'click',
											action: function(_e){
												if(_e.source.id === this.cancel){

													while(Alloy.Collections.logging.models.length > 0){
														Alloy.Collections.logging.models[0].destroy();
													}

													CloudClock.logsSentDialog.hide.apply(CloudClock.managerOptions);
													CloudClock.logsSentDialog = null;

													if(CloudClock.managerOptions)
														CloudClock.managerOptions.viewLogs();
												}
											}
										}
									});

									CloudClock.logsSentDialog.show.apply(CloudClock.managerOptions);
								}
							}

							if(that.sendingCSV === true){
								// delete local CSV file
								that.outputFile.deleteFile();
								that.outputFile = null;

								that.sendingCSV = false;

								console.log('Transactions CSV sent successfully: ' + JSON.stringify(response));
								CloudClock.log('Info', 'Transactions CSV sent successfully: ' + JSON.stringify(response));

								CloudClock.CSVsentDialog = CloudClock.customAlert.create({
									type: 'success',
									cancel: 0,
									buttonNames: [CloudClock.customL.strings('ok')],
									title: CloudClock.customL.strings('success'),
									message: 'Transactions CSV file sent.',
									callback:{
										eType: 'click',
										action: function(_e){
											if(_e.source.id === this.cancel){
												CloudClock.CSVsentDialog.hide.apply(CloudClock.managerOptions);
												CloudClock.CSVsentDialog = null;
											}
										}
									}
								});

								CloudClock.CSVsentDialog.show.apply(CloudClock.managerOptions);
							}

							if(CloudClock.managerOptions)
								CloudClock.managerOptions.activityIndicator.hide();
						}catch(error){
							CloudClock.error(error);
						}
					}
				},
				onError: function(response){
					try{
						console.log('Error: ' + JSON.stringify(response));
						CloudClock.log('Error', 'Server responded to the log sending call: ' + JSON.stringify(response));

						var that = Alloy.Collections.logging;
						
						// check for what was being sent, logs and/or csv file
						if(that.sendingLogs === true){

							that.sendingLogs = false;

							console.log('Logs NOT SENT: ' + JSON.stringify(response));
							CloudClock.log('Error', 'Logs NOT SENT: ' + JSON.stringify(response));

							CloudClock.logsSentDialog = CloudClock.customAlert.create({
								type: 'alert',
								cancel: 0,
								buttonNames: [CloudClock.customL.strings('ok')],
								title: CloudClock.customL.strings('alert'),
								message: 'Unable to send logs.\nCheck your WiFi connection.',
								callback:{
									eType: 'click',
									action: function(_e){
										if(_e.source.id === this.cancel){
											CloudClock.logsSentDialog.hide.apply(CloudClock.managerOptions);
											CloudClock.logsSentDialog = null;
										}
									}
								}
							});

							CloudClock.logsSentDialog.show.apply(CloudClock.managerOptions);
						}

						if(that.sendingCSV === true){
							// set this collections pointer to null but DO NOT DELETE THE FILE!
							that.outputFile = null;

							that.sendingCSV = false;

							console.log('Transactions CSV NOT SENT: ' + JSON.stringify(response));
							CloudClock.log('Error', 'Transactions CSV NOT SENT: ' + JSON.stringify(response));
						}

						if(CloudClock.managerOptions){
							CloudClock.managerOptions.viewLogs();
							CloudClock.managerOptions.activityIndicator.hide();
						}	
					}catch(error){
						CloudClock.error(error);
					}
				}
			},
			initialize: function(){
				var that = this;
				
				// set flags to false
				that.sendingLogs = false;
				that.sendingCSV = false;

				that.fetch({
					success: function(){
						console.log('Logs successfuly retrieved from local DB.');
					},
					error: function(collection, response, options){
						CloudClock.log('Error', JSON.stringify(response));
					}
				});
				that.sortByTimeDesc();
				if(that.length > 10){
					console.log('We have this many log entries in the DB:' + that.length);
				}
			},
			comparator : function(a, b) {
				// Assuming that the sort_key values can be compared with '>' and '<',
				// modifying this to account for extra processing on the sort_key model
				// attributes is fairly straight forward.
				a = a.get(this.sort_key);
				b = b.get(this.sort_key);
				var ret;

				if(a < b){ ret = -1; }
				else if(a > b){ ret = 1; }
				else{ret = 0;}

				if(this.sort_dir === "desc"){ ret = -ret; }
				return ret;
			},
			sortByTimeAsc: function(){
				this.sort_key = 'time';
				this.sort_dir = 'asc';
				this.sort();
			},
			sortByTimeDesc: function(){
				this.sort_key = 'time';
				this.sort_dir = 'desc';
				this.sort();
			},
			sortBySeverityAsc: function(){
				this.sort_key = 'severity';
				this.sort_dir = 'asc';
				this.sort();
			},
			sortBySeverityDesc: function(){
				this.sort_key = 'severity';
				this.sort_dir = 'desc';
				this.sort();
			},
			change: function(){
				console.log('changed');
			},
			saveToCSVandRemove: function(){
				Alloy.Collections.logging.fetch();
				Alloy.Collections.logging.sortByTimeAsc();
				var now = new Date();
				now = now.getTime();
				var logsForCSV = [];

				if(Alloy.Collections.logging.length > 0){
					_.each(Alloy.Collections.logging.models, function(log){
						var tempObj = {
							'time': log.get('time') + ' | ' + log.get('readableTime'),
							'text': log.get('severity') + ' | ' + log.get('message')
						};

						logsForCSV.push(tempObj);
					});

					while(Alloy.Collections.logging.models.length > 0){
						Alloy.Collections.logging.models[0].destroy();
					}

					CloudClock.csv.exportCsvData(logsForCSV, 'logging_'+now+'.csv');
				}

				Alloy.Collections.logging.sendLogsCSV();

				now = null;
			},
			sendLogs: function(){
				var that = Alloy.Collections.logging;

				if(Ti.Network.online){
					
					that.logs_cfg.payload.log.logs = [];

					that.fetch();
					_.each(that.models, function(log){
						// set temp flag sent where sent: 0 => in queue and sent: 1 => successfuly sent 
						log.save({sent: 0});

						// populate the payload
						that.logs_cfg.payload.log.logs.push({
							'time': log.get('time') + ' | ' + log.get('readableTime'),
							'text': log.get('severity') + ' | ' + log.get('message')
						});
					});

					// make sure terminal ID is correct
					that.logs_cfg.params.termID = Ti.App.Properties.getString('TERMID');

					// set flag
					that.sendingLogs = true;

					console.log('About to send ' + that.logs_cfg.payload.log.logs.length + ' logs');

					// send request
					api.request(that.logs_cfg);
					// empty payload cache
					that.logs_cfg.payload.log.logs = [];
					
				}else{
					console.log('Device is not online logs will be sent as soon as the network signal is available');
					CloudClock.log('Error', 'Device is not online, logs will be sent as soon as the network is available.');
				}
			},
			sendLogsCSV: function(){
				if(Ti.Network.online){
					var documentsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
					var listing = documentsDir.getDirectoryListing();

					for(var i=0; i<listing.length; i++){
						Alloy.Collections.logging.logs_cfg.payload.log.logs = [];

						if(listing[i].indexOf('logging') != -1){
							// read the log CSV file and add it to the object to get sent
							var tempLogFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, listing[i]);

							Alloy.Collections.logging.logs_cfg.payload.log.logs.push({
								"time": moment().format('hh:mm:ss'),
								"text": tempLogFile.read().toString()
							});
							// set flag
							Alloy.Collections.logging.sendingLogs = true;
							api.request(Alloy.Collections.logging.logs_cfg);

							Alloy.Collections.logging.logFileToRemove.push(listing[i]);
						}
					}
				}else{
					console.log('Device is not online logs will be sent as soon as the network signal is available');
					CloudClock.log('Error', 'Device is not online, logs will be sent as soon as the network is available.');
				}
			},
			logFileToRemove: [],
			deleteLogsCSV: function(){
				if(Alloy.Collections.logging.logFileToRemove.length > 0){
					_.each(Alloy.Collections.logging.logFileToRemove, function(fileName){
						var tempLogFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
						tempLogFile.deleteFile();
					});

					Alloy.Collections.logging.logFileToRemove = [];
				}
				// var documentsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
				// var listing = documentsDir.getDirectoryListing();
				// for(var i=0; i<listing.length; i++){
				// 	console.log(JSON.stringify(listing[i]));
				// 	if(listing[i].indexOf('logging') != -1){
				// 		// read the log CSV file and add it tio the object to get sent
				// 		var tempLogFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, listing[i]);
				// 		tempLogFile.deleteFile();
				// 	}
				// }
			},
			sendTransactionsCSV: function(){
				var that = Alloy.Collections.logging;

				that.outputFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'transactions.csv');
				var existingText = "";

				try{
					if(that.outputFile.exists()){
						existingText = that.outputFile.read().toString();

						that.logs_cfg.payload.log.logs.push({
							"time": moment().format('hh:mm:ss'),
							"text": existingText
						});

						that.logs_cfg.params.termID = Ti.App.Properties.getString('TERMID');

						// set flag
						that.sendingCSV = true;

						CloudClock.log("Info", "transactions.csv ready to be sent!!!");

						api.request(that.logs_cfg);

						existingText = null;
					}else if(CloudClock.managerOptions){
						CloudClock.CSVsentDialog = CloudClock.customAlert.create({
							type: 'warning',
							cancel: 0,
							buttonNames: [CloudClock.customL.strings('ok')],
							title: CloudClock.customL.strings('warning'),
							message: 'No transactions were recorded on this clock since the last time you sent the transactions CSV file.',
							callback:{
								eType: 'click',
								action: function(_e){
									if(_e.source.id === this.cancel){
										CloudClock.CSVsentDialog.hide.apply(CloudClock.managerOptions);
										CloudClock.CSVsentDialog = null;
									}
								}
							}
						});

						CloudClock.CSVsentDialog.show.apply(CloudClock.managerOptions);
					}
				}catch(error){
					CloudClock.error(error);
				}
			}
		});

		return Collection;
	}
};