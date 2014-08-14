
var api = require('api');
var csv = require('exportCSVData');

exports.definition = {
	config: {
		columns: {
			idType: "text", //P or U depending on if new employee or not
			employeeBadge: "integer", // if P than this is PIN number else this is badge number
			transType: "text", // punch-In or punch-Out I or U
			departmentNum: "integer", // department under which the clock in occured 
			transTime: "integer", // time seconds past 1970 use var d = new Date(); var n = d.getTime(); instead of moment.js
			transDateTime: "text", // Readable time stamp. will convert the transTime into readable time using moment.js
			initials: "text", // in case of new employee the initials entered,
			photoFileName: "text",
			photoTime: "integer",
			photoData: "text",
			shiftID: "integer",
			overrideFlag: "integer",
			sent: "integer", // 0 - unsent, 1 - sent, 2 - toBeSent
			reasonCodeID: "integer",
			reasonCodeType: "integer",
			amount: "integer"
		},
		adapter: {
			// Using the sql adapter but will have to run a one minute interval fn to submit this data to the server if the network is available
			type: "sql",
			collection_name: "transactions"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(attrs){
				if(attrs.sent === 1){
					this.destroy({
						success: function(){
							console.log('transaction destroyed');
						}
					});
				}
			},
			change: function(){
				console.log('\n\n\nFrom change in transactions function: '/*+JSON.stringify(this)*/);
			},
			validate: function(attrs, options){
				if(_.isNull(attrs.transTime) || _.isNaN(attrs.transTime)){
					return 'Tried to save a transaction with transTime = null!';
				}
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			transactions_cfg: {
				endpoint: 'postTransactions',
				params: {},
				payload: {
					transactionRequest: {
						punches: [],
						photos: []
					}
				},
				onSuccess: function(response){
					if(response.error){
						CloudClock.log('Error', 'Server responded to the transactions call: ' + JSON.stringify(response));
					}else if(response.status === 0){
						console.log("\nTRANSACTIONS RESPONSE: " + response);
						CloudClock.log('Info', 'Punch transactions successfully sent to the server: '+JSON.stringify(response));

						Alloy.Collections.transactions.fetch({
							success: function(){
								console.log('Transactions successfuly retrieved from local DB.');

								_.each(response.result, function(postedTransaction){
									var localTransaction = Alloy.Collections.transactions.where({transTime: postedTransaction});
									localTransaction[0].save({sent:1}, {
										success: function(){
											CloudClock.log('Info', 'Transaction marked as sent: '+JSON.stringify(_.omit(localTransaction[0].attributes, 'photoData')));
										},
										error: function(model, response){
											CloudClock.log("Error", "Transaction Model: "+JSON.stringify(response));
										}
									});
								});
							},
							error: function(collection, response, options){
								CloudClock.log('Error', JSON.stringify(response));
							}
						});
					}else if(response.status !== 0){
						CloudClock.log('Error', JSON.stringify(response));
						Alloy.Collections.transactions.setPunches_toBeSent();
					}

					var now = CloudClock.moment();

					Ti.App.Properties.setString('LAST_CONNECT', now.format('h:mm a'));
					Ti.App.Properties.setString('LAST_QUPDATE', now.format('h:mm a'));

					try{
						if(CloudClock.managerOptions){
							CloudClock.managerOptions.setLastConnectText();
							CloudClock.managerOptions.setQUpdateText();
						}
					}catch(error){
						CloudClock.error(error);
					}
				},
				onError: function(response){
					console.log("\nERROR: " + JSON.stringify(response));
					CloudClock.log('Error', 'There was an error with sending punch transactions to the server. Error: ' + JSON.stringify(response));
					Alloy.Collections.transactions.setPunches_toBeSent();
				}
			},
			setPunches_toBeSent: function(){
				var unsentPunches = _.filter(this.models, function(punch){
					return punch.attributes.sent !== 1;
				});

				_.each(unsentPunches, function(punch){
					CloudClock.log('Info', 'Unsent punch for employee badge: '+punch.attributes.employeeBadge+', @ '+punch.attributes.transDateTime);
					punch.save({sent: 0}, {
						success: function(){
							CloudClock.log('Info', 'Transaction marked to be sent: '+JSON.stringify(_.omit(punch.attributes, 'photoData')));
						}
					});
				});
			},
			initialize: function(){
				console.log('Transactions collection initialized.');
			},
			sendTransactions: function(){
				console.log('Application prompted to send punch transactions.');

				var CAPTUREPHOTO = Ti.App.Properties.getString('CAPTUREPHOTO');
				var maxTransactions = 10; // max amount of transactions to send
				var currentNumOfTransactions = 0;
				var tempPunches = [];
				var tempPhotos = [];

				var that = this;

				if(that.models.length === 0){
					console.log('No transactions to process.');
					// CloudClock.log('Info', 'All transactions marked as sent, exit sendTransactions.');

					return false;
				}
				else if(Ti.Network.online)
				{
					var unsentPunches = that.where({sent: 0});

					console.log('\n\n\nUnsent punches length: '+unsentPunches.length);
					CloudClock.log('Info', 'Unsent punches: '+unsentPunches.length);

					_.each(unsentPunches, function(transaction, key){
						try{
							// extra array for the device exceptions
							var deviceException = [];

							deviceException.push(_.pick(
								transaction.attributes,
								'reasonCodeID',
								'reasonCodeType',
								'amount'
							));

							// extra array for extra fields
							var extraFields = []; // probably will be coming from transaction extras table empty for now

							tempPunches.push((function(){
								var r = {};

								r.idType = transaction.attributes.idType;
								r.employeeBadge = transaction.attributes.employeeBadge;
								r.transType = transaction.attributes.transType;
								r.departmentNum = (transaction.attributes.transType === 'I') ? transaction.attributes.departmentNum : 0;
								r.transTime = transaction.attributes.transTime;
								r.transDateTime = transaction.attributes.transDateTime;
								r.shiftID = transaction.attributes.shiftID;
								r.overrideFlag = transaction.attributes.overrideFlag;

								r.exceptions = deviceException;

								if(transaction.attributes.initials !== "0"){
									r.initials = transaction.attributes.initials;
								}

								currentNumOfTransactions = currentNumOfTransactions+1;

								return r;
							})());

							if(CAPTUREPHOTO === "1" && transaction.has('photoData')){
								console.log('This employee has photo data.');
								//that.transactions_cfg.payload.transactionRequest.photos
								tempPhotos.push(_.pick(
									transaction.attributes,
									'employeeBadge',
									'photoTime',
									'photoData'
								));
							}else{
								console.log('This employee does not have photo data');
								console.log('do not include photos in this transaction');
							}

							function sendPunches_resetCFGarrays(){
								console.log('\n\n\nSending '+tempPunches.length+' punches....');
								CloudClock.log('Info', 'Sending '+tempPunches.length+' punches....');

								// we have ten transactions let's send them
								that.transactions_cfg.payload.transactionRequest.punches = tempPunches;
								that.transactions_cfg.payload.transactionRequest.photos = (tempPhotos.length > 0) ? tempPhotos : [];
								
								//save to CSV text file
								csv.exportCsvData(tempPunches);

								// send the transactions
								that.transactions_cfg.params.termID = Ti.App.Properties.getString('TERMID');
								api.request(that.transactions_cfg);

								tempPunches = [];
								tempPhotos = [];
							}

							if(tempPunches.length === maxTransactions){
								sendPunches_resetCFGarrays();

							}else if(key === (unsentPunches.length - 1) && tempPunches.length > 0){
								sendPunches_resetCFGarrays();
							}

							transaction.save({sent: 2}, {// set "sent" to 2 like an inbetween state "to be sent"
								success: function(){
									CloudClock.log('Info', 'Transaction marked to be sent: '+
										JSON.stringify(_.omit(transaction.attributes, 'photoData'))
									);
								}
							});

						}catch(error){CloudClock.error(error);}
					});
				}else if(!Ti.Network.online){
					console.log('Device is not online transactions will be sent as soon as the network signal is available');
					CloudClock.log('Error', 'Device is not online, transactions will be sent as soon as the network is available.');
				}
			}
		});
		return Collection;
	}
};

