exports.definition = {
	config: {
		columns: {
			"deptShiftID": "integer",
			"displayName": "text",
			"departmentNum": "integer",
			"shiftNum": "integer",
			"applyDay1": "text",
			"applyDay2": "text",
			"applyDay3": "text",
			"applyDay4": "text",
			"applyDay5": "text",
			"applyDay6": "text",
			"applyDay7": "text",
			"shiftStart": "text",
			"shiftEnd": "text",
			"applyBreak": "text",
			"workSpan1": "text",
			"breakLength1": "text",
			"workSpan2": "text",
			"breakLength2": "text",
			"inGraceMinutes": "integer",
			"earlyIn": "text",
			"veryEarlyIn": "text",
			"lateIn": "text",
			"lateOut": "text",
			"veryLateOut": "text",
			"earlyOut": "text",
			"lateInMins": "integer",
			"earlyOutMins": "integer",
			"earlyBreakIn": "text",
			"autoBreak": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "deptShifts"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			initialize: function(){
				//console.log('\n\n\nDepartment shifts initialize...');
			},
			// refactoring softScheduling
			findWithCurrentPunch: function(){

				function findShift(_shifts){
					var transType = CloudClock.sessionObj.currentPunch.transType;
					var actualTime = CloudClock.sessionObj.currentPunch.transDateTime;
					var applyDay = (moment(actualTime).day())+1; // adding one bcs PPLnet week starts with Sun = 1
					var actualTimeMins = (parseInt(actualTime.slice(11, 13), 10)*60)+parseInt(actualTime.slice(14, 16), 10);
					// var returnObj = {};
					var shiftWindow = (transType === 'I') ? parseInt(Ti.App.Properties.getString('SHIFTINWINDOW'), 10) : parseInt(Ti.App.Properties.getString('SHIFTOUTWINDOW'), 10);
					var outsideGraceWindow = parseInt(Ti.App.Properties.getString('OUTSIDEGRACE'), 10);

					var insideShiftWindow;
					var outsideGraceShift;
					var insideShiftWindow_2;
					var outsideGraceShift_2;
					var closestShift = [];

					var diff = 0;
					var diff_2 = 0;

					// look for shift within the shift IN/OUT window
					insideShiftWindow =
						_.chain(_shifts)
						.filter(function(shift){
							var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
							var absDiff = Math.abs(actualTimeMins - startOrEnd);
							var actDiff = actualTimeMins - startOrEnd;

							shift.set({'absDiff': absDiff, 'actDiff': actDiff});

							if(
								shift.get('applyDay'+applyDay) !== "0" &&
								shift.get('absDiff') >= 0 &&
								shift.get('absDiff') <= shiftWindow
							)
							{
								console.log(shift.get('departmentNum'));
								return shift;
							}
						})
						.sortBy(function(shift){ // sort shift table results by absolut difference
							return shift.get('absDiff');
						})
						.value();

					// have one shift?
					if(insideShiftWindow.length === 1){

						insideShiftWindow[0].set({insideShiftWindow: true});
						return insideShiftWindow;

					}else if(insideShiftWindow.length > 1){	// have more than one shift?

						diff = _.chain(insideShiftWindow).first().value().get('absDiff');  // get the difference for the closest shift

						// reduce the result set to only the shifts with the same difference
						insideShiftWindow_2 =
							_.chain(insideShiftWindow)
							.filter(function(shift){
								// filterShifts(shift, applyDay, transType, actualTimeMins, shiftWindow, diff);
								var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
								var absDiff = Math.abs(actualTimeMins - startOrEnd);
								var actDiff = actualTimeMins - startOrEnd;

								shift.set({'absDiff': absDiff, 'actDiff': actDiff});

								if(
									shift.get('applyDay'+applyDay) !== "0" &&
									shift.get('absDiff') >= 0 &&
									shift.get('absDiff') <= shiftWindow &&
									shift.get('absDiff') === diff
								)
								{
									console.log(shift.get('departmentNUm'));
									return shift;
								}
							})
							.value();

						return insideShiftWindow_2;

					}else{// no shifts? check outside grace window

						outsideGraceShift =
							_.chain(_shifts)
							.filter(function(shift){
								// findWithOutsideGrace(shift, applyDay, transType, actualTimeMins, outsideGraceWindow);
								var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
								var absDiff = Math.abs(actualTimeMins - startOrEnd);
								var actDiff = actualTimeMins - startOrEnd;

								shift.set({'absDiff': absDiff, 'actDiff': actDiff});

								if(
									shift.get('applyDay'+applyDay) !== "0" &&
									shift.get('absDiff') >= 0 &&
									shift.get('absDiff') <= outsideGraceWindow
								)
								{
									console.log(shift.get('departmentNum'));
									return shift;
								}
							})
							.sortBy(function(shift){
								return shift.get('departmentNum');
							})
							.sortBy(function(shift){
								return shift.get('absDiff');
							})
							.value();

						if(outsideGraceShift.length === 1){

							outsideGraceShift[0].set({outsideGraceShift: true});
							return outsideGraceShift;

						}else if(outsideGraceShift.length > 1){

							diff_2 = _.chain(outsideGraceShift).first().value().get('absDiff');  // get the difference for the closest shift

							// reduce the result set to only the shifts with the same difference
							outsideGraceShift_2 =
								_.chain(outsideGraceShift)
								.filter(function(shift){
									// filterShifts(shift, applyDay, transType, actualTimeMins, outsideGraceWindow, diff_2);
									var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
									var absDiff = Math.abs(actualTimeMins - startOrEnd);
									var actDiff = actualTimeMins - startOrEnd;

									shift.set({'absDiff': absDiff, 'actDiff': actDiff});

									if(
										shift.get('applyDay'+applyDay) !== "0" &&
										shift.get('absDiff') >= 0 &&
										shift.get('absDiff') <= outsideGraceWindow &&
										shift.get('absDiff') === diff_2
									)
									{
										console.log(shift.get('departmentNum'));
										return shift;
									}

								})
								.value();

							return outsideGraceShift_2;

						}else{// no outside grace shift?
							// find the closest shift within this departments schedule
							closestShift.push(
								_.chain(_shifts)
								.filter(function(shift){
									var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
									var absDiff = Math.abs(actualTimeMins - startOrEnd);
									var actDiff = actualTimeMins - startOrEnd;

									shift.set({'absDiff': absDiff, 'actDiff': actDiff});

									if(
										shift.get('applyDay'+applyDay) !== "0" &&
										shift.get('absDiff') >= 0
									)
									{
										console.log(shift.get('departmentNum'));
										return shift;
									}
								})
								.sortBy(function(shift){
									return shift.get('absDiff');
								})
								.first()
								.value()
							);
							
							if(_.isUndefined(closestShift[0])){
								return false;
							}else{
								return closestShift;
							}
							// return closestShift;
						}
					}
				}

				try{
					// first let's finde shifts for this particular department
					var deptShifts = this.where({departmentNum: CloudClock.sessionObj.currentPunch.departmentNum});
					var retObj;

					function getDept9999shifts(){
						var dept9999Shifts = Alloy.Collections.deptShifts.where({departmentNum: 9999});
						return findShift(dept9999Shifts);
					}

					// do we have any?
					if(deptShifts.length !== 0){

						retObj = findShift(deptShifts);
						if(!retObj){
							// var dept9999Shifts = this.where({departmentNum: 9999});

							// return findShift(dept9999Shifts);
							retObj = getDept9999shifts();
							return retObj;
						}else{
							return retObj;
						}
						// return findShift(deptShifts);

					}else{
						// find dept 9999 shifts;
						// var dept9999Shifts = this.where({departmentNum: 9999});
						// need to change the department in the sessionObj so that the employee knows they are 
						// punching in to the dept 9999
						
						// return findShift(dept9999Shifts);

						retObj = getDept9999shifts();
						return retObj;
					}
				}catch(error){
					CloudClock.error(error);
				}
			},
			findByID: function(_shiftID){
				var transType = CloudClock.sessionObj.currentPunch.transType;
				var actualTime = CloudClock.sessionObj.currentPunch.transDateTime;
				var applyDay = (moment(actualTime).day())+1; // adding one bcs PPLnet week starts with Sun = 1
				var actualTimeMins = (parseInt(actualTime.slice(11, 13), 10)*60)+parseInt(actualTime.slice(14, 16), 10);
				var shift = _.chain(this.models)
							.filter(function(shift){
								var startOrEnd = parseInt(((transType === 'I') ? shift.get('shiftStart') : shift.get('shiftEnd')), 10);
								var absDiff = Math.abs(actualTimeMins - startOrEnd);
								var actDiff = actualTimeMins - startOrEnd;

								shift.set({'absDiff': absDiff, 'actDiff': actDiff});

								// here is a bit of a pickle
								// what if someone is trying to punch the shift that is not valid for that day and we have 
								// a transaction that is less tha 36 hours old and contains a shift ID?
								// maybe I'm complication too much.....

								return shift.get('deptShiftID') === _shiftID;
							}).value();

				return shift;
			}

		});

		return Collection;
	}
};