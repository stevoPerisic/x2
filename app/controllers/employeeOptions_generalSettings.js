//**************************************************
//*******	GENERAL SETTINGS CONTROLLER	****************
//*************************************************
//var args = arguments[0] || {};
(function(){
	try{

		//private fn's

		function languageChange_click(e){

			restartTimeout();

			hideLangChcks();

			$[e.source.id].applyProperties({font: {fontSize: '18dp', fontWeight: 'bold'}});
			$[e.source.id].children[1].setVisible(true);

			employee.save({lang: e.source.id});
			Ti.App.Properties.setString('CURRLANGUAGETYPE', e.source.id);
			
			setLanguage();

			CloudClock.employeeOptions.setLanguage();
			CloudClock.employeeOptions.header.setLanguage();

			payload.parm1 =  e.source.id;
			payload.parm2 = 0;
			payload.itemID = "Language";

			var setLanguage_cfg = {
				endpoint: 'employeeProfile',
				params: {
					'badge': CloudClock.sessionObj.employee.get('badge')
				},
				payload: payload,
				onSuccess: function(response){
					CloudClock.log('Info', 'Employee language pref. updated: '+JSON.stringify(response));
				},
				onError: function(response){
					CloudClock.log('Error', 'Error updating empl. language pref.: '+JSON.stringify(response));
				}
			};
			setLanguage_cfg.params.termID = Ti.App.Properties.getString('TERMID');
			CloudClock.api.request(setLanguage_cfg);
		}

		function changeLanguageSettings(e){
			hideLangChcks();
		}

		function hideLangChcks(){
			$.en_usCheck.setVisible(false);

			$.esCheck.setVisible(false);

			$.frCheck.setVisible(false);
		}

		function setLanguage(){
			if(OS_IOS){
				$.backLbl.setText(CloudClock.customL.strings('back_btn'));
			}else{
				$.back.setTitle(CloudClock.customL.strings('back_btn'));
			}
			$.emplSettingsHeader.setText(CloudClock.customL.strings('genSettings'));
			$.personalPrefLbl.setText(CloudClock.customL.strings('personal_pref'));

			$.badgeId_text.setText(CloudClock.customL.strings('sett_name_badge'));
			$.email_text.setText(CloudClock.customL.strings('sett_name_email'));
			$.cellPhoneNum_text.setText(CloudClock.customL.strings('sett_name_cell'));
			$.mobileCarrier_text.setText(CloudClock.customL.strings('sett_name_carr'));
			$.mobileCarrierLbl.setText(CloudClock.customL.strings('mobileCarr'));

			$.langPrefLbl.setText(CloudClock.customL.strings('lang_pref'));
			$.en_usLbl.setText(CloudClock.customL.strings('english'));
			$.esLbl.setText(CloudClock.customL.strings('espanol'));
			$.frLbl.setText(CloudClock.customL.strings('french'));
		}

		function email_click(e){

			restartTimeout();

			var previousValue = $.emailLbl.getText();
			$.emailLbl.setVisible(false);
			$.emailArrow.setVisible(false);
			//employe has an email set up?
			if(previousValue){
				$.emailTxtField.setHintText(previousValue);
			}else{
				$.emailTxtField.setHintText('john.doe@company.com');
			}
			$.emailTxtField.setVisible(true);
			$.emailTxtField.focus();
		}

		function emailTxtField_change(e){
			//console.log('clearing interval due to text field change.');

			restartTimeout();
		}

		function emailtxtField_return(e){

			restartTimeout();

			var email = $.emailTxtField.getValue();
			var n = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
			//console.log(n);
			if(n && email !== employee.get('email')){
				$.emailLbl.setText(email);
				$.emailTxtField.hide();
				$.settingsTableWrap.fireEvent('email_set', {
					parm1: email,
					parm2: 0,
					itemId: 'Email'
				});

				employee.save({email: email});
			}
			else if(n && email === employee.get('email')){
				// alert(CloudClock.customL.strings('email_txt_alert'));
				$.email_txt_alert = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('email_txt_alert'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								
								$.email_txt_alert.hide.apply($);

								showPrevEmailValue();
							}
						}
					}
				});
				$.email_txt_alert.show.apply($);

				// showPrevEmailValue();
			}
			else{
				// alert(CloudClock.customL.strings('enter_valid_email'));
				$.enter_valid_email = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('enter_valid_email'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								
								$.enter_valid_email.hide.apply($);

								showPrevEmailValue();
							}
						}
					}
				});
				$.enter_valid_email.show.apply($);

				// showPrevEmailValue();
			}
		}

		function cellPhoneNum_click(e){

			restartTimeout();

			var previuosValue = $.cellPhoneLbl.getText();
			$.cellPhoneLbl.setVisible(false);
			$.cellPhoneArrow.setVisible(false);
			if(previuosValue){
				$.cellPhoneNumTxtField.setHintText(previuosValue);
			}else{
				$.cellPhoneNumTxtField.setHintText('000-000-0000');
			}
			$.cellPhoneNumTxtField.setVisible(true);
			$.cellPhoneNumTxtField.focus();
		}

		function cellPhoneNumTxtField_change(e){
			restartTimeout();
		}

		function cellPhoneNumTxtField_return(e){

			restartTimeout();

			var carrier = $.mobileCarrierLbl.text;
			var cellPhone = $.cellPhoneNumTxtField.getValue();
			cellPhone = cellPhone.replace(/\D/g,'');

			if(cellPhone.length === 0){
				//console.log('no value entered');
				$.cellPhoneNumTxtField.blur();
				$.cellPhoneNumTxtField.hide();
				$.cellPhoneArrow.show();
				$.cellPhoneLbl.show();
				return false;
			}else if(cellPhone.length !== 10){
				// alert(CloudClock.customL.strings('enter_valid_cellNum'));

				$.enter_valid_cellNum = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('enter_valid_cellNum'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								
								$.enter_valid_cellNum.hide.apply($);

								$.cellPhoneNumTxtField.blur();
								$.cellPhoneNumTxtField.setHintText('000-000-0000');
								$.cellPhoneNumTxtField.value = '';
								$.cellPhoneArrow.show();
							}
						}
					}
				});
				$.enter_valid_cellNum.show.apply($);

				// $.cellPhoneNumTxtField.blur();
				// $.cellPhoneNumTxtField.setHintText('000-000-0000');
				// $.cellPhoneNumTxtField.value = '';
				// $.cellPhoneArrow.show();
				return false;
			}
			
			if(carrier && carrier.length > 0){
				var order = $.mobileCarrierLbl.order;
				$.mobileCarrierLbl.setText(carrier);
				if(cellPhone !== employee.get('cellPhone')){
					$.settingsTableWrap.fireEvent('cellPhone_set', {
						parm1: cellPhone,
						parm2: order,
						itemId: 'Mobile'
					});
				}

				employee.save({cellCarrier: order, cellPhone: cellPhone});
			}else{
				// alert(CloudClock.customL.strings('select_carr_alert'));

				$.select_carr_alert = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('select_carr_alert'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								
								$.select_carr_alert.hide.apply($);

								$.cellPhoneNumTxtField.blur();
							}
						}
					}
				});
				$.select_carr_alert.show.apply($);

				// $.cellPhoneNumTxtField.blur();
			}
		}

		function mobileCarrier_click(e){

			restartTimeout();

			$.mobileCarrier.removeEventListener('click', mobileCarrier_click);

			//console.log(JSON.stringify(e.source));

			makeCellCarriersTbl(cellCarriers);

			$.back.setVisible(true);

			$.settingsTableWrap.animate({left: '-100%', duration: 480});
			$.cellCarriersTableWrap.animate({left: '5%', duration: 500});

			$.mobileCarrier.addEventListener('click', mobileCarrier_click);
		}

		function backBtn_click(e){

			restartTimeout();

			$.cellCarriersTableWrap.animate({left: '100%', duration: 480});
			$.settingsTableWrap.animate({left: '5%', duration: 500});

			$.back.setVisible(false);

			var cellPhone = ($.cellPhoneNumTxtField.getValue()) ? $.cellPhoneNumTxtField.getValue() : $.cellPhoneLbl.getText();
			var carrier = $.mobileCarrierLbl.text;

			//alert(carrier);
			if(!cellPhone){
				return false;
			}
			else if(cellPhone.length > 0){
				var order = $.mobileCarrierLbl.order;

				$.mobileCarrierLbl.setText(carrier);
				
				if(order !== employee.get('cellCarrier')){
					$.settingsTableWrap.fireEvent('cellPhone_set', {
						parm1: cellPhone,
						parm2: order,
						itemId: 'Mobile'
					});
				}

				employee.save({cellCarrier: order, cellPhone: cellPhone});
			}
			else{
				// alert(CloudClock.customL.strings('cell_txt_alert'));

				$.cell_txt_alert = CloudClock.customAlert.create({
					type: 'alert',
					cancel: 0,
					buttonNames: [CloudClock.customL.strings('ok')],
					title: CloudClock.customL.strings('alert'),
					message: CloudClock.customL.strings('cell_txt_alert'),
					callback:{
						eType: 'click',
						action: function(_e){
							if(_e.source.id === this.cancel){
								
								$.cell_txt_alert.hide.apply($);

								$.cellPhoneNumTxtField.focus();
							}
						}
					}
				});
				$.cell_txt_alert.show.apply($);
				
				// $.cellPhoneNumTxtField.focus();
			}
		}

		function carrier_selected(e){
			$.mobileCarrierLbl.text = e.carrier;
			$.mobileCarrierLbl.order = e.order;
		}

		function setParms(_e, type){
			//console.log('Recieved Event to set ' + type + 'on employee: ' + JSON.stringify(_e));

			if(type === 'Email_cfg'){
				setEmail_cfg.payload.parm1 = _e.parm1;
				setEmail_cfg.payload.parm2 = _e.parm2;
				setEmail_cfg.payload.itemID = _e.itemId;
				//console.log("Payload: " + JSON.stringify(setEmail_cfg.payload));
				//employee.set({email: _e.parm1});
				
				employee.save({email: _e.parm1});
				setEmail_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				CloudClock.api.request(setEmail_cfg);
			}else if(type === 'Text_cfg'){
				setText_cfg.payload.parm1 = _e.parm1;
				setText_cfg.payload.parm2 = _e.parm2;
				setText_cfg.payload.itemID = _e.itemId;
				//console.log("Payload: " + JSON.stringify(setText_cfg.payload));
				//employee.set({cellPhone: _e.parm1});
				
				employee.save({cellPhone: _e.parm1});
				setText_cfg.params.termID = Ti.App.Properties.getString('TERMID');
				CloudClock.api.request(setText_cfg);
			}
		}

		function carriersRowClick(e){
			////console.log('\n\n\nEvent from carriers row table: '+JSON.stringify(e));

			_.each(e.section.rows, function(row){
				////console.log('\n\n\nKids: '+JSON.stringify(row));
				if(row.id === 'checkedRow')
					row.remove(cellcarrierChckMark);
			});

			e.source.add(cellcarrierChckMark);
			e.source.applyProperties({id: 'checked', font: {fontSize: '18dp', fontWeight: 'bold'}});
			desiredCarrier = e.source.carrier;

			//console.log('About to fire CARRIER SELECTED with carrier: ' + desiredCarrier + ', and order: ' +  e.source.number);
			$.back.fireEvent('carrier_selected', {carrier: desiredCarrier, order: e.source.number});
		}

		function makeCellCarriersTbl(rowData){
			var rows = [];

			_.each(rowData, function(carrier, i){
				//console.log(carrier, i);

				var row = Ti.UI.createTableViewRow({
					id: '',
					checked: false,
					carrier: carrier,
					number: i+1,
					height: 44,
					backgroundFocusedColor: "#fff",
					backgroundImage: 'none',
					bacgroundSelectedColor: '#fff',
					focusedBackgroundColor: '#34AADC'
				});

				var label = Ti.UI.createLabel({
					text: carrier,
					left: 10,
					color: '#333',
					font:{
						fontSize: '18dp'
					}
				});

				row.add(label);

				if(row.number === desiredCarrier+1 || row.carrier === desiredCarrier){
					//console.log('ADDING THE EXISTING CARRIER CHECKMARK TO: ' + row.carrier);

					row.id = 'checkedRow';
					row.checked = true;

					row.children[0].font.fontWeight = 'bold';
					
					row.add(cellcarrierChckMark);
					
				}

				//console.log('Desired carrier: ' + desiredCarrier);

				row.addEventListener('click', carriersRowClick);

				rows.push(row);

				row = null;
				label = null;
			});
			
			$.cellCarriers.setData(rows);

			rows = null;
		}

		function showPrevEmailValue(){
			$.emailTxtField.blur();
			$.emailTxtField.hide();
			$.emailArrow.show();
			$.emailLbl.show();
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeOptions', 'employeeOptions', CloudClock.employeeOptions.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeOptionsDialog = true;
		}

		function updateUI(){
			hideLangChcks();
			//set language
			setLanguage();
			//end

			$.back.setVisible(false);
			$.badgeIdLbl.setText(employee.get('badge'));

			if(employee.get('email')){
				$.emailLbl.setText(employee.get('email'));
				$.emailTxtField.setVisible(false);
			}
			else{
				$.emailLbl.setVisible(false);
				$.emailTxtField.setVisible(true);
			}

			if(employee.get('cellPhone')){
				$.cellPhoneLbl.setText(employee.get('cellPhone'));
				$.cellPhoneNumTxtField.setVisible(false);
			}
			else{
				$.cellPhoneLbl.setVisible(false);
				$.cellPhoneNumTxtField.setVisible(true);
			}

			if(desiredCarrier !== null && desiredCarrier.length !== 0){

				for(var i = 0; i < ccl; i++){
					desiredCarrier = parseInt(employee.get('cellCarrier'), 10) - 1;

					if(i ===  desiredCarrier){
						$.mobileCarrierLbl.setText(cellCarriers[i]);
						$.mobileCarrier.applyProperties({carrierNum: desiredCarrier});
					}
				}
			}
			else{
				desiredCarrier = 0;
				$.mobileCarrierLbl.setText('Please set up your mobile carrier.');
				$.mobileCarrier.applyProperties({carrierNum: desiredCarrier});
			}

			if(employee.get('lang') === 'en_us' || employee.get('lang') === 'en-us' || employee.get('lang') === 'en-US'){
				$.en_usCheck.setVisible(true);
			}
			else if(employee.get('lang') === 'es'){
				$.esCheck.setVisible(true);
			}
			else if (employee.get('lang') === 'fr') {
				$.frCheck.setVisible(true);
			}
		}

		function addEventListeners(){
			$.en_us.addEventListener('click', languageChange_click);
			$.es.addEventListener('click', languageChange_click);
			$.fr.addEventListener('click', languageChange_click);

			$.settingsTableWrap.addEventListener('email_set', function(e){
				setParms(e, 'Email_cfg');
			});
			$.settingsTableWrap.addEventListener('cellPhone_set', function(e){
				setParms(e, 'Text_cfg');
			});

			$.email.addEventListener('click', email_click);
			$.emailTxtField.addEventListener('change', emailTxtField_change);
			$.emailTxtField.addEventListener('return', emailtxtField_return);

			$.cellPhoneNum.addEventListener('click', cellPhoneNum_click);
			$.cellPhoneNumTxtField.addEventListener('change', cellPhoneNumTxtField_change);
			$.cellPhoneNumTxtField.addEventListener('return', cellPhoneNumTxtField_return);

			$.mobileCarrier.addEventListener('click', mobileCarrier_click);

			$.back.addEventListener('click', backBtn_click);
			$.back.addEventListener('carrier_selected', carrier_selected);
		}

		var employee = CloudClock.sessionObj.employee;
		var cellCarriers = Alloy.Collections.parameters.getCellCarriersNames();
		var ccl = cellCarriers.length;
		var emailChildren;
		var cellPhoneChildren;
		var desiredCarrier = employee.get('cellCarrier');
		var cellcarrierChckMark = Ti.UI.createImageView({id: 'checkmarkImg', image: '/images/icons/1_navigation_accept_blk.png', right: '15dp'});
		// to build the request
		var params = {
			'badge': employee.get('badge')
		};
		var payload = {
			"parm1": "", //	the phone number entered by the user
			"parm2": "",	//	number of the cell carrier in the array of carriers
			"itemID": "" // type of request in this case Mobile
		};
		var setText_cfg = {
			endpoint: 'employeeProfile',
			params: params,
			payload: payload,
			onSuccess: function(response){
				$.cellPhoneNumTxtField.blur();
				$.cellPhoneNumTxtField.hide();
				$.cellPhoneArrow.show();
				$.cellPhoneLbl.setText(employee.get('cellPhone'));
				$.cellPhoneLbl.show();
			},
			onError: function(response){
				CloudClock.log('Error', 'Error updating employee profile: ' + JSON.stringify(response));
			}
		};
		var setEmail_cfg = {
			endpoint: 'employeeProfile',
			params: params,
			payload: payload,
			onSuccess: function(response){
				$.emailTxtField.blur();
				$.emailLbl.setText(employee.get('email'));
				$.emailTxtField.hide();
				$.emailArrow.show();
				$.emailLbl.show();
			},
			onError: function(response){
				CloudClock.log('Error', 'Error updating employee profile: ' + JSON.stringify(response));
			}
		};

		updateUI();

		addEventListeners();

		restartTimeout();
	}catch(error){
		CloudClock.error(error);
	}
}());







































