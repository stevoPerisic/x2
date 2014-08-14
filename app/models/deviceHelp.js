var api = require('api');

exports.definition = {
	config: {
		columns: {
			"id": "integer",
			"language": "text",
			"helpText": "text",
			"helpAudioFile": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "deviceHelp"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(){
				//console.log('device help model innitialized.');

				// if(this.attributes.helpAudioFile !== ""){
				// 	deviceHelp_cfg.payload.request.helpFiles.push({
				// 		"helpAudioFile": this.attributes.helpAudioFile,
				// 		"data": ""
				// 	});
				// }
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			//	SAMPLE REQUEST FOR THE PHOTOS IT IS A "POST": 				
			//{
			//     "request": {
			//         "helpFiles": [{
			//             "helpAudioFile": "\\help\\EN_1100.MP3",
			//             "data": ""
			//         }]
			//     }
			// }
			numOfResponses: 0,
			numOfRequests: 0,
			responseRecieved: false,
			deviceHelp_cfg: {
				endpoint: 'getHelpFiles',
				params: {},
				payload: {
					request: {
						'helpFiles': [{
							'data': ''
						}]
					}
				},
				onSuccess: function(response){

					var l = response.length;
					var helpFileName = '';
					var helpFilePath = '';
					var helpFile = {};

					try{
						if(response.error){
							console.log('Error getting help file: ' + JSON.stringify(response));
							CloudClock.log('Error', 'Error getting help file: ' + JSON.stringify(response));

							if(CloudClock.parent && CloudClock.parent !== null){
								CloudClock.parent.activityIndicator.hide();
								CloudClock.parent.activityIndicator.setMessage('Loading...');
							}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
								CloudClock.managerOptions.activityIndicator.setMessage('Getting help files...');
								CloudClock.managerOptions.activityIndicator.setMessage('Loading...');
							}

							Ti.App.Properties.setString("seeded", "yes");

							CloudClock.dbSeeded.fetchParams(true); // fetch params and the logo
							CloudClock.dbSeeded.fetchLocalData();
						}
						else{

							Alloy.Collections.deviceHelp.numOfResponses = Alloy.Collections.deviceHelp.numOfResponses + response.length;

							if(CloudClock.parent && CloudClock.parent !== null){
								CloudClock.parent.activityIndicator.setMessage('Getting help files...'+Alloy.Collections.deviceHelp.numOfResponses+' of '+Alloy.Collections.deviceHelp.numOfRequests);
							}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
								CloudClock.managerOptions.activityIndicator.setMessage('Getting help files...'+Alloy.Collections.deviceHelp.numOfResponses+' of '+Alloy.Collections.deviceHelp.numOfRequests);
							}

							var helpFilesDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'helpFiles');

							console.log('Does our Help files folder exist? '+helpFilesDir.exists());

							// doing it this way because we have multiple calls to the server
							// if you delet the dir than all the files are gone and we are left with only the last batch of help files...
							if(helpFilesDir.exists() === false){
								console.log('\n No it does not exist create it.');
								helpFilesDir.createDirectory();
							}

							for(var i = 0; i < l; i++){
								// console.log('In the save help file loop, Response length: ' + l + ', i: ' + i);
								try{
									if(response[i].data !== "Unable to retrieve help file"){
										// rename the file
										helpFileName = response[i].helpAudioFile.replace('\\help\\CloudClockPlus\\', '');
										helpFileName = helpFileName.replace('.MP3', '');
										// set the path
										helpFilePath = helpFileName + '.mp3';
										// get a hold of a still non existing file
										helpFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, helpFilePath);
										if(helpFile.exists()){
											console.log('\n If it does delete it.');
											helpFile.deleteFile();
										}
										// write our data to it
										helpFile.write(Ti.Utils.base64decode(response[i].data));
										// check if a previus version exists already
										var prevVersion = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'helpFiles/' + helpFilePath);
										if(prevVersion.exists()){
											console.log('\n If it does delete it.');
											prevVersion.deleteFile();
											prevVersion = null;
										}
										// move it 
										helpFile.move('helpFiles/' + helpFilePath);
										// delete the temp file
										helpFile.deleteFile();
										helpFile = null;
									}else{
										// CloudClock.log('Error', response[i].data+', '+response[i].helpAudioFile);
										console.log(response[i].data);
									}
								}
								catch(error){
									CloudClock.error(error);
								}
							}

							if(Alloy.Collections.deviceHelp.numOfResponses === Alloy.Collections.deviceHelp.numOfRequests){

								Alloy.Collections.deviceHelp.numOfResponses = 0;
								Alloy.Collections.deviceHelp.numOfRequests = 0;

								if(CloudClock.parent && CloudClock.parent !== null){
									CloudClock.parent.activityIndicator.hide();
									CloudClock.parent.activityIndicator.setMessage('Loading...');
								}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
									CloudClock.managerOptions.activityIndicator.hide();
									CloudClock.managerOptions.activityIndicator.setMessage('Loading...');
								}

								Ti.App.Properties.setString("seeded", "yes");

								CloudClock.dbSeeded.fetchParams(true); //fetch params and the logo
								CloudClock.dbSeeded.fetchLocalData();

								// set the index screen saver to enabled again
								CloudClock.clock.showScreenSaver = true;
							}
							else
							{
								Alloy.Collections.deviceHelp.sendRequest();
							}
						}
					}catch(error){
						CloudClock.error(error);
						Ti.App.Properties.setString("seeded", "yes");

						CloudClock.dbSeeded.fetchParams(true); //fetch params and the logo
						CloudClock.dbSeeded.fetchLocalData();

						// set the index screen saver to enabled again
						CloudClock.clock.showScreenSaver = true;
					}
					
				},
				onError: function(response){
					console.log('there was an error in getting help files: ' + JSON.stringify(response));
					CloudClock.log('Error', 'There was an error in getting help files: ' + JSON.stringify(response));

					if(CloudClock.parent && CloudClock.parent !== null){
						CloudClock.parent.activityIndicator.setMessage('Done processing the help files...');
						CloudClock.parent.activityIndicator.hide();
						CloudClock.parent.activityIndicator.setMessage('Loading...');
					}else if(CloudClock.managerOptions && CloudClock.managerOptions !== null){
						CloudClock.managerOptions.activityIndicator.setMessage('Done processing the help files...');
						CloudClock.managerOptions.activityIndicator.hide();
						CloudClock.managerOptions.activityIndicator.setMessage('Loading...');
					}

					Ti.App.Properties.setString("seeded", "yes");

					CloudClock.dbSeeded.fetchParams(true); //fetch params and the logo
					CloudClock.dbSeeded.fetchLocalData();
				}
			},
			initialize: function(){
				console.log('device help collection innitialized, Number of models: ' + this.length);
			},
			modifiedRequest: [],
			sendRequest: function(){
				var that = this;
				try{
					// add the queued up objects to the request
					that.deviceHelp_cfg.payload.request.helpFiles = that.modifiedRequest[0];
					// remove the from queue
					that.modifiedRequest.splice(0,1);

					// make the call
					that.deviceHelp_cfg.params.termID = Ti.App.Properties.getString('TERMID');
					api.request(that.deviceHelp_cfg);
				}catch(error){
					CloudClock.error(error);
				}
			},
			getHelpFiles: function(terminalID){
				try{
					var that = this;
					var l = that.models.length;
					var tempArr = [];
					var tempObj = {};
					var chunkSize = 10;

					for (var i = 0; i < l; i++){

						if(that.models[i].get('helpAudioFile') !== ''){
							tempObj = {
								"helpAudioFile": that.models[i].get('helpAudioFile'),
								"data": ""
							};

							tempArr.push(tempObj);
						}

						if(tempArr.length === chunkSize){

							that.modifiedRequest.push(tempArr);

							that.numOfRequests = that.numOfRequests + chunkSize;
							tempArr = [];
						}
						
						if(i === (l-1)){

							if(tempArr.length !== 0){
								that.modifiedRequest.push(tempArr);
								that.numOfRequests = that.numOfRequests + tempArr.length;
							}

							that.sendRequest();
						}
					}
				}catch(error){
					CloudClock.error(error);
				}
			},
			audioPlayer: {
				docsDir: Ti.Filesystem.getApplicationDataDirectory(),
				viewNo: false,
				formatLang: function(language){
					if(language === 'EN' || language === 'en-us' || language === 'en_us' || language === 'en-US'){
						//console.log('English');
						return 'EN';
					}else if(language === 'es'){
						//console.log('Spanish');
						return 'ES';
					}else if(language === 'fr'){
						//console.log('French');
						return 'FR';
					}else{
						//console.log('English');
						return 'EN';
					}
				},
				play: function(){
					// language, viewNo
					var language = 'EN'; // needs to be dynamic get from employee settings
					try{
						if(CloudClock.sound)
							CloudClock.sound.stop();

						var that = Alloy.Collections.deviceHelp.audioPlayer;
						var soundLang = that.formatLang(language);
						CloudClock.sound = false;

						// check if the help audio file exists
						var helpfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'helpFiles/' + soundLang + '_' + that.viewNo + '.mp3');

						if(helpfile.exists() && CloudClock.playHelp){

							CloudClock.sound = Titanium.Media.createSound({
								url:that.docsDir + 'helpFiles/' + soundLang + '_' + that.viewNo + '.mp3' // could be http url too!
							});

							CloudClock.sound.play();
						}
					}catch(error){
						console.log('Help player play fn: '+error);
						CloudClock.error(error);
					}
				}
			}
		});

		return Collection;
	}
};