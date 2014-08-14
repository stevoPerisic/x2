//CLOCK HISTORY MODEL
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
			sent: "integer",
			employee_alloyID: "text",
			reasonCodeID: "integer",
			reasonCodeType: "integer",
			amount: "integer"
		},
		adapter: {
			// Using the sql adapter but will have to run a one minute interval fn to submit this data to the server if the network is available
			type: "sql",
			collection_name: "clockHistory"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			change: function(){
				console.log('\n\n\nFrom change in clock history function: '/*+JSON.stringify(this)*/);
			},
			validate: function(attrs, options){
				if(_.isNull(attrs.transTime) || _.isNaN(attrs.transTime)){
					return 'Tried to save punch history with transTime = null!';
				}
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			initialize: function(){
				console.log('Clock History initialized.');
			},
			removeHistory: function(){
				var that = this;

				CloudClock.log('Info', 'Checking for entries from Clock History older than 18 hours');

				var count = 0;
				var now = Math.round((new Date()).getTime());

				that.each(function(historyEntry){
					var then = historyEntry.get('transTime');
					var clockHistoryTime = moment.unix(then);

					if( (now - clockHistoryTime._i) > 64800000){ //if the clock history entry is older than 18hrs get rid of it
						//console.log("Now: " + moment(now).format('MM/DD h:mm a') + ", Clock history entry time: " + clockHistoryTime.format('MM/DD h:mm a'));
						//console.log('\n\nDestroying Clock histroy entry');
						try{
							historyEntry.destroy();
							count = count+1;
						}catch(error){
							CloudClock.error(error);
						}
					}
				});
				console.log('\n\n\nRemoved '+count+' entries from clock history.');
				CloudClock.log('Info', 'Removed ' + count + ' entries from Clock History');
			},
			getPreviousClockIns: function(_employeeAlloyID){
				var obj = {};
				var l = this.models.length;

				for(var i=0; i < l; i++){
					if(this.models[i].get('employee_alloyID') === _employeeAlloyID && this.models[i].get('transType') === 'I'){
						obj[i] = this.models[i];
						//console.log(JSON.stringify(obj));
					}
				}
				//console.log('\n\n\nPrevious clock ins to return: '+JSON.stringify(obj));
				return obj;
			},
			getPreviousClockOuts: function(_employeeAlloyID){
				var obj = {};
				var l = this.models.length;

				for(var i=0; i < l; i++){
					if(this.models[i].get('employee_alloyID') === _employeeAlloyID && this.models[i].get('transType') === 'O'){
						obj[i] = this.models[i];
						//console.log(JSON.stringify(obj));
					}
				}
				//console.log('\n\n\nPrevious clock outs to return: '+JSON.stringify(obj));
				return obj;
			},
			getLatestClockIn: function(_employeeAlloyID){
				var prevClockIns = this.getPreviousClockIns(_employeeAlloyID);
				var r = {};
				//console.log('\n\n\nIn clock history collection, prev. clock ins: '+JSON.stringify(prevClockIns));

				if(_.isEmpty(prevClockIns) !== true){
					var obj  = _.max(prevClockIns, function(model){
						return model.attributes.transTime;
					});

					r.transTime = obj.get('transTime');
					r.transDateTime = obj.get('transDateTime');
					r.departmentNum = obj.get('departmentNum');
					r.shiftID = obj.get('shiftID');
					return r;
				}else{
					r.transTime = 0;
					r.transDateTime = 0;
					r.departmentNum = 0;
					r.shiftID = 0;
					return r;
				}
			},
			getLatestClockOut: function(_employeeAlloyID){
				var prevClockOuts = this.getPreviousClockOuts(_employeeAlloyID);
				var r = {};
				//console.log('\n\n\nIn clock history collection, prev. clock outs: '+JSON.stringify(prevClockOuts));

				if(_.isEmpty(prevClockOuts) !== true){
					var obj  = _.max(prevClockOuts, function(model){
						return model.attributes.transTime;
					});
					
					r.transTime = obj.get('transTime');
					r.transDateTime = obj.get('transDateTime');
					r.departmentNum = obj.get('departmentNum');
					r.shiftID = obj.get('shiftID');
					return r;
				}else{
					r.transTime = 0;
					r.transDateTime = 0;
					r.departmentNum = 0;
					r.shiftID = 0;
					return r;
				}
			},
			getLatest: function(_employeeAlloyID){
				var r = {
					transTime: 0,
					transType: 0,
					departmentNum: 0,
					shiftID: 0,
				};

				if(this.length !== 0){
					var obj = _.chain(this.models)
								.filter(function(model){
									return model.attributes.employee_alloyID === _employeeAlloyID;
								})
								.max(function(model){
									return model.attributes.transTime;
								})
								.value();

					if(_.isObject(obj)){
						r.transTime = obj.get('transTime');
						r.transType = obj.get('transType');
						r.departmentNum = obj.get('departmentNum');
						r.shiftID = obj.get('shiftID');

						if(Ti.App.Properties.getString('SOFTSCHEDULING') === '1'){
							r.overrideFlag = obj.get('overrideFlag');
						}

						obj = null;
					}
				}

				return r;
			}
		});

		return Collection;
	}
};