
//**************************************************
//*******	EMPLOYEE OPTIONS MASTER CONTROLLER	****************
//**************************************************
var args = arguments[0] || {};
(function(){
	try{

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('managerOptions', 'managerOptions', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showManagerOptionsDialog = true;
		}

		function destroy(e){

			var reInitialize = CloudClock.managerOptions.reIntialize;
			
			$.managerOptions.removeEventListener('close', destroy);

			$.destroy();
			$ = null;

			CloudClock.managerOptions.destroy();
			CloudClock.managerOptions = null;

			if(reInitialize)
				Alloy.createController('index', {reInit: reInitialize.reInit, terminalID: reInitialize.terminalID});
		}

		function updateUI_ForDebugMode(){
			// qa login debug mode add a change actual time switch
			var actualTimeSwitch = Ti.UI.createView({
				top: 0,
				left: 0,
				width: '280dp',
				height: '60dp',
				backgroundColor: '#fff',
				borderWidth: '1dp',
				borderColor: "#e4e4e4"
			});

			var chckMark = Ti.UI.createImageView({
				image: '/images/icons/1_navigation_accept_blk.png',
				height: '33dp',
				right: '15dp',
				left: '10dp',
				width: '32dp'
			});

			var actualTimeSwitchLbl = Ti.UI.createLabel({
				top: 0,
				left: '50dp', // this only for the time being bcs we will add icons
				width: '230dp',
				height: '60dp',
				font: {
					fontSize: '16dp',
					fontWeight: 'bold'
				},
				text: 'Change Actual Time Switch',
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				on: (Ti.App.Properties.getString('QAFLAG') === '1') ? true : false
			});

			if(Ti.App.Properties.getString('QAFLAG') === '1'){
				actualTimeSwitch.add(chckMark);
			}
			actualTimeSwitch.add(actualTimeSwitchLbl);

			$.footer.footer.add(actualTimeSwitch);

			actualTimeSwitchLbl.addEventListener('click', function(e){
				// this.removeEventListener('click', turnOnChangeActualTime);

				if(e.source.on){
					Ti.App.Properties.setString('QAFLAG', '0');
					this.parent.remove(chckMark);
					e.source.on = false;
				}else{
					Ti.App.Properties.setString('QAFLAG', '1');
					this.parent.add(chckMark);
					e.source.on = true;
				}

				// this.addEventListener('click', turnOnChangeActualTime);
			});
		}

		function updateUI(){
			$.header.helpButton.setVisible(false);
			
			$.footer.employeeOptions.setVisible(false);
			
			if(args.debugMode){
				updateUI_ForDebugMode();
			}else{
				$.footer.hide();
			}
		}

		function addEventListeners(){
			$.managerOptions.addEventListener('close', destroy);
		}

		CloudClock.managerOptions = $;
		CloudClock.managerOptions.restartTimeout = restartTimeout;
		// pass the context to the screenTimeout
		CloudClock.screenTimeout._context = $;
		
		updateUI();

		addEventListeners();

		CloudClock.dispatcher.route('managerOptions', 'managerOptionsContent', 'managerOptions_settings', false, {test: 'Test passing data.'});

		CloudClock.sideMenu.init('managerOptions', 'managerOptionsContent', $.sideBarMenu.getChildren(), 'managerOptionsSettings');


	}catch(error){
		CloudClock.error(error);
	}
}());















