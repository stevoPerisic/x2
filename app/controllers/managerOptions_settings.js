//**************************************************
//*******	MANAGER OPTIONS SETTINGS CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};
Ti.API.info('Args Data: ' + JSON.stringify(args.data));
(function(){
	try{

		//private fn's

		function showTextBox(e){
			if(Ti.Network.online === true){
				$.terminalIdLbl.hide();
				$.terminalIdArrow.hide();
				$.terminalIdTxtField.show();
				$.terminalIdTxtField.focus();
			}else{
				alertNoNetwork();
			}
		}

		function resetTextField(){
			$.terminalIdTxtField.value = '';
			$.terminalIdTxtField.blur();
			$.terminalIdTxtField.hide();
			$.terminalIdLbl.show();
			$.terminalIdArrow.show();
		}

		function changeTerminal(e){

			// MAKE SURE THAT THERE ARE NO UNSENT PUNCHES BEFORE THE DATA GETS OVERWRITTEN IN CASE THE TERMINAL ID IS DIFFERENT
			// IF IT IS DIFFERENT WARN THE USER THAN TRY TO SEND PUNCHES AND THAN CHANGE THE TERMINAL ID AND DOWNLOAD DATA

			newTerminalID = $.terminalIdTxtField.getValue();

			if(newTerminalID.length > 0){
				newTerminalID = newTerminalID.replace(/\D/g,'');

				if(newTerminalID.length > 10 || newTerminalID.length < 10){
					$.notEnoughDigits = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('notEnoughDigits'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									$.notEnoughDigits.hide.apply(CloudClock.managerOptions);
									resetTextField();
								}
							}
						}
					});
					$.notEnoughDigits.show.apply(CloudClock.managerOptions);
				}else{
					$.changeTerminalDialog = CloudClock.customAlert.create({
						type: 'warning',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('no'), CloudClock.customL.strings('yes')],
						title: CloudClock.customL.strings('warning'),
						message: CloudClock.customL.strings('terminalId_warning'),
						callback:{
							eType: 'click',
							action: changeTerminalDialog_click
						}
					});
					$.changeTerminalDialog.show.apply(CloudClock.managerOptions);
				}
			}else{
				resetTextField();
			}
		}

		function clearFlowTimeout(){
			$.terminalIdTxtField.removeEventListener('change', clearFlowTimeout);
			
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('managerOptions', 'managerOptions', CloudClock.managerOptions.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showManagerOptionsDialog = true;

			$.terminalIdTxtField.addEventListener('change', clearFlowTimeout);
		}

		function changeTerminalDialog_click(e){
			if(e.source.id === this.cancel){
				resetTextField();
				$.changeTerminalDialog.hide.apply(CloudClock.managerOptions);
			}else{
				$.changeTerminalDialog.hide.apply(CloudClock.managerOptions);

				//restart timeout
				CloudClock.screenTimeout.restartTimeout('managerOptions', 'managerOptions', CloudClock.managerOptions.header.exit);
				//show dialog if timeout expires
				CloudClock.clock.showManagerOptionsDialog = false;
				
				$.destroy();

				// add a propety to the manager options obj so we know to open the index page and re initialize the clock

				CloudClock.managerOptions.reIntialize = {reInit: true, terminalID: parseInt(newTerminalID, 10)};
				CloudClock.managerOptions.managerOptions.close();
			}
		}

		function longUpdate(e){
			if(Ti.Network.online === true){
				$.longUpdate.removeEventListener('click', longUpdate);

				if(CloudClock.managerOptions){
					CloudClock.managerOptions.activityIndicator.show();
				}

				// we are changing the messageType in the params here to INIT inside of this fn
				CloudClock.maintenace_cfg.params.messageType = 'INIT';
				
				CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				CloudClock.api.request(CloudClock.maintenace_cfg);

				$.longUpdate.addEventListener('click', longUpdate);
			}else{
				alertNoNetwork();
			}
		}

		function runTransactions(e){
			if(Ti.Network.online === true){
				$.quickUpdate.removeEventListener('click', runTransactions);

				if(CloudClock.managerOptions){CloudClock.managerOptions.activityIndicator.show();}
				Alloy.Collections.transactions.sendTransactions();

				console.log('REQUEST MAINTENACE');
				// change it back to maintenace
				CloudClock.maintenace_cfg.params.messageType = 'MAINT';

				CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				CloudClock.api.request(CloudClock.maintenace_cfg);

				$.quickUpdate.addEventListener('click', runTransactions);
			}else{
				alertNoNetwork();
			}
		}

		function goback(e){
			$.back.removeEventListener('click', goback);
			
			$.logsTableViewWrap.removeAllChildren();
			$.logsTableViewWrap.hide();

			logsTable.tableWrap.children[1].data = null;
			logsTable = null;

			$.clockSettingsTableWrap.show();
			$.managerSettingsHeaderTxt.setText('Clock Settings');
			$.back.hide();

			$.back.addEventListener('click', goback);
		}

		function changeColor(e){
			if(e.type === 'touchstart'){
				e.source.setBackgroundColor('#34aadc');
			}else{
				e.source.setBackgroundColor('transparent');
			}
		}

		function alertNoNetwork(){
			$.noNetworkToSendLogs = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: CloudClock.customL.strings('noNetworkToSendLogs'),
				callback:{
					eType: 'click',
					action: function(_e){
						$.noNetworkToSendLogs.hide.apply(CloudClock.managerOptions);
					}
				}
			});

			$.noNetworkToSendLogs.show.apply(CloudClock.managerOptions);
		}

		function sendLogs(e){

			if(Ti.Network.online === true){
				$.sendLogs.removeEventListener('click', sendLogs);
			
				$.logsTableViewWrap.removeAllChildren();

				// trying to remove in memory models so all of the logs can be sent
				// it seems like the ones that remain in memory or that are on the screen currently do not get destroyed in the sendLogs collection extension
				$.destroy();

				if(CloudClock.managerOptions){
					CloudClock.managerOptions.activityIndicator.show();
				}

				// Alloy.Collections.logging.sendLogs();
				Alloy.Collections.logging.saveToCSVandRemove();

				$.sendLogs.addEventListener('click', sendLogs);
			}else{
				alertNoNetwork();
			}
		}

		function viewLogs(e){
			$.viewLogs.removeEventListener('click', viewLogs);

			Alloy.Collections.logging.fetch({
				success: function(){
					console.log('Logs successfuly retrieved from local DB.');
				},
				error: function(collection, response, options){
					CloudClock.log('Error', JSON.stringify(response));
				}
			});

			$.back.show();
			$.sendLogs.show();
			$.clockSettingsTableWrap.hide();
			$.managerSettingsHeaderTxt.setText('Cloud Clock Logs');

			logsTable = Alloy.createController('managerOptions_viewLogs', {data: 'test view logs'});
			
			$.logsTableViewWrap.applyProperties({width: '90%'});
			$.logsTableViewWrap.add(logsTable.tableWrap);

			$.logsTableViewWrap.show();

			$.viewLogs.addEventListener('click', viewLogs);
		}

		function setLanguage(){
			$.hostURLLbl.setText(Ti.App.Properties.getString('PNET'));
			$.terminalIdLbl.setText(Ti.App.Properties.getString('TERMID'));
			$.terminalIdTxtField.setVisible(false);
			$.versionLbl.setText(Titanium.App.version);
			$.deviceLbl.setText(Ti.Platform.osname + ' iOS V.'+Ti.Platform.version);
			$.timezoneLbl.setText('GMT ' + ( -currentTime.getTimezoneOffset()/60));
			$.lastConnectLbl.setText(Ti.App.Properties.getString('LAST_CONNECT'));
		}

		function updateUI(){

			setLanguage();
			$.back.setVisible(false);
			$.sendLogs.setVisible(false);
			$.logsTableViewWrap.hide();

			if(OS_IOS)
			{
				$.lastQUPDATE.applyProperties({
					text: Ti.App.Properties.getString('LAST_QUPDATE'),
					bottom: '10dp',
					color: '#000'
				});
				$.lastLUPDATE.applyProperties({
					text: Ti.App.Properties.getString('LAST_LUPDATE'),
					bottom: '10dp',
					color: '#000'
				});
			}
			else
			{
				$.quickUpdate.applyProperties({
					title: (Ti.App.Properties.getString('LAST_QUPDATE')) ? 'Quick Update\n'+Ti.App.Properties.getString('LAST_QUPDATE') : 'Quick Update'
				});

				$.longUpdate.applyProperties({
					title: (Ti.App.Properties.getString('LAST_LUPDATE')) ? 'Long Update\n'+Ti.App.Properties.getString('LAST_LUPDATE') : 'Long Update'
				});
			}

			if(Ti.App.Properties.getString('MANAGEREPORTS').length === 0){
				// CloudClock.managerOptions.reports.hide();
				// CloudClock.managerOptions.sideBarMenu.remove(CloudClock.managerOptions.reports);
			}

			if(Ti.App.Properties.getString('MANAGEUSERS').length === 0){
				// CloudClock.managerOptions.people.hide();
				CloudClock.managerOptions.sideBarMenu.remove(CloudClock.managerOptions.people);
			}

			if(Ti.App.Properties.getString('MANAGEDEPTS').length === 0){
				// CloudClock.managerOptions.departments.hide();
				CloudClock.managerOptions.sideBarMenu.remove(CloudClock.managerOptions.departments);
			}
		}

		function addEventListeners(){
			$.terminalId.addEventListener('click', showTextBox);
			$.terminalIdTxtField.addEventListener('return', changeTerminal);
			$.terminalIdTxtField.addEventListener('change', clearFlowTimeout);

			$.longUpdate.addEventListener('touchstart', changeColor);
			$.longUpdate.addEventListener('touchend', changeColor);
			$.longUpdate.addEventListener('click', longUpdate);

			$.quickUpdate.addEventListener('touchstart', changeColor);
			$.quickUpdate.addEventListener('touchend', changeColor);
			$.quickUpdate.addEventListener('click', runTransactions);

			$.back.addEventListener('click', goback);

			$.sendLogs.addEventListener('touchstart', changeColor);
			$.sendLogs.addEventListener('click', sendLogs);
			$.sendLogs.addEventListener('touchend', changeColor);

			$.viewLogs.addEventListener('touchstart', changeColor);
			$.viewLogs.addEventListener('touchend', changeColor);
			$.viewLogs.addEventListener('click', viewLogs);
			
			$.send_CSV.addEventListener('touchstart', changeColor);
			$.send_CSV.addEventListener('touchend', changeColor);
			$.send_CSV.addEventListener('click', function(){
				if(Ti.Network.online === true){
					Alloy.Collections.logging.sendTransactionsCSV();
				}else{
					alertNoNetwork();
				}
			});
		}

		var logsTable;
		var newTerminalID;
		var currentTime = new Date();

		CloudClock.managerOptions.viewLogs = viewLogs; // refernce to the fn so we can call it out of the logging collection

		CloudClock.managerOptions.setLastConnectText = function(){
			$.lastConnectLbl.setText(Ti.App.Properties.getString('LAST_CONNECT'));
		};

		CloudClock.managerOptions.setQUpdateText = function(){
			//console.log('Last quick update happened at: ' + Ti.App.Properties.getString('LAST_QUPDATE'));
			if(OS_IOS){
				$.lastQUPDATE.applyProperties({text: Ti.App.Properties.getString('LAST_QUPDATE')});
			}else{
				$.quickUpdate.applyProperties({title: 'Quick Update\n'+Ti.App.Properties.getString('LAST_QUPDATE')});
			}
			// CloudClock.managerOptions.activityIndicator.hide();
		};

		CloudClock.managerOptions.setLUpdateText = function(){
			//console.log('Last Long update happened at: ' + Ti.App.Properties.getString('LAST_LUPDATE'));
			if(OS_IOS){
				$.lastLUPDATE.applyProperties({text: Ti.App.Properties.getString('LAST_LUPDATE')});
			}else{
				$.longUpdate.applyProperties({title: 'Long Update\n'+Ti.App.Properties.getString('LAST_LUPDATE')});
			}
			// CloudClock.managerOptions.activityIndicator.hide();
		};

		updateUI();

		addEventListeners();

		CloudClock.managerOptions.restartTimeout();

	}catch(error){
		CloudClock.error(error);
	}
}());

