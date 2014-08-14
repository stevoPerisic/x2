var api = require('api');

function setLoaderText_and_fetchHelpFiles(){
	if(CloudClock.parent && CloudClock.parent !== null){
		CloudClock.parent.activityIndicator.setMessage('Getting help files...');
	}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
		CloudClock.managerOptions.activityIndicator.setMessage('Getting help files...');
	}
	Alloy.Collections.deviceHelp.getHelpFiles();
}

exports.definition = {
	config: {
		columns: {
			badge: "integer",
			pin: "integer",
			name: "text",
			primaryDeptNum: "integer",
			mostUsedDeptNum: "integer",
			allowOpenDept: "numeric",
			byPassBio: "numeric",
			requestPTO: "numeric",
			scheduleReport: "text",
			replyTo: "text",
			lang: "text",
			fixPunch: "numeric",
			cellPhone: "text",
			cellCarrier: "text",
			email: "text",
			isBioRegistered: "numeric",
			type1: "text",
			type2: "text",
			photoFileName: "text",
			photoData: "text"
		},
		defaults:{
			badge: 0,
			pin: 0,
			name: "Model Default",
			primaryDeptNum: 0,
			lang: "en_us",
			photoFileName: "/images/icons/no-photo-256-gray.png"
		},
		adapter: {
			type: "sql",
			collection_name: "employees"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(){
				if(this.get('badge') === 0){
					this.removeNewEmployee(this);
				}
			},
			change: function(){
				var changes = this.changedAttributes();
				// console.log('Employee ' + this.get('name') + ', changed attributes: ' + JSON.stringify(changes));

				if(changes.photoFileName){
					// console.log('\n\n\nChanged master photo for '+this.attributes.name+', badge number: '+this.attributes.badge);
					
					this.attributes.photoFileName = (OS_IOS) ?
						this.attributes.photoFileName.replace("\\", "/") :
						this.attributes.photoFileName.replace("\\", "/").replace(".jpg", "");


					// console.log('get new photo...');

				}
			},
			getPhoto: function(_badge, _photoFileName){
				this.collection.employeePhotos_cfg.payload.request.photos = [];
				var tempObj = {
					"employeeBadge": _badge,
					"photoData": _photoFileName
				};
				this.collection.employeePhotos_cfg.payload.request.photos.push(tempObj);
				api.request(this.collection.employeePhotos_cfg);
			},
			removeNewEmployee: function(that){
				//console.log('Start the new employee removal interval');
				//going to start a timer based on the employee alloy_id here
				//the timer it self will be a configurable setting from the clock parameters but for now we will hardcode to 26 hours
				that.removeTimer = 0;
				that.removeTimer = setInterval(function(){
					console.log('About to destroy: ' + that.get('name'));
					that.destroy({
						success: function(){
							console.log('model successfuly destroyed.');
							CloudClock.log('Info', "New employee " + that.get('name') + " removed from local database.");
							clearInterval(that.removeTimer);
						},
						error: function(err){
							console.log(err);
							CloudClock.log('Error', "Error removing the new employee: " + that.get('name'));
						}
					});
				}, 93600000);
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			employeePhotos_cfg: {
				endpoint: 'getPhotos',
				params: {},
				payload: {
					request: {
						'photos': []
					}
				},
				onSuccess: function(response){
					var l = response.length;
					var employee;

					try{
						if(response.error){
							CloudClock.log('Error', 'Server responded to Get Photos request with: ' + JSON.stringify(response));
							setLoaderText_and_fetchHelpFiles();
						}else{
							var masterPicsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'MasterPhoto');
							if(!masterPicsDir.exists()){
								masterPicsDir.createDirectory();
							}

							for(var i = 0; i < l; i++){

								employee = Alloy.Collections.employees.where({badge: response[i].employeeBadge});

								if(!employee[0]){
									// console.log('no employee with badge number: ' + response[i].employeeBadge);
									CloudClock.log('Error', 'During photo retrieval employee with badge number: '+response[i].employeeBadge+' could not be found!');
								}else{

									if(response[i].photoData === 'Unable to retrieve photo'){
										// console.log('Error: ' + response[i].photoData +', will set the photo URL for '+employee[0].get('name')+' to default pic.');
										employee[0].save({photoFileName: '/images/icons/no-photo-256-gray.png'});
									}else{
										// console.log('Saving photo for employee: ' + employee[0].get('name'));
										
										var masterFilePath = (OS_IOS) ? response[i].employeeBadge + '.jpg' : response[i].employeeBadge;
										var masterPicture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'MasterPhoto/'+masterFilePath);
										try{
											if(masterPicture.exists())
												masterPicture.deleteFile();

											if(OS_IOS){
												masterPicture.write(response[i].photoData);
											}else{
												masterPicture.write((response[i].photoData).toString());
											}
										}
										catch(error){
											CloudClock.error(error);
										}

										employee[0].save({photoFileName: 'MasterPhoto/' + masterFilePath});

										masterPicture = null;
										masterFilePath = null;
									}
								}
							}
						}

						
						setLoaderText_and_fetchHelpFiles();

						//G.C.
						employee = null;
						response = null;
					}
					catch(error){
						CloudClock.error(error);
						setLoaderText_and_fetchHelpFiles();
					}
				},
				onError: function(response){
					Ti.API.error('Error: ' + JSON.stringify(response));
					CloudClock.log('Error', 'Server responded to Get Photos request with: ' + JSON.stringify(response));
					
					CloudClock.parent.activityIndicator.hide();
					CloudClock.parent.activityIndicator.setMessage('Loading...');
					
					Alloy.Collections.deviceHelp.getHelpFiles(Alloy.Collections.employees.employeePhotos_cfg.params.termID);
				}
			},
			initialize: function(){
				console.log('Employees Collection innitialized, have to get the master photos if they exist!');
			},
			searchByPin: function(employeePin){

				var arr = [];
				for(var i = 0; i < this.models.length; i++ ){
					if(this.models[i].get('pin') === employeePin){
						arr.push(this.models[i]);
					}
				}
				return arr;
			},
			getPhotos: function(terminalID){
				if(CloudClock.parent && CloudClock.parent !== null){
					CloudClock.parent.activityIndicator.setMessage('Getting photos...');
				}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
					CloudClock.managerOptions.activityIndicator.setMessage('Getting photos...');
				}

				this.employeePhotos_cfg.payload.request.photos = [];

				for (var i = 0; i < this.models.length; i++){
					if(this.models[i].get('photoFileName')){
						var tempObj = {
							"employeeBadge": this.models[i].get('badge'),
							"photoData": this.models[i].get('photoFileName')
						};
						this.employeePhotos_cfg.payload.request.photos.push(tempObj);
					}
				}

				this.employeePhotos_cfg.qryStr = '';

				console.log('Getting photos! cfg: ' + JSON.stringify(this.employeePhotos_cfg));
				// CloudClock.log('Info', 'Getting photos! cfg: ' + JSON.stringify(this.employeePhotos_cfg));
				this.employeePhotos_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				api.request(this.employeePhotos_cfg);
			},
			sendBatchPhotos_cfg: {
				endpoint: 'postPhotos_batchMode',
				params: {},
				payload: {
					transactionRequest:{
						photos: []
					}
				},
				onSuccess: function(response){
					console.log('Success response from postPhotos_batchMode: '+JSON.stringify(response));
				},
				onError: function(response){
					console.log('Error response from postPhotos_batchMode: '+JSON.stringify(response));
				}
			},
			sendPhotos_batchMode: function(){
				// this is used to send photos in batch mode if soft scheduling is enabled and the camera is enabled
				// probably need a temp object to hold the pics and than at the comm interval send them up
				//
				// - need to get the picture files from the BatchModePhotos directory
				// - create picture objects
				// something like:
				// payload.punch.photo = {
				//		employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge
				//		photoTime: CloudClock.sessionObj.currentPunch.photoTime,
				//		photoData: CloudClock.sessionObj.currentPunch.photoData
				// }
				// where the bdage and photo time would come from the name of the file or something

				var that = this;
				var batchModePhotosDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'BatchModePhotos');
				if(batchModePhotosDir.exists()){
					var listing = batchModePhotosDir.getDirectoryListing();
					// console.log('Listing array: '+JSON.stringify(listing));

					for (var i = 0; i < listing.length; i++) {
						var tempFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory+'BatchModePhotos', listing[i]);
						// console.log('Name: '+tempFile.name);
						// console.log('Is file? '+tempFile.isFile());
						// console.log('Size: '+tempFile.getSize());

						var index = tempFile.name.indexOf('_');
						var endOfName = tempFile.name.indexOf('.');
						var employeeBadge = tempFile.name.substring(0, index);
						var photoTime = tempFile.name.substring(index+1, endOfName);
						// console.log('Employee badge: '+employeeBadge);
						// console.log('Photo time: '+photoTime);
						var photoData = tempFile.read();
						// console.log('Data: '+data);
						//
						// add contents to the photo object
						var tempObj = {
							employeeBadge: employeeBadge,
							photoTime: photoTime,
							photoData: photoData.toString()
						};

						that.sendBatchPhotos_cfg.payload.transactionRequest.photos.push(tempObj);
						// ...
						// delete file - well perhaps check network connection first....
						tempFile.deleteFile();
					}

					

					// var that = this;
					// make the API call
					// console.log(that.sendBatchPhotos_cfg);
					if(that.sendBatchPhotos_cfg.payload.transactionRequest.photos.length !== 0){
						api.request(that.sendBatchPhotos_cfg);
						that.sendBatchPhotos_cfg.payload.transactionRequest.photos = [];
					}
				}else{
					// CloudClock.log('Info', 'bacthModePhotosDir does not exists, exiting...');
					return false;
				}
				
			}
		});

		return Collection;
	}
};



