//**************************************************
//*******	DEPARTMENT SELECTION MASTER  CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};

try{
	(function(){

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'departmentSelection', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function destroy(){

			$.destroy();

			$.departmentSelection.removeAllChildren();

			$.departmentSelection.removeEventListener('close', destroy);
			$.departmentSelection.removeEventListener('touchstart', restartTimeout);

			department = null;
			departmentBadgeProps = null;
			departmentsSelection = null;
			departmentsSelectionLength = null;
			employeeDepartments = null;
			softScheduling = null;
			previousClockIns = null;

			sessionObj = null;

			$ = null;
		}

		function emptyFn(e){
			e.source.removeEventListener('doubletap', emptyFn);
			return false;
		}

		function changeLabelColor(e){

			e.source.removeEventListener(e.type, changeLabelColor);

			if(e.type === 'touchstart')
			{
				e.source.backgroundColor = "#34aadc";
			}
			else
			{
				e.source.backgroundColor = "#fff";
			}
		}

		function changeColor(e){
			e.source.removeEventListener(e.type, changeColor);

			if(e.type === 'touchstart')
			{
				e.source.backgroundColor = "#34aadc";
			}
			else
			{
				e.source.backgroundColor = "#62bb47";
			}
		}

		function applyDeptNum(_departmentNum){

			sessionObj.currentPunch.departmentNum = _departmentNum;
			if(checkRestrictions()){
				// // do soft scheduling here, not comfortable with doing it on the camera screen
				// softScheduling.inPunch();
				sessionObj.nextWindow = "";
				CloudClock.dispatcher.nextWindow({
					context: $
				});
			}
		}

		// *******************************************************
		// for the function below
		// the parameter of value here is USEDEPTCODE
		// if this is turned on i.e is equal to "1"
		// we should ONLY use the departmentCode parameter of the
		// department object to find the departments
		// otherwise use the departmentNum
		// *******************************************************
		function departmentSelected(e){

			function alertAndReset(){
				$.openDepartmentAlert = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('openDept_alert'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								$.pinPad.clearPinPadTxtField();
								$.pinPad.addBtnEvents();
								$.openDepartmentAlert.hide.apply($);
							}
						}
					}
				});
				$.openDepartmentAlert.show.apply($);
			}

			// to store our department number
			var departmentNum = false;

			try{
				// DEPTCODELEN is the parameter on which we check the dept number entered for the open department
				if(e.id === "pinPadTxtField"){
					departmentNum = e.value;
					var n = departmentNum.match(/[0-9]/g);
					var match;

					if(n){
						console.log('this is a valid entry');

						departmentNum = parseInt(departmentNum, 10);

						match = Alloy.Collections.departments.filter(function(department){
							return department.get('departmentNum') === departmentNum ||
								department.get('departmentCode') === departmentNum;
						});

						if(match.length === 0){
							alertAndReset();
						}else{
							// it is possible to get a result set of two or more departments in the match array
							// depending on the client set-up
							// we will always pick the first department in this result set
							applyDeptNum(match[0].get('departmentNum'));
						}
					}else{
						console.log('this is an invalid entry');
						alertAndReset();
					}
				}else if(e.source.id === "submitOpenDept" && departmentNum === false){
					// if the employee pressed the submit department green button and the value of the 
					// departmentNum is false, we have to propmt for re entry
					alertAndReset();
				}else{
					departmentNum = e.source.deptNumber;
					applyDeptNum(departmentNum);
				}

			}catch(error){
				CloudClock.error(error);
			}
		}

		function checkRestrictions(){
			if(CloudClock.punchRestrictions.inPunch()){
				// no restrictions keep going
				console.log('No restrictions!');
				return true;
			}else{
				// alert of restriction
				console.log('Yes restrictions!');
				if(sessionObj.restrictionDialog === 3){// INOUT restriction
					// tell them how much longer they have until they can clock back in
					var untilCanGoBackIn = clockInOut.restrictionINOUT - sessionObj.difference;

					$.restrictionINOUT_dialog = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('cantGoBackIn')+(moment(untilCanGoBackIn).format('mm [minutes.]')),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									$.restrictionINOUT_dialog.hide.apply($);

									CloudClock.sessionObj.clearSession();

									CloudClock.clock.showEmployeeFlowDialog = false;
					
									Alloy.createController('index', {doNotSetParams: true});

									$.departmentSelection.close();
								}
							}
						}
					});
					$.restrictionINOUT_dialog.show.apply($);
				}else{
					$.restrictionIN_dialog = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('alreadyClockedIn')+
						CloudClock.buttonLabelTime(sessionObj.last_inPunch.transDateTime).format('h:mm a'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									$.restrictionIN_dialog.hide.apply($);

									CloudClock.sessionObj.clearSession();

									CloudClock.clock.showEmployeeFlowDialog = false;
					
									Alloy.createController('index', {doNotSetParams: true});

									$.departmentSelection.close();
								}
							}
						}
					});

					$.restrictionIN_dialog.show.apply($);
				}

				return false;
			}
		}

		function addEvents(){
			$.departmentSelection.addEventListener('close', destroy);
			$.departmentSelection.addEventListener('open', function(){
				restartTimeout();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
			$.departmentSelection.addEventListener('touchstart', restartTimeout);

			$.pinPadWrap.addEventListener('touchend', function(){
				$.badgeWrap.remove($.lastUsedLbl);
				$.badgeWrap.remove($.lastUsed);
				$.badgeWrap.remove($.mostUsedLbl);//mostUsedLbl
				$.badgeWrap.remove($.mostUsed);//mostUsed
			});
		}

		function updateUI(){

			var USEDEPTCODE = Ti.App.Properties.getString('USEDEPTCODE');
			var DEPTCODELEN = Ti.App.Properties.getString('DEPTCODELEN');
			var DEPTNUMLEN = 3; // always 3, PeopleNet setting :)
			
			function createDeptBadge(_parent, _departmentsLength, _departmentsSelection){

				for(var i = 0; i < _departmentsLength; i++){

					var department = (_.isArray(_departmentsSelection[i])) ? _departmentsSelection[i][0] : _departmentsSelection[i];

					var departmentBadge = Ti.UI.createLabel(departmentBadgeProps);
					var deptNum =  (department.get('departmentNum')).toString();
					if(deptNum.length != Ti.App.Properties.getString('DEPTCODELEN').length){
						var diffInLength = Ti.App.Properties.getString('DEPTCODELEN').length - deptNum.length;
						
						for(var j=0; j<diffInLength; j++){
							deptNum = '0'+deptNum;
						}
						
					}
					var deptName = department.get('name');
					var n = deptName.match(/(\w+)/g); // match words in a name
					if(n){
						deptName = '';
						_.each(n, function(word, k){
							if(k === 2){
								deptName = deptName + '\n' + word;
							}else{
								deptName = deptName + ' ' + word;
							}
						});
					}

					// departmentBadge.text = department.get('name') + ' (' +  department.get('departmentNum')+')';
					departmentBadge.text = deptName + ' (' + deptNum + ')';

					departmentBadge.deptNumber = department.get('departmentNum');

					departmentBadge.addEventListener('touchstart', changeLabelColor);

					departmentBadge.addEventListener('touchend', changeLabelColor);

					departmentBadge.addEventListener('click', departmentSelected);

					departmentBadge.addEventListener('doubletap', emptyFn);

					_parent.add(departmentBadge);

					departmentBadge = null;
				}

				_departmentsSelection = null;

				// hide the indicator that was shown in the reduceDpartments
				$.activityIndicator.hide();
			}

			function reduceDepartments(e){
				$.activityIndicator.show();
				// *******************************************************
				// the parameter of value here is USEDEPTCODE
				// if this is turned on i.e is equal to "1"
				// we should ONLY use the departmentCode parameter of the
				// department object to find the departments
				// otherwise use the departmentNum
				// *******************************************************
				// var USEDEPTCODE = Ti.App.Properties.getString('USEDEPTCODE');
				// var DEPTCODELEN = Ti.App.Properties.getString('DEPTCODELEN');
				// var DEPTNUMLEN = 3; // always 3, PeopleNet setting :)
				var pinPadEntry = e.value; // parseInt(e.value, 10);
				// the issue that we have below is that the dept nums or dept codes might start with zeros
				// but since they are integers they won't have leading zeros so let's do it like this
				// check the DEPTCODELEN to determine if we need to add zeros to the start of the number
				// *************************************************************************
				// if we are checking by dept num the length of that will ALWAYS be 3!!!!!
				// *************************************************************************
				var departments = (USEDEPTCODE !== '0') ?
					Alloy.Collections.departments.filter(function(department){// use department code
						var code = department.get('departmentCode').toString();

						if(code.length < DEPTCODELEN){
							var diffInLength = DEPTCODELEN.length - code.length;
						
							for(var j=0; j<diffInLength; j++){
								code = '0'+code;
							}
						}

						// return code.indexOf(pinPadEntry) === 0;
						return code.indexOf(pinPadEntry) !== -1;
					})
					:
					Alloy.Collections.departments.filter(function(department){// use department number

						var num = department.get('departmentNum').toString();

						if(num.length < DEPTNUMLEN){
							var diffInLength = DEPTNUMLEN - num.length;
						
							for(var j=0; j<diffInLength; j++){
								num = '0'+num;
							}
						}
						// return num.indexOf(pinPadEntry) === 0;
						return num.indexOf(pinPadEntry) !== -1;
					});

				// alert(departments.length);
				departments = departments.slice(0,9);

				// we now have an Array of depts, let's fill up the sidebar
				// 1) empty the sidebar
				$.sideBarBadgeHolder.removeAllChildren();
				// $.searchResults.removeAllChildren();
				// 2) populate
				createDeptBadge($.sideBarBadgeHolder, departments.length, departments);
				// createDeptBadge($.searchResults, departments.length, departments);
			}

			var OPENDEPT = Ti.App.Properties.getString('OPENDEPT');

			$.header.helpButton.show();

			if(department.length > 0)
				departmentsSelection.push(department); // employee's primary department goes in first
			// now add any secondary departments they might have based on the employeeDepts table
			_.each(employeeDepartments, function(department){
				var temp = Alloy.Collections.departments.where({departmentNum: department.get('departmentNum')});
				if(temp.length > 0)
					departmentsSelection.push(temp);
			});
			var departmentsSelectionLength = departmentsSelection.length;

			var departmentBadgeProps = {
				backgroundColor: '#fff',
				borderWidth: 1,
				borderColor: '#e4e4e4',
				font: {
					fontSize: '22dp',
					fontWeight: 'bold'
				},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				color: '#333'
			};

			// determine which departments screen to show based on employee setting "allowOpenDept"
			if(OPENDEPT === '1' || sessionObj.employee.get('allowOpenDept') === '1' || sessionObj.employee.get('allowOpenDept') === 1){
				//console.log('\n\nOpen departments set for the employee.');

				// adding view number for the help audio files
				Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1401';

				// remove unnecessary UI elements
				$.content.remove($.departments);

				// $.pinPad.changeMode({mode: 'openDepartment', departmentSelected: departmentSelected});
				$.pinPad.changeMode({mode: 'openDepartment', reduceDepartments: reduceDepartments});
				$.pinPad.pinPadTxtField.addEventListener('change', restartTimeout);

				$.openDepts.setVisible(true);

				//set language
				$.sidebarHeader.setText(CloudClock.customL.strings('openDept_sidebarHeader'));
				$.contentHeader.setText(CloudClock.customL.strings('openDept_contentHeader'));

				if(OS_IOS){
					$.header.helpButton.applyProperties({
						employeeLang: Ti.App.Properties.getString('CURRLANGUAGETYPE'),
						viewNo: '1801'
					});
				}else{
					$.header.helpButton.employeeLang = Ti.App.Properties.getString('CURRLANGUAGETYPE');
					$.header.helpButton.viewNo = '1801';
				}

				// apply properties to the departmentBadge 
				_.extend(departmentBadgeProps, {
					top: 10,
					left: '5%',
					height: '70dp',
					width: '90%',
					borderRadius: 10,
					borderColor: '#34aadc',
					font: {
						fontSize: '16dp',
						fontWeight: 'bold'
					}
				});

				// if(departmentsSelectionLength === 0){
				// 	// $.openDepartmentInstructions.setText(CloudClock.customL.strings('openDept_textField'));
				// 	console.log('Just one department?');
				// }else if(departmentsSelectionLength < 8){
				// 	// we can currently show 7 departments in the sidebar without the need to scroll
				// 	// turn off the scroll view
				// 	$.sideBarDeptBadgeWrap.scrollingEnabled = false;
				// 	createDeptBadge($.sideBarBadgeHolder, departmentsSelectionLength, departmentsSelection);
				// }else{
				// 	// proceed with scroll view
				// 	createDeptBadge($.sideBarBadgeHolder, departmentsSelectionLength, departmentsSelection);
				// }

				// NEW OPEN DEPARTMENTS FUNCTIONALITY
				if(lastUsedDept.length === 0){
					$.badgeWrap.remove($.lastUsedLbl);
					$.badgeWrap.remove($.lastUsed);
				}else{
					createDeptBadge($.lastUsed, lastUsedDept.length, lastUsedDept);
				}

				if(mostUsedDept.length === 0){
					$.badgeWrap.remove($.mostUsedLbl);//mostUsedLbl
					$.badgeWrap.remove($.mostUsed);//mostUsed
				}else{
					createDeptBadge($.mostUsed, mostUsedDept.length, mostUsedDept);
				}

			}else{
				//console.log('\n\nEmployee to choose department from selection.');

				// adding view number for the help audio files
				Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1400';

				if(departmentsSelectionLength === 0){// if there are no depts matching the assigned department alert them that there is something wrong
					$.openDepartmentAlert2 = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('openDept_alert'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									
									$.openDepartmentAlert2.hide.apply($);

									CloudClock.clock.showEmployeeFlowDialog = false;
									
									CloudClock.sessionObj.clearSession();
									
									Alloy.createController('index', {doNotSetParams: true});
									$.departmentSelection.close();
								}
							}
						}
					});
					$.openDepartmentAlert2.show.apply($);
					return false;
				}

				// remove unnecessary UI elements
				$.content.remove($.openDepts);

				$.departments.setVisible(true);

				if(OS_IOS){
					$.header.helpButton.applyProperties({
						employeeLang: Ti.App.Properties.getString('CURRLANGUAGETYPE'),
						viewNo: '1802'
					});
				}else{
					$.header.helpButton.employeeLang = Ti.App.Properties.getString('CURRLANGUAGETYPE');
					$.header.helpButton.viewNo = '1802';
				}

				$.chooseDepartmentInstructions.setText(CloudClock.customL.strings('dept_instructions'));

				if(departmentsSelectionLength < 6){
					$.deptBadgeWrap.contentWidth = '100%';
					$.badgeHolder.layout = 'vertical';
					$.badgeHolder.width = '100%';

					// apply properties to the departmentBadge
					_.extend(departmentBadgeProps, {
						top: '20dp',
						left: '25%',
						height: '90dp',
						width: '50%',
						borderRadius: 5,
					});

				}else{
					// dynamic width set to the scroll view and immediate child view based on the number of depts and 
					// the witdth of the dept badge plus the left offset
					$.deptBadgeWrap.contentWidth = ((Math.ceil(departmentsSelectionLength/5)) * 470) + 'dp';
					$.badgeHolder.width = $.deptBadgeWrap.contentWidth;

					// apply properties to the departmentBadge 
					_.extend(departmentBadgeProps, {
						top: '20dp',
						left: '20dp',
						height: '90dp',
						width: '450dp',
						borderRadius: 5,
					});
				}

				createDeptBadge($.badgeHolder, departmentsSelectionLength, departmentsSelection);
			}
		}

		var softScheduling = require('softScheduling');
		var sessionObj = CloudClock.sessionObj;
		var department = Alloy.Collections.departments.where({departmentNum: sessionObj.employee.get('primaryDeptNum')});
		var employeeDepartments = Alloy.Collections.employeeDepartments.where({badge: sessionObj.employee.get('badge')});
		var previousClockIns = Alloy.Collections.clockHistory.getPreviousClockIns(sessionObj.employee.get('alloy_id'));
		// vars needed to build multi department screens
		var departmentsSelection = [];
		// last used department
		var lastUsedDept = Alloy.Collections.departments.where({departmentNum: sessionObj.last_inPunch.departmentNum});
		if(lastUsedDept.length === 0){
			console.log('We have a problem');
		}
		var mostUsedDept = Alloy.Collections.departments.where({departmentNum: sessionObj.employee.get('mostUsedDeptNum')});
		if(mostUsedDept.length === 0){
			console.log('No most used dept..');
		}

		addEvents();

		updateUI();

	}());
}
catch(error){
	CloudClock.error(error);
}







