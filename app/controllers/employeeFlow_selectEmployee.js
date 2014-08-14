//**************************************************
//*******	SELECT EMPLOYEE CONTROLLER	****************
//**************************************************
var args = arguments[0] || {};

try{
	(function(){

		var employees = args.employees;

		//private fn's
		function emptyFn(e){
			//$.selectEmployeeBadge.removeEventListener('doubletap', emptyFn);
			return false;
		}

		function notListedClick(){
			if(Ti.App.Properties.getString('ALLOWCROSSPUNCH') === '0'){
				$.contactManagerDialog = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('contact_manager'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								$.header.exit.fireEvent('click');
								$.contactManagerDialog.hide.apply($);
							}
						}
					}
				});
				$.contactManagerDialog.show.apply($);
			}else{

				Alloy.createController('employeeFlow_newEmployee', {
					newEmployeePin: employees[0].get('pin')
				});

				$.selectEmployeeWin.close();
			}
		}

		function changeColor(e){
			e.source.setBackgroundColor('#34aadc');
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'selectEmployeeWin', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function updateHelp(){
			$.header.helpButton.show();
			$.header.helpButton.employeeLang = 'en-US';
			$.header.helpButton.viewNo = '1200';
		}

		function updateUI(){
			if(OS_IOS){
				$.notListedLabel.setText(CloudClock.customL.strings('not_listed'));
			}else{
				$.notListed.setTitle(CloudClock.customL.strings('not_listed'));
			}
			$.confirmIdentity.setText(CloudClock.customL.strings('confirm_id'));
		}

		function destroy(){
			$.selectEmployeeWin.removeEventListener('touchstart', restartTimeout);
			$.selectEmployeeWin.removeEventListener('close', destroy);
			$.notListed.removeEventListener('click', notListedClick);
			$.notListed.removeEventListener('touchstart', changeColor);
			$.notListed.removeEventListener('touchend', changeColor);

			$.destroy();

			$.selectEmployeeWin.removeAllChildren();
			
			$ = null;
		}

		function addListeners(){
			$.selectEmployeeWin.addEventListener('open', Alloy.Collections.deviceHelp.audioPlayer.play);
			$.selectEmployeeWin.addEventListener('touchstart', restartTimeout);
			$.selectEmployeeWin.addEventListener('close', destroy);
			$.notListed.addEventListener('click', notListedClick);
			$.notListed.addEventListener('touchstart', changeColor);
			$.notListed.addEventListener('touchend', changeColor);
		}

		function selectEmployeeClick(e){
			try{
				e.source.removeEventListener('click', selectEmployeeClick);

				Ti.App.Properties.setString('CURRLANGUAGETYPE', e.source.language);
				var employeeToPass = Alloy.Collections.employees.get(e.source.employee);

				Alloy.createController('employeeFlow_clockInOut', {
					employees: [employeeToPass]
				});

				$.selectEmployeeWin.close();

			}catch(error){
				console.log('\n\n\nError in select employee badge evt: '+error);
				CloudClock.error(error);
			}
		}

		function employeeBadgeChangeColor(e){

			var badge = e.source.getParent();
			var children = badge.getChildren();

			if(e.type === 'touchstart'){
				badge.setBackgroundColor('#e4e4e4');
				children[1].setBackgroundColor('#fff');
				children[2].setColor('#fff');
			}else{
				badge.setBackgroundColor('#fff');
				children[1].setBackgroundColor('#e4e4e4');
				children[2].setColor('#333');
			}

			badge = null;
			children = null;
		}

		function createBadges(){
			_.each(employees, function(employee){
	
				// <View id="selectEmployeeBadge">
				// 	<ImageView id="selectEmployeeBadgeImg"/>
				// 	<View id="selectEmployeeBadgeDivider"/>
				// 	<Label id="selecetEmployeeBadgeLabel"/>
				// </View>

				var selectEmployeeBadge = Ti.UI.createView({
					top: '20dp',
					width: '80%',
					height: '100dp',
					backgroundColor: '#fff',
					borderRadius: 5,
					borderWidth: '1dp',
					borderColor: "#e4e4e4"
				});

				var overlayForClick = Ti.UI.createLabel({
					top: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'transparent',
					zIndex: 2,
					language: employee.get('lang'),
					employee: employee.id
				});

				var localPhotoFileName = employee.get('photoFileName');

				var selectEmployeeBadgeImg = Ti.UI.createImageView({
					height: '80dp',
					width: '80dp',
					left: '10dp',
					top: '10dp',
					bubbleParent: false
				});

				if(localPhotoFileName.indexOf('/images/icons/') === 0){
					selectEmployeeBadgeImg.setImage(localPhotoFileName);
				}else{
					CloudClock.getLocalPhoto(selectEmployeeBadgeImg, localPhotoFileName);
				}

				var selectEmployeeBadgeDivider = Ti.UI.createView({
					width: '1dp',
					height: '80dp',
					top: '10dp',
					left: '100dp',
					backgroundColor: "#e4e4e4",
					bubbleParent: false
				});

				var selectEmployeeBadgeLabel = Ti.UI.createLabel({
					left: '120dp',
					font: {
						fontSize: '22dp',
						fontWeight: 'bold'
					},
					text: employee.get('name') + ' (' + employee.get('badge') + ')',
					color: '#333',
					bubbleParent: false
				});

				selectEmployeeBadge.add(selectEmployeeBadgeImg);
				selectEmployeeBadge.add(selectEmployeeBadgeDivider);
				selectEmployeeBadge.add(selectEmployeeBadgeLabel);
				selectEmployeeBadge.add(overlayForClick);

				//How to prevent events on the labels and the image and only get the overall badge click ?

				// BIND EVENTS HERE!!!
				overlayForClick.addEventListener('doubletap', emptyFn);
				overlayForClick.addEventListener('click', selectEmployeeClick);
				overlayForClick.addEventListener('touchstart', employeeBadgeChangeColor);
				overlayForClick.addEventListener('touchend', employeeBadgeChangeColor);

				$.selectEmployee.add(selectEmployeeBadge);

				selectEmployeeBadgeLabel = null;
				selectEmployeeBadgeDivider = null;
				selectEmployeeBadgeImg = null;
				selectEmployeeBadge = null;
			});
		}

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1201';

		addListeners();

		updateHelp();

		updateUI();

		createBadges();

		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;

		restartTimeout();

		$.selectEmployeeWin.open();

	})();
}
catch(error){
	CloudClock.error(error);
}








