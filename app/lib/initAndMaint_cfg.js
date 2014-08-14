var initialize_cfg = {
	endpoint: 'checkin',
	params: {
		'messageType': 'INIT',
		'reload': true
	},
	payload: {},
	onSuccess: function(response){
		initializeSuccess(response);
	},
	onError: function(response){
		console.log('Error initializing... ' + JSON.stringify(response));
		CloudClock.log('Error', 'Error while initializing: ', JSON.stringify(response));

		// CloudClock.parent.activityIndicator.setMessage('Initialization request errored out with: '+response);
		
		CloudClock.parent.pinPad.changeMode({mode: 'terminalID'});

		CloudClock.parent.activityIndicator.hide();

		if(CloudClock.parent && CloudClock.parent !== null){
			CloudClock.parent.initCallError = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: 'Sorry, an error occurred while processing your request.',
				callback:{
					eType: 'click',
					action: function(_e){
						if(_e.source.id === this.cancel){
							CloudClock.parent.initCallError.hide.apply(CloudClock.parent);
						}
					}
				}
			});

			CloudClock.parent.initCallError.show.apply(CloudClock.parent);
		}
	}
};

var initSuccess_cfg = {
	endpoint: 'checkinComplete',
	params: {},
	payload: {
		checkInCompleteMessage: {
			success: true,
			messageId: '',
			messages: []
		}
	},
	onSuccess: function(response){
		console.log(response);
		var now = CloudClock.moment();
		Ti.App.Properties.setString('LAST_CONNECT', now.format('h:mm a'));
		Ti.App.Properties.setString('LAST_LUPDATE', now.format('h:mm a'));
		Ti.App.Properties.setString('LAST_QUPDATE', now.format('h:mm a'));
	},
	onError: function(response){
		console.log('Error sending success message: ' + JSON.stringify(response));
		CloudClock.log('Error', 'Error sending success message: ' + JSON.stringify(response));
	}
};

function createModels(key, model){
	// for(var prop in model){

	// 	if(prop === 'list'){
	// 		model.list = JSON.stringify(model.list);
	// 	}
	// }
	var tempModel = Alloy.createModel(key, model);
	tempModel.save();

	tempModel = null;
}

function initializeSuccess(data){
	CloudClock.parent.activityIndicator.setMessage('Cloud Clock received data...');

	if(!_.isObject(data)){
		// the data coming from server is not in the proper object format
		// let's check if there is a message

		if(typeof(data) === 'string'){
			console.log('Error message of some kind let us display it');
			// we should be in the index view/controller
			// fire up a dialog and pass it the message
			CloudClock.parent.reInitError = CloudClock.customAlert.create({
				type: 'warning',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('warning'),
				message: data,
				callback:{
					eType: 'click',
					action: function(_e){
						CloudClock.parent.pinPad.changeMode({mode: 'terminalID'});
						CloudClock.parent.reInitError.hide.apply(CloudClock.parent);
					}
				}
			});

			CloudClock.parent.activityIndicator.hide();
			CloudClock.parent.reInitError.show.apply(CloudClock.parent);
		}else{
			console.log('Move on ...');
			CloudClock.parent.activityIndicator.setMessage('Data object is not correctly formatted. \n\n'+data);
			CloudClock.log('Error', 'Error initializing: '+JSON.stringify(data));
			CloudClock.parent.pinPad.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_terminal"));
			CloudClock.parent.pinPad.changeMode({mode: 'terminalID'});
			CloudClock.parent.activityIndicator.hide();
		}
	}else{
		try{
			_.each(data, function(obj, key) {
				//	RE-INITIALIZE FROM MANAGER SETTINGS
				if(CloudClock.reInit && key!== 'messageId' && key!== 'messageType'){
					CloudClock.parent.activityIndicator.setMessage('Re-initializing...');
					var db; // will hold the reference to our older db version in case we are re intializing the clock terminal
					try{
						// remove the existing collection from memory
						delete Alloy.Collections[key];

						db = Ti.Database.open('_alloy_');

						db.execute('DELETE FROM ' + key);

						console.log('Affected Rows: ' + db.getRowsAffected());

						db.close();

						db = null;
					}catch(error){
						CloudClock.error(error);
					}
				}

				if(_.isObject(obj)){
					console.log(key);

					// instantiate a global collection
					Alloy.Collections.instance(key);
					// Alloy.createCollection(key);

					_.each(obj.items, function(model){
						createModels(key, model);
					});

					Alloy.Collections[key].fetch({
						success: function(){
							console.log([key]+' successfuly retrieved from local DB.');
						},
						error: function(collection, response, options){
							CloudClock.log('Error', JSON.stringify(response));
						}
					});
				}
			});

			//POST THE SUCCESS MESSAGE
			_.extend(initSuccess_cfg.params, CloudClock.serverContext);
			initSuccess_cfg.payload.checkInCompleteMessage.messageId = data.messageId;
			initSuccess_cfg.payload.checkInCompleteMessage.messages.push(data.messageType);
			initSuccess_cfg.params.termID = Ti.App.Properties.getString('TERMID');
			CloudClock.api.request(initSuccess_cfg);

			//	GET PHOTOS
			console.log('About to get photos');
			Alloy.Collections.employees.getPhotos(initialize_cfg.params.termID);

			// G.C.
			data = null;
			response = null;
		}
		catch(error){
			CloudClock.error(error);
		}
	}
}

CloudClock.initSuccess_cfg = function(messageId){
	var cfg = {
		endpoint: 'checkinComplete',
		params: {},
		payload: {
			checkInCompleteMessage: {
					success: true,
					messageId: messageId,
					messages: ["Stevo Test Message"]
				}
		},
		onSuccess: function(response){
			var now = CloudClock.moment();
			Ti.App.Properties.setString('LAST_CONNECT', now.format('h:mm a'));
			Ti.App.Properties.setString('LAST_LUPDATE', now.format('h:mm a'));
			CloudClock.log('Info', 'Posted success message: '+response);
		},
		onError: function(response){
			console.log('Error sending success message: ' + JSON.stringify(response));
			CloudClock.log('Error', 'Error sending success message: ' + JSON.stringify(response));
		}
	};

	_.extend(cfg.params, CloudClock.serverContext);

	return cfg;
};

function hideActivityIndicator(){
	if(CloudClock.parent){
		CloudClock.parent.activityIndicator.hide();
	}else if(CloudClock.managerOptions){
		CloudClock.managerOptions.activityIndicator.hide();
	}
}

var filters = {
	departments: function(_model){
		var filter = {departmentNum: (_.has(_model, 'departmentNum')) ? _model.departmentNum : _model};
		return filter;
	},
	deviceHelp: function(_model){
		var filter = {screenId: (_.has(_model, 'screenId')) ? _model.screenId : _model};
		return filter;
	},
	employeeDepartments: function(_model){
		var filter = {departmentNum: _model.departmentNum, badge: _model.badge, recId: _model.recId};
		return filter;
	},
	employees: function(_model){
		var filter = {badge: (_.has(_model, 'badge')) ? _model.badge : _model};
		return filter;
	},
	extraFields: function(_model){
		var filter = {name: _model.name};
		return filter;
	},
	parameters: function(_model){
		var filter = {id: (_.has(_model, 'id')) ? _model.id : _model};
		return filter;
	},
	deptShifts: function(_model){
		var filter = {deptShiftID: (_.has(_model, 'deptShiftID')) ? _model.deptShiftID : _model};
		return filter;
	},
	reasonCodes: function(_model){
		var filter = {reasonCodeID: (_.has(_model, 'reasonCodeID')) ? _model.reasonCodeID : _model};
		return filter;
	},
	messages: function(_model){
		var filter = {value: (_.has(_model, 'value')) ? _model.value : _model};
		return filter;
	}
};

function update(_data, _collection){
	try{
		// Alloy.Collections[_collection].fetch(); // had to add fetch here bcs some collections do not get fetched on start for example reasonCodes
		//UPDATE
		_.each(_data.items, function(model){
			var existingModel = Alloy.Collections[_collection].where(filters[_collection](model));
			//save new model or update existing
			if(existingModel.length === 0){
				var tempModel = Alloy.createModel(_collection, model);

				tempModel.save();
			}else{
				// remove the deletMe flag if updating
				if(existingModel[0].attributes.deleteMe)
					existingModel[0].unset('deleteMe');

				existingModel[0].set(model);

				existingModel[0].save({
						wait: true,
						success: function(){
							// console.log(model);
							console.log('succes updating the existing model');
						},
						error: function(error){
							CloudClock.error(error);
							// var newError = {};
							// var members = Object.getOwnPropertyNames(error);
							// for(var i=0;i<members.length;i++)
							// 	newError[members[i]] = error[members[i]];

							// console.log('Error: '+newError.message);
							// CloudClock.log('Error', newError.message);

							// newError = null;
							// members = null;
						}
					}
				);
			}
			
			CloudClock.maintenace_cfg.tablesChanged = true;
		});
	}catch(error){
		console.log(error);
		CloudClock.error(error);
	}
}

function remove(_data, _collection){
	try{
		// Alloy.Collections[_collection].fetch(); // had to add fetch here bcs some collections do not get fetched on start for example reasonCodes
		//DELETE based on the REMOVED list
		_.each(_data.removed, function(model) {
			var existingModel = Alloy.Collections[_collection].where(filters[_collection](model));

			existingModel[0].destroy({
				success: function(){
					CloudClock.log('Info', 'Removed '+JSON.stringify(model.attributes)+' from the '+_collection+' table.');
				}
			});

			CloudClock.maintenace_cfg.tablesChanged = true;
		});

		// DELETE based on items not present in the data load, but not included in the REMOVED list
		_.each(Alloy.Collections[_collection].models, function(modelToDelete){
			if(modelToDelete.attributes.deleteMe){
				modelToDelete.destroy({
					success: function(){
						CloudClock.log('Info', 'Removed '+JSON.stringify(modelToDelete.attributes)+' from the '+_collection+' table.');
					}
				});
			}
		});

	}catch(error){
		console.log(error);
		CloudClock.error(error);
	}
}

function fetchNewData(_collection){
	try{
		if(CloudClock.parent){
			CloudClock.parent.activityIndicator.setMessage('Syncing ' + _collection);
		}else if(CloudClock.managerOptions){
			CloudClock.managerOptions.activityIndicator.setMessage('Syncing ' + _collection);
		}

		Alloy.Collections[_collection].fetch({
			success: function(){
				console.log('Successfuly fetched '+_collection);
			},
			error: function(collection, response, options){
				CloudClock.log('Error', JSON.stringify(response));
			}
		});
	}catch(error){
		CloudClock.error(error);
	}
}

function updateCollection(_data, _collection){
	CloudClock.log('Info', 'Updating '+_collection+' collection.');

	update(_data, _collection);

	remove(_data, _collection);

	fetchNewData(_collection);
}

function updateConnectionProps(){
	var now = CloudClock.moment();

	//Update the connection params
	if(CloudClock.maintenace_cfg.params.messageType === 'MAINT'){
		Ti.App.Properties.setString('LAST_CONNECT', now.format('h:mm a'));
		Ti.App.Properties.setString('LAST_QUPDATE', now.format('h:mm a'));
    }else{
		Ti.App.Properties.setString('LAST_CONNECT', now.format('h:mm a'));
		Ti.App.Properties.setString('LAST_LUPDATE', now.format('h:mm a'));
    }

	//update UI if present
	try{
		if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
			CloudClock.managerOptions.setLastConnectText();
			CloudClock.managerOptions.setLUpdateText();
			CloudClock.managerOptions.setQUpdateText();
		}
	}catch(error){
		console.log(error);
		CloudClock.error(error);
	}
}

CloudClock.maintenace_cfg = {
	tablesChanged : false,
	endpoint: 'checkin',
	params: {
		'messageType': 'MAINT'
	},
	payload: {},
	onSuccess: function(response){
		// clear params in global object!!!
		// CloudClock.maintenace_cfg.params = {};
		
		var data = response;

		// alert(data.messageType);
		
		CloudClock.log('Info', 'Data from the maintenance call received, start processing...');
		
		_.each(data, function(obj, key){
			try{
				if(_.isEmpty(obj.items) && _.isEmpty(obj.removed)){
					CloudClock.log("Info", "Items and Removed objects are empty for data set "+key);
					// CloudClock.maintenace_cfg.tablesChanged = false;
					return false;
				}
				//messages
				if('messageId' === key || 'messageType' === key){
					var message = Alloy.createModel('messages', {messageId: data.messageId, value: data.messageType});
					message.save();
				}
				//new table
				else if(!Alloy.Collections[key]){
					CloudClock.log('Info', 'Setting up new table: ' + key + '.');
					try{
						Alloy.Collections.instance(key);
						_.each(obj.items, function(model) {
							var tempModel = Alloy.createModel(key, model);
							
							tempModel.save();
							CloudClock.maintenace_cfg.tablesChanged = CloudClock.maintenace_cfg.tablesChanged+1;
						});
						CloudClock.log('Info', 'New tables set up.');
					}catch(error){
						CloudClock.error(error);
					}
				}
				//update existing table
				else{
					
					Alloy.Collections[key].fetch();

					// set the temporary "deleteMe" flag on each model in the collection
					if(data.messageType === 'INIT'){
						_.each(Alloy.Collections[key].models, function(model){
							model.set({deleteMe: 1});
						});
					}
					
					// next update the collection
					updateCollection(obj, key);
				}
			}catch(error){
				CloudClock.error(error);
			}
		});
		
        //POST THE SUCCESS MESSAGE
        CloudClock.api.request(CloudClock.initSuccess_cfg(data.messageId));

        //	GET PHOTOS IF tablesChanged param is true
        if(CloudClock.maintenace_cfg.tablesChanged && data.messageType === 'INIT'){
			console.log('About to get photos');
			Alloy.Collections.employees.getPhotos(initialize_cfg.params.termID);
        }else{
			CloudClock.dbSeeded.fetchParams(true); //fetch params and the logo
			hideActivityIndicator();
        }

        updateConnectionProps();

		// hideActivityIndicator();
	},
	onError: function(response){
		console.log('Error while performing a maintenance call: ' + JSON.stringify(response));
		CloudClock.log('Error', 'Error while performing a maintenance call: ' + JSON.stringify(response));

		hideActivityIndicator();

		if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
			CloudClock.managerOptions.maintCallError = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: 'Sorry, an error occurred while processing your request.',
				callback:{
					eType: 'click',
					action: function(_e){
						if(_e.source.id === this.cancel){
							CloudClock.managerOptions.maintCallError.hide.apply(CloudClock.managerOptions);
						}
					}
				}
			});

			CloudClock.managerOptions.maintCallError.show.apply(CloudClock.managerOptions);
		}
	}
};

CloudClock.getLogo_cfg = {
	endpoint: 'getLogo',
	params: {
		'logoImage': ''
	},
	onSuccess: function(response){
		try{
			if(response.error || response.photoData.indexOf('Unable') === 0){
				console.log('Error getting logo image: '+JSON.stringify(response));
				CloudClock.log('Error', 'Getting logo: ' + JSON.stringify(response));

				if(CloudClock.parent && CloudClock.parent !== null){
					// CHECK FOR LOCALLY SAVED IMAGE

					var localLogo = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'logo.png');

					if(localLogo.exists()){
						localLogo = localLogo.read();
						CloudClock.parent.largeLogo.setImage(Ti.Utils.base64decode(localLogo));
					}else{
						CloudClock.parent.largeLogo.setImage('/images/peoplenet-default-logo.png');
					}
					
					CloudClock.parent.largeLogo.setVisible(true);
				}
			}else{
				var logoPath = (OS_IOS) ? 'logo.png' : 'logo';
				var logoImg = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, logoPath);
				
				if(OS_IOS){
					logoImg.write(response.photoData);
				}else{
					logoImg.write((response.photoData).toString());
				}

				if(CloudClock.parent && CloudClock.parent !== null){
					CloudClock.parent.largeLogo.setImage(Ti.Utils.base64decode(response.photoData));
					CloudClock.parent.largeLogo.setVisible(true);
				}

				logoImg = null;
			}
		}catch(error){
			CloudClock.error(error);
		}
	},
	onError: function(response){
		console.log('Error getting logo. ' + JSON.stringify(response));
		CloudClock.log('Error', 'Error getting logo: ' + JSON.stringify(response));

		if(CloudClock.parent && CloudClock.parent !== null){
			CloudClock.parent.largeLogo.setImage('images/peoplenet-default-logo.png');
			CloudClock.parent.largeLogo.setVisible(true);
		}
	}
};

exports.initialize = function(_entryCallback){

	initialize_cfg.params.termID = _entryCallback;

	CloudClock.api.request(initialize_cfg);
};

