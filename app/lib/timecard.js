//employeeFlow_hoursVerification
// this is the time card
var timecard = {};

// properties
timecard.params = {};

timecard.setEmplCommParams = {};


if (OS_IOS){
	timecard.printer = require('com.acktie.mobile.ios.airprint');
	console.log(timecard.printer);
	timecard.receiptprinter = require('com.peoplenet.receiptprinter');
	console.log(timecard.receiptprinter);
}

// ui elements
timecard.confirmationMessage = {
	message: {},
	create: function(){
		timecard.confirmationMessage.message = Ti.UI.createLabel({
			id: 'confirmationMessage',
			top: '25%',
			left: '25%',
			height: '50%',
			width: '50%',
			zIndex: 1,
			backgroundColor: '#000',
			color: '#fff',
			opacity: '0.7',
			borderRadius: 20,
			font: {
				fontSize: '28dp'
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
	},
	add: function(){
		if(timecard.context !== null && timecard.context.__controllerPath !== "employeeOptions_timecardDetail" && timecard.context.__controllerPath !== "employeeFlow_hoursVerification"){
			timecard.context.timecardDetail.add(timecard.confirmationMessage.message);
		}else{
			if(CloudClock.employeeOptions){
				CloudClock.employeeOptions.employeeOptions.add(timecard.confirmationMessage.message);
			}else{
				timecard.context.timecardDetail.add(timecard.confirmationMessage.message);
			}
		}
	},
	remove: function(){
		timecard.confirmationDialog_timeout = setTimeout(function(){
			delete timecard.confirmationDialog_timeout;

			if(timecard.context !== null && timecard.context.__controllerPath !== "employeeOptions_timecardDetail" && timecard.context.__controllerPath !== "employeeFlow_hoursVerification"){
				timecard.context.timecardDetail.remove(timecard.confirmationMessage.message);
				// reload the timecard
				timecard.submitPunchAndView();
			}else if(timecard.context !== null){
				if(CloudClock.employeeOptions){
					CloudClock.employeeOptions.employeeOptions.remove(timecard.confirmationMessage.message);
					// reload the detail timecard
					CloudClock.employeeOptions.__views.sideBarMenu.children[0].fireEvent('click');
				}else{
					timecard.context.timecardDetail.remove(timecard.confirmationMessage.message);
					// reload the timecard
					timecard.viewDetails();
				}
			}else{
				return false;
			}
		}, 3000);
	}
};

timecard.confirmationDialog_timeout = 0;

// methods
function hideActivityIndicator(){
	if(_.isUndefined(CloudClock.employeeOptions) || _.isNull(CloudClock.employeeOptions)){ // employee options does not exist
		timecard.context.activityIndicator.hide();
	}else{
		if(CloudClock.employeeOptions){
			CloudClock.employeeOptions.activityIndicator.hide();
		}else{
			timecard.context.activityIndicator.hide();
		}
	}
}

timecard.handleOffline = function(){
	// show error view
	timecard.errorLabel = Ti.UI.createLabel({
		text: CloudClock.customL.strings('error_lbl_3'),
		color: '#333',
		top: '300dp'
	});

	try{
		timecard.context.timecardWrap.removeAllChildren();
		timecard.context.timecardWrap.add(timecard.errorLabel);

		hideActivityIndicator();
	}catch(error){
		CloudClock.error(error);
	}
};

timecard.handleErrorResponse = function(response){

	if(timecard.context !== null){
		// show error view
		timecard.errorLabel = Ti.UI.createLabel({
			id: 'timecardErrorLabel',
			text: (timecard.context.__controllerPath === "employeeOptions_timecardDetail") ? CloudClock.customL.strings('timesheetReq_notRegisteredEmpl') : CloudClock.customL.strings('error_lbl_2'),
			color: '#333',
			top: '300dp'
		});

		try{
			// context check!!!
			if(timecard.context.__controllerPath === "employeeOptions_timecardDetail" || timecard.context.__controllerPath === 'employeeFlow_hoursVerification'){
				timecard.context.timecardWrapHeader.hide();
				timecard.context.tableHolder.hide();
			}else{
				timecard.context.timecardWrap.removeAllChildren();
			}

			if(timecard.context.__controllerPath !== "employeeOptions_timecardDetail")
				timecard.context.header.exit.show();
			
			timecard.context.timecardWrap.add(timecard.errorLabel);

			if(!timecard.context.timecardDetail.visible){
				timecard.context.timecardDetail.show();
			}

			hideActivityIndicator();
		}catch(error){
			CloudClock.error(error);
		}
	}
	
	CloudClock.log('Error', 'Error getting punch and view timecard: '+JSON.stringify(response));
};

timecard.handleHTMLresponse = function(response){
	//console.log(response);
	var webView = Ti.UI.createWebView({
		id: 'timecardWebView',
		top: 0,
		height: '90%',
		width: '96%',
		backgroundColor: '#fcfcfc'
	});
	// response.error = true;

	try{
		// let's remove any error labels if they exist
		if(_.has(timecard, 'errorLabel'))
			timecard.context.timecardWrap.remove(timecard.errorLabel);

		if(_.has(response, "error"))
		{
			timecard.handleErrorResponse(response);
		}
		else
		{
			// this to prevent department numbers to be understood as telephone numbers by the webView
			var timecardHTML = response.timecard.replace('<html>', '<html><head><meta name="format-detection" content="telephone=no" /></head>');
			webView.html = timecardHTML;
			
			if(// context check!!!
				timecard.context.__controllerPath === "employeeOptions_timecardDetail" ||
				timecard.context.__controllerPath === "employeeFlow_hoursVerification" ||
				timecard.context.timecardWrap.children.length === 0
			)
			{
				timecard.context.timecardWrap.add(webView);

				webView = null;

				if(timecard.context.__controllerPath !== "employeeOptions_timecardDetail")
					timecard.context.header.exit.show();
			}
			else if(timecard.context.timecardWrap.children.length > 0)
			{
				timecard.context.timecardWrap.removeAllChildren();

				timecard.context.timecardWrap.add(webView);

				webView = null;
			}
			else
			{
				timecard.context.timecardWrap.children[0].html = response.timecard;
			}

			timecard.context.removeClass(timecard.context.nextWeek, 'active');
			timecard.context.removeClass(timecard.context.previousWeek, 'active');

			if(OS_IOS){
				timecard.context.removeClass(timecard.context.nextWeekLbl, 'active');
				timecard.context.removeClass(timecard.context.previousWeekLbl, 'active');
			}

			// re enabling the buttons
			timecard.context.previousWeek.enabled = true;
			timecard.context.nextWeek.enabled = true;

			hideActivityIndicator();

			// adding view number for the help audio files
			Alloy.Collections.deviceHelp.audioPlayer.viewNo = '2000';
			// play help audio
			Alloy.Collections.deviceHelp.audioPlayer.play();
		}
	}catch(error){
		console.log('Error in timecard.handleHTMLresponse!');
		CloudClock.error(error);
	}
};

timecard.handlePRINTresponse = function(response){
	console.log(response);
	// get a handle to the as-yet non-existent directory
	var printTimecardDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'printTimecard');
	var printTimecardFile = 'timecardDetails.txt';
	var timecardFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, printTimecardFile);

	try{
		console.log('Does our Print Timecard folder exist? '+printTimecardDir.exists());

		if(printTimecardDir.exists() === false){
			console.log('\n No it does not exist create it.');
			printTimecardDir.createDirectory(); // this creates the directory
		}else{
			var existingTimecard = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+'printTimecard/', printTimecardFile);
			existingTimecard.deleteFile();
		}

		timecardFile.write(response.timecard);

		timecardFile.move('printTimecard/' + printTimecardFile);

		timecardFile = null;

		timecard.printer.print({
			file: 'printTimecard/' + printTimecardFile,
			text:{
				isMarkup: true
			},
			orientation : 'landscape',
			view : timecard.context.print,
			sentToPrinter: function(r){
				console.log('SentToPrinter callback: ' + JSON.stringify(r));
			}
		});
	}catch(error){
		CloudClock.error(error);
	}
};

timecard.handlePRINTReceiptResponse = function(response){
	console.log(response);
	try{
		var printText = response.timecard;
		printText += moment().format('MM/DD/YYYY hh:mm:ss a');
		var printingResult = timecard.receiptprinter.printReceiptText(printText);
		if (printingResult) {
			var resultObject = JSON.parse(printingResult);
			if (resultObject) {
				// resultObject.status
				if (resultObject.error) {
					var logInfo = resultObject.error;
					if (resultObject.suberror) {
						logInfo += " \r\nErrorDetail: " + resultObject.suberror
					}
					CloudClock.error(logInfo);
					// handle error message
					timecard.context.printReceiptError = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: 'Printer not available.',
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									timecard.context.printReceiptError.hide.apply(
										(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
												timecard.context :
												CloudClock.employeeOptions
									);
								}
							}
						}
					});

					timecard.context.printReceiptError.show.apply(
						(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
												timecard.context :
												CloudClock.employeeOptions
					);
				}
			}
		}
	}catch(error){
		CloudClock.error(error);
	}
};

timecard.submitPunchAndView = function(){
	CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' submitted a request to view their time post punch.');

	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = 0;

	var cfg = {
		endpoint: 'employeePrintTimecard',
		params: timecard.params,
		// timeout: 10000, // custom timeout for this request
		onSuccess: function(response){
			timecard.handleHTMLresponse(response);
		},
		onError: function(response){
			timecard.handleErrorResponse(response);
		},
		onOffline: function(response){
			timecard.handleOffline();
		},
		payload: {
			punch: {
				idType: CloudClock.sessionObj.currentPunch.idType,
				employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,
				transType: CloudClock.sessionObj.currentPunch.transType,
				departmentNum: CloudClock.sessionObj.currentPunch.departmentNum,
				command: "view",
				transTime: CloudClock.sessionObj.currentPunch.transTime,
				transSrc: 0,
				verified: 0,
				transDateTime: CloudClock.sessionObj.currentPunch.transDateTime,
				initials: CloudClock.sessionObj.currentPunch.initials
			}
		}
	};

	CloudClock.api.request(cfg);
};

timecard.handleJSONresponse = function(response){
	try{
		// response.weekEnding = 'N/A';

		// clean up the view
		_.each(timecard.context.timecardWrap.children, function(child){
			if(_.has(child, 'id') && child.id === 'timecardWebView')
				$.timecardWrap.remove(child);
		});
		// let's remove any error labels if they exist
		if(_.has(timecard, 'errorLabel'))
			timecard.context.timecardWrap.remove(timecard.errorLabel);

		if(response.weekEnding === 'N/A'){
			timecard.context.weekEnding = false;

			//timecard.context.weekNavBtns.hide();

			// show the error label
			var errorLabel = Ti.UI.createLabel({
				id: 'employeeNotRegistered',
				text: CloudClock.customL.strings('timesheetReq_notRegisteredEmpl'),
				color: '#333',
				top: '300dp'
			});

			if(timecard.context.__controllerPath !== "employeeFlow_hoursVerification"){
				timecard.context.timecardWrapHeader.hide();
				timecard.context.tableHolder.hide();

				timecard.context.timecardWrap.add(errorLabel);

				timecard.context.timecardWrap.show();

				timecard.context.timecardDetail.show();
			}else{

				timecard.context.timecardDetail.visible = (!timecard.context.timecardDetail.visible) ? true : true;

				timecard.context.tableLeftContainer.children[0].hide();
				timecard.context.tableLeftContainer.children[1].hide();
				timecard.context.tableLeftContainer.children[2].hide();

				errorLabel.top = '80dp';
				if(timecard.context.tableLeftContainer.children.length <= 3){ // do we have an error label already in place?
					timecard.context.tableLeftContainer.add(errorLabel);
				}
			}

			hideActivityIndicator();

			return false;
		}else{
			var dailySummary = [];
			var weeklySummary = [];
			var row = null;

			var endOfWeek = moment(response.weekEnding, "MM-DD-YYYY").format('MMMM D[,] YYYY');
			var startOfWeek = moment(response.weekEnding, "MM-DD-YYYY").subtract('days', 6).format('MMMM D[,] YYYY');
			var startOfWeekDayNum = moment(response.weekEnding, "MM-DD-YYYY").subtract('days', 6).day();

			timecard.context.timecardWrapHeader.setText(startOfWeek  + ' - ' + endOfWeek);

			var sorted_listOfDays = response.dailySummary.slice(startOfWeekDayNum).concat(response.dailySummary.slice(0,startOfWeekDayNum));

			_.each(sorted_listOfDays, function(rowData, i){

				row = Alloy.createController('employeeFlow_timecardDetailRow', {
					weekEnding: response.weekEnding,
					dayNumber: i,
					hours: rowData.totalHours.toFixed(2)
				}).getView();
				dailySummary.push(row);
				row = null;
			});

			// this is for weekly summary table
			var totalHours = 0;

			var paySummaryLength = response.paySummary.length;
			_.each(response.paySummary, function(item){
				var totalRow = Ti.UI.createTableViewRow({ height: '44dp' });
				var totalLabel1 = Ti.UI.createLabel({
					left: '10dp',
					color: '#333',
					font:{
						fontSize: '18dp'
					}
				});
				var totalLabel2 = Ti.UI.createLabel({
					right: '15dp',
					color: '#333',
					font:{
						fontSize: '18dp'
					}
				});

				if(item.sortId <= 10){
					totalHours = Number(totalHours + item.amount);
				}

				if(item.payCode.length === 0 && paySummaryLength <= 3){
					console.log('remove the empty row');
					
					weeklySummary.push(totalRow);
					weeklySummary.pop();
				}else{
					totalLabel1.text = item.payCode.replace(/\s*$/,"");
					totalLabel2.text = (item.payCode.length === 0) ? "" : item.amount.toFixed(2);

					totalRow.add(totalLabel1);
					totalRow.add(totalLabel2);
					weeklySummary.push(totalRow);
				}
				
				totalLabel1 = null;
				totalLabel2 = null;
				totalRow = null;
			});

			var totalRow = Ti.UI.createTableViewRow({ height: '44dp' });

			var totalLabel1 = Ti.UI.createLabel({
				text: "Total",
				left: '10dp',
				color: '#333',
				font:{
					fontSize: '18dp',
					fontWeight: 'bold'
				}
			});

			var totalLabel2 = Ti.UI.createLabel({
				text: totalHours.toFixed(2), // always show two decimal places,
				right: '15dp',
				color: '#333',
				font:{
					fontSize: '18dp',
					fontWeight: 'bold'
				}
			});

			totalRow.add(totalLabel1);
			totalRow.add(totalLabel2);
			weeklySummary.unshift(totalRow); // add at the top of the array


			if(timecard.context.__controllerPath !== "employeeFlow_hoursVerification"){
				// in case we had an error in the view before getting data
				var timecardWrapChildren = timecard.context.timecardWrap.getChildren();
				_.each(timecardWrapChildren, function(child){
					if(child.id === "employeeNotRegistered"){
						console.log('we have the rror screen up');

						timecard.context.timecardWrap.remove(child);
						timecard.context.timecardWrapHeader.show();
						timecard.context.tableHolder.show();
					}
				});
			}else{
				var tableLeftContainerChildren = timecard.context.tableLeftContainer.getChildren();
				_.each(tableLeftContainerChildren, function(child){
					if(child.id === "employeeNotRegistered"){
						console.log('we have the rror screen up');
						timecard.context.tableLeftContainer.remove(child);
						timecard.context.tableLeftContainer.children[1].show();
						timecard.context.tableLeftContainer.children[2].show();
					}
				});
			}
			
			timecard.context.tableWeeklySum.removeAllChildren();

			timecard.context.tableWeeklySum.height = (weeklySummary.length*44)+'dp'; // change table height based on the amount of rows

			timecard.context.tableWeeklySum.setData(weeklySummary);

			if(timecard.context.__controllerPath !== "employeeFlow_hoursVerification"){
				timecard.context.tableDailySum.removeAllChildren();

				timecard.context.tableDailySum.setData(dailySummary);
			}

			timecard.context.timecardWrap.show();

			timecard.context.timecardDetail.show();

			hideActivityIndicator();

			// G.C.
			console.log('\n\n\nGarbage collection in the getTimecardDetails_success fn.');
			
			totalLabel2 = null;
			totalLabel1 = null;
			totalRow = null;
			weeklySummary = null;
			dailySummary = null;
		}
	}catch(error){
		console.log('error in the handleJSONresponse: '+error);
		CloudClock.error(error);
	}
};

timecard.viewDetails = function(){
	CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' wants to see their time details.');
	
	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = 0;

	var cfg = {
		endpoint: 'employeeGetTimecardDetail',
		params: timecard.params,
		// timeout: 10000, // custom timeout for this request
		onSuccess: function(response){
			//console.log(response);
			timecard.handleJSONresponse(response);
		},
		onError: function(response){
			timecard.handleErrorResponse(response);
		}
	};

	CloudClock.api.request(cfg);
};

timecard.viewDetailsPrint = function(){
	CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' wants to print their timecard.');

	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = 0;

	var cfg = {
		endpoint: 'employeeGetTimecardDetailPrint',
		params: timecard.params,
		// timeout: 10000, // custom timeout for this request
		onSuccess: function(response){
			//console.log(response);
			timecard.handleHTMLresponse(response);
		},
		onError: function(response){
			timecard.handleErrorResponse(response);
		}
	};

	CloudClock.api.request(cfg);
};

// when we instantiate the card we know that in the UI we have a previuos and next buttons
// therefoer we have to accomodate that functionality
timecard.navigateWeeks = function(){
	try{
		timecard.context.restartTimeout();

		// no action taken if another API call is in progress
		if(CloudClock.APIcallInProgress)
				return false;

		if(this.classes.indexOf('disabled') > -1){
			//console.log('\n\n\nThis button is disabled!');

			this.removeEventListener('click', timecard.navigateWeeks);
			this.addEventListener('click', timecard.navigateWeeks);
			
			return false;
		}

		this.removeEventListener('click', timecard.navigateWeeks);

		timecard.context.removeClass(
			// is this previous or next?
			(this.id === 'previousWeek') ?
			this.parent.children[2] :
			this.parent.children[0],
			'disabled'
		);

		if(OS_IOS)
		{
			timecard.context.removeClass(
				// is this previous or next?
				(this.id === 'previousWeek') ?
				this.parent.children[2].children[0] :
				this.parent.children[0].children[0],
				'labelDisabled'
			);
		}

		// keep track of the week we are about to displaying
		timecard.context.week = this.week;
		// change the week in the parameters we are about to send to the server
		timecard.params.weekId = this.week;
		// get data and display
		if(timecard.context.__controllerPath !== "employeeOptions_timecardDetail" && timecard.context.__controllerPath !== "employeeFlow_hoursVerification") // context check!!!
		{
			timecard.context.activityIndicator.show();
			timecard.submitPunchAndView();
		}
		else
		{
			if(CloudClock.employeeOptions){
				CloudClock.employeeOptions.activityIndicator.show();
			}else{
				timecard.context.activityIndicator.show();
			}
			timecard.viewDetails();
		}
		

		function disableTheButton(_btn){
			timecard.context.addClass(_btn, 'disabled');
			_btn.enabled = false;

			if(OS_IOS){
				timecard.context.addClass(_btn.children[0], 'labelDisabled');
			}
		}

		// change the week numbers in the button properties
		if(this.id === 'previousWeek' && this.week === 3)
		{
			// disable the previousWeek btn
			disableTheButton(this);
			// change the week num on the next week btn
			this.parent.children[2].week = this.week -1;
		}
		else if(this.id === 'previousWeek')
		{
			// change the week num on the next week btn
			this.parent.children[2].week = this.week -1;
			// change the week num on the previousWeek btn
			this.week = this.week + 1;
		}
		else if(this.id === 'nextWeek' && this.week === 0)
		{
			disableTheButton(this);
			// change the week num on the previous week btn
			this.parent.children[0].week = this.week +1;
		}
		else if(this.id === 'nextWeek')
		{
			// change the week num on the previousWeek btn
			this.parent.children[0].week = this.week + 1;
			// change the week num on the next week btn
			this.week = this.week - 1;
		}

		this.addEventListener('click', timecard.navigateWeeks);
	}catch(error){
		CloudClock.error(error);
	}
};

timecard.prevNextChangeBackground = function(e){
	try{
		if(this.classes.indexOf('disabled') > -1){

			this.removeEventListener(e.type, timecard.prevNextChangeBackground);
			this.addEventListener(e.type, timecard.prevNextChangeBackground);
			
			return false;
		}
		this.removeEventListener(e.type, timecard.prevNextChangeBackground);
		this.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : 'transparent';
		this.addEventListener(e.type, timecard.prevNextChangeBackground);
	}catch(error){
		CloudClock.error(error);
	}
};

timecard.commButtonsChangeColor = function(e){
	e.source.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#fff';
	e.source.children[1].color = (e.type === 'touchstart') ? '#fff' : '#34aadc';
};

// also we know that the user will want to email or text themselves the timecard
// so we have to accomodate that also
timecard.emailMe = function(){
	// no action taken if another API call is in progress
	if(CloudClock.APIcallInProgress)
			return false;

	CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' emailed themselves a copy of their timecard.');

	if(this.id === 'email'){ // we could be calling this method without a button click
		this.removeEventListener('click', timecard.emailMe);

		// restart timeout for the context
		timecard.context.restartTimeout();

		this.addEventListener('click', timecard.emailMe);
	}

	// show activity indicator for the context

	// build request with current data
	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = timecard.context.week;

	var cfg = {
		endpoint: 'employeeEmailTimecard',
		params: timecard.params,
		onSuccess: function(response){
			//console.log(response);

			// hide the activity indicator for the context
			// hideActivityIndicator();

			// let the user know their request was successfull
			timecard.confirmationMessage.message.text = CloudClock.customL.strings('email_success_A');

			timecard.confirmationMessage.add();

			timecard.confirmationMessage.remove();
		},
		onError: function(response){
			CloudClock.log('Error', 'Request for email errored out: '+JSON.stringify(response));

			timecard.context.emailReqError = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: 'Sorry, an error occurred while processing your request.',
				callback:{
					eType: 'click',
					action: function(_e){
						if(_e.source.id === this.cancel){
							timecard.context.emailReqError.hide.apply(
								(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
							);
						}
					}
				}
			});

			timecard.context.emailReqError.show.apply(
				(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
			);
		}
	};
	// send the request
	CloudClock.api.request(cfg);
};

timecard.textMe = function(){
	// no action taken if another API call is in progress
	if(CloudClock.APIcallInProgress)
			return false;

	CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' texted themselves a copy of their timecard.');

	if(this.id === 'text'){ // we could be calling this method without a button click
		this.removeEventListener('click', timecard.textMe);

		// restart timeout for the context
		timecard.context.restartTimeout();

		this.addEventListener('click', timecard.textMe);
	}
	
	// show activity indicator for the context

	// build the request with current data
	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = timecard.context.week;

	var cfg = {
		endpoint: 'employeeTextTimecard',
		params: timecard.params,
		onSuccess: function(response){
			console.log(response);

			// hide the activity indicator for the context
			// hideActivityIndicator();

			// let the user know their request was successfull
			timecard.confirmationMessage.message.text = CloudClock.customL.strings('text_success_A');

			timecard.confirmationMessage.add();

			timecard.confirmationMessage.remove();
		},
		onError: function(response){
			// console.log(response);
			CloudClock.log('Error', 'Request for text errored out: '+JSON.stringify(response));

			timecard.context.textReqError = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: 'Sorry, an error occurred while processing your request.',
				callback:{
					eType: 'click',
					action: function(_e){
						if(_e.source.id === this.cancel){
							timecard.context.textReqError.hide.apply(
								(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
							);
						}
					}
				}
			});

			timecard.context.textReqError.show.apply(
				(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
			);
		}
	};
	// send the request
	CloudClock.api.request(cfg);
};

timecard.printMe = function(){
	// no action taken if another API call is in progress
	if(CloudClock.APIcallInProgress)
			return false;

	console.log('Employee has clicked the print button');

	// restart timeout for the context
	timecard.context.restartTimeout();

	// build request with current data
	timecard.params.weekId = timecard.context.week;
	timecard.params.screenId = timecard.context.week;

	var cfg = {
		//endpoint: 'employeeGetTimecardDetailPrint',
		endpoint: 'employeeGetTimecardDetailPrintReceipt',  //'employeeGetTimecardDetailPrint',
		params: timecard.params,
		onSuccess: function(response){
			//timecard.handlePRINTresponse(response);
			timecard.handlePRINTReceiptResponse(response);
		},
		onError: function(response){
			CloudClock.log('Error', 'Request for print errored out: '+JSON.stringify(response));

			timecard.context.couldNotPrint = CloudClock.customAlert.create({
				type: 'alert',
				cancel: 0,
				buttonNames: [CloudClock.customL.strings('ok')],
				title: CloudClock.customL.strings('alert'),
				message: CloudClock.customL.strings('couldNotPrint'),
				callback:{
					eType: 'click',
					action: function(_e){
						timecard.context.couldNotPrint.hide.apply(
							(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
						);
					}
				}
			});

			// NEED TO HIDE THE ACTIVITY INDICATOR IF SHOWING!!!!
			hideActivityIndicator();
			
			timecard.context.couldNotPrint.show.apply(
				(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
			);

			console.log(response);
		}
	};

	CloudClock.log('Info', 'Requested print timecard for employee: '+CloudClock.sessionObj.employee.get('name')+', CFG - badge: '+cfg.params.badge);

	CloudClock.api.request(cfg);
};

timecard.setUpEmplComm = function(){
	// in case the employee does not have a cell phone and email set up 
	// let them set it up :)
	try{
		// no action taken if another API call is in progress
		if(CloudClock.APIcallInProgress)
				return false;
			
		// do we need to disable any UI buttons? hmm maybe?
		timecard.context.weekNavBtns.setVisible(false);

		if(timecard.context.__controllerPath === "employeeFlow_hoursVerification" && !_.isObject(timecard.context.hoursVerificationChildren)){
			timecard.context.hoursVerificationChildren = timecard.context.timecardWrap.getChildren();
		}

		// remove the $.timecardWrap children
		timecard.context.timecardWrap.removeAllChildren();

		// gotta build the view here
		var instructions = Ti.UI.createLabel({
			top: '20dp',
			height: '80dp',
			font: {
				fontSize: '24dp'
			},
			color: '#333',
			text: (this.id === 'text') ?
					CloudClock.customL.strings('instructions_cell'):
					CloudClock.customL.strings('instructions_email')
		});

		var textField = Ti.UI.createTextField({
			id: (this.id === 'text') ?
				'dialogTxtFieldCell' :
				'dialogTxtFieldEmail',
			hintText: (this.id === 'text') ?
						'000-000-0000':
						'john.doe@company.com',
			top: '100dp',
			height: '60dp',
			width: '60%',
			borderWidth: 1,
			borderColor: '#e4e4e4',
			borderRadius: 10,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: '40dp'
			},
			color: '#333',
			keyboardType: (this.id === 'text') ?
							Ti.UI.KEYBOARD_PHONE_PAD:
							Ti.UI.KEYBOARD_EMAIL,
			autocapitalization: Ti.UI. TEXT_AUTOCAPITALIZATION_NONE
		});

		textField.addEventListener('change', function(){
			console.log('Restart timeout for context');

			timecard.context.restartTimeout();
		});

		if(this.id === 'text'){
			// adding view number for the help audio files
			Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1800';

			var picker =Ti.UI.createPicker({
				id: 'picker',
				selectionIndicator: true,
				useSpinner: true,
				top: '180dp',
				width: '60%',
				borderColor: '#e4e4e4',
				borderRadius: 10,
				visibleItems: 4
			});

			var pickerColumn = Ti.UI.createPickerColumn({
				id: 'cellCarriers'
			});

			// get cell phone carriers
			var cellCarriers = Alloy.Collections.parameters.getCellCarriersNames();
			var sortArr = []; // interim array to sort the cell carrier rows alphabetically
			// build picker rows
			for(var i=0, ilen=cellCarriers.length; i<ilen; i++){
				var row = Ti.UI.createPickerRow({
					title: cellCarriers[i],
					order: i,
					borderWidth: 1,
					borderColor: "#e4e4e4",
					fontSize: '24dp'
				});

				//pickerColumn.addRow(row);
				sortArr.push(row);
				row = null;
			}
			cellCarriers = null;

			sortArr.sort(function(a, b) {
				var textA = a.title.toUpperCase();
				var textB = b.title.toUpperCase();
				return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});

			picker.addEventListener('change', function(){
				timecard.context.restartTimeout();
			});

			//picker.add(pickerColumn);

			picker.add(sortArr);

			sortArr = null;
			pickerColumn = null;

			timecard.context.timecardWrap.add(picker);
		}else{
			// adding view number for the help audio files
			Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1900';
		}
		
		var buttonWrap = Ti.UI.createView({
			id: 'buttonWrap',
			top: (OS_IOS) ? '420dp' : '300dp',
			width: '60%',
			backgroundColor: '#fcfcfc',
			layout: 'horizontal'
		});
		// change these names not valid anymore
		var cancel = Ti.UI.createLabel({
			id: (this.id === 'text') ?
				'cancelCell' :
				'cancelEmail',
			width: '45%',
			height: '100dp',
			backgroundColor: '#ff2d55',
			color: '#fff',
			borderRadius: 10,
			borderColor: '#ff2d55',
			font: {
				fontSize: '28dp',
				fontWeight: 'bold'
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: CloudClock.customL.strings('cancel')
		});

		cancel.addEventListener('click', function(){
			console.log(this.id);

			// remove all children from timecardWrap
			timecard.context.timecardWrap.removeAllChildren();
			// show the nav buttons
			timecard.context.weekNavBtns.setVisible(true);

			// get data and display
			if(timecard.context.__controllerPath !== "employeeOptions_timecardDetail" && timecard.context.__controllerPath !== "employeeFlow_hoursVerification") // context check!!!
			{
				timecard.context.activityIndicator.show();
				// show the timecard web view
				timecard.submitPunchAndView();
			}
			else
			{
				if(CloudClock.employeeOptions){
					CloudClock.employeeOptions.__views.sideBarMenu.children[0].fireEvent('click'); // reload the detail timecard
				}else{
					_.each(timecard.context.hoursVerificationChildren, function(child){
						timecard.context.timecardWrap.add(child);
					});
					timecard.viewDetails();
				}
			}
		});

		var save = Ti.UI.createLabel({
			id: (this.id === 'text') ?
				'saveCell' :
				'saveEmail',
			width: '45%',
			height: '100dp',
			left: '9.5%',
			backgroundColor: '#62bb47',
			color: '#fff',
			borderRadius: 10,
			borderColor: '#62bb47',
			font: {
				fontSize: '28dp',
				fontWeight: 'bold'
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: CloudClock.customL.strings('save')
		});

		save.addEventListener('click', function(){
			console.log(this.id);

			var textFieldValue = '';
			var carrier = '';

			// if cell phone or email
			if(this.id === 'saveCell'){
				CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' is attempting to set their cell phone.');
				textFieldValue =  textField.getValue().replace(/\D/g,'');

				// is the value zero?
				if(textFieldValue.length !== 10){
					// alert(CloudClock.customL.strings('enter_valid_cellNum'));
					timecard.context.enter_valid_cellNum = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('enter_valid_cellNum'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									
									timecard.context.enter_valid_cellNum.hide.apply(
										(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
									);

									textField.value = "";
								}
							}
						}
					});

					timecard.context.enter_valid_cellNum.show.apply(
						(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
						timecard.context :
						CloudClock.employeeOptions
					);

					return false;
				}else{
					// get carrier name
					carrier = picker.getSelectedRow(0).title;
					// get carrier numebr
					order = parseInt(picker.getSelectedRow(0).order, 10) + 1;
					
					timecard.context.cellPhoneConfDialog = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('no'), CloudClock.customL.strings('yes')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('correct_info') + '\n' +
								CloudClock.customL.strings('cell_phone') + textFieldValue + '\n' +
								CloudClock.customL.strings('cell_carrName') + carrier,
						callback: {
							eType: 'click',
							action: function(_e){
								if(_e.source.id !== this.cancel){
									// save the cell phone number and carrier to the employee
									CloudClock.sessionObj.employee.save({
										cellPhone: textFieldValue,
										cellCarrier: order
									});

									// set payload and call server here
									var setText_cfg = {
										endpoint: 'employeeProfile',
										params: timecard.setEmplCommParams,
										payload:{
											"parm1": textFieldValue, //	the phone number entered by the user
											"parm2": order,	//	number of the cell carrier in the array of carriers
											"itemID": "Mobile" // type of request in this case Mobile
										},
										onSuccess: function(response){
											console.log(response);
											// send the requested information to the cell phone
											timecard.textMe();
											// remove the $.timecardWrap children
											timecard.context.timecardWrap.removeAllChildren();

											if(timecard.context.__controllerPath === "employeeFlow_hoursVerification"){
												_.each(timecard.context.hoursVerificationChildren, function(child){
													timecard.context.timecardWrap.add(child);
												});
												timecard.viewDetails();
											}

											// do we need to enable any UI buttons? hmm maybe?
											timecard.context.weekNavBtns.visible = true;
											// let's update the event response for this button
											timecard.context.text.removeEventListener('click', timecard.setUpEmplComm);
											timecard.context.text.addEventListener('click', timecard.textMe);
										},
										onError: function(response){
											Ti.API.error('Error: ' + JSON.stringify(response));
										}
									};

									CloudClock.api.request(setText_cfg);
								}

								timecard.context.cellPhoneConfDialog.hide.apply(
										(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
									);
							}
						}
					});

					timecard.context.cellPhoneConfDialog.show.apply(
							(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
							timecard.context :
							CloudClock.employeeOptions
						);
				}
				
			}
			else
			{
				CloudClock.log('Info', CloudClock.sessionObj.employee.get('name')+' is attempting to set their email.');
				textFieldValue = textField.getValue();
				var n =  textFieldValue
								.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

				if(n)
				{
					CloudClock.sessionObj.employee.save({email: textFieldValue});

					var setEmail_cfg = {
						endpoint: 'employeeProfile',
						params: timecard.setEmplCommParams,
						payload:{
							"parm1": textFieldValue, // email adress provided by the user
							"parm2": 0,
							"itemID": "Email" // type of request in this case email
						},
						onSuccess: function(response){
							console.log(response);
							// send the requested information to the cell phone
							timecard.emailMe();
							// remove the $.timecardWrap children
							timecard.context.timecardWrap.removeAllChildren();

							if(timecard.context.__controllerPath === "employeeFlow_hoursVerification"){
								_.each(timecard.context.hoursVerificationChildren, function(child){
									timecard.context.timecardWrap.add(child);
								});
								timecard.viewDetails();
							}

							// do we need to enable any UI buttons? hmm maybe?
							timecard.context.weekNavBtns.visible = true;

							// let's update the event response for this button
							timecard.context.email.removeEventListener('click', timecard.setUpEmplComm);
							timecard.context.email.addEventListener('click', timecard.emailMe);
						},
						onError: function(response){
							Ti.API.error(JSON.stringify(response));
						}
					};

					CloudClock.api.request(setEmail_cfg);

				}
				else
				{
					// alert(CloudClock.customL.strings('enter_valid_email'));
					timecard.context.enter_valid_email = CloudClock.customAlert.create({
						type: 'alert',
						cancel: 0,
						buttonNames: [CloudClock.customL.strings('ok')],
						title: CloudClock.customL.strings('alert'),
						message: CloudClock.customL.strings('enter_valid_email'),
						callback:{
							eType: 'click',
							action: function(_e){
								if(_e.source.id === this.cancel){
									
									timecard.context.enter_valid_email.hide.apply(
										(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
										timecard.context :
										CloudClock.employeeOptions
									);

									textField.value = "";
								}
							}
						}
					});
					
					timecard.context.enter_valid_email.show.apply(
						(timecard.context.__controllerPath !== "employeeOptions_timecardDetail") ?
						timecard.context :
						CloudClock.employeeOptions
					);

					return false;
				}
			}
		});

		buttonWrap.add(cancel);
		buttonWrap.add(save);

		// add the setup view
		timecard.context.timecardWrap.add(instructions);
		timecard.context.timecardWrap.add(textField);
		timecard.context.timecardWrap.add(buttonWrap);

		// play help audio
		Alloy.Collections.deviceHelp.audioPlayer.play();
	}catch(error){
		console.log('Error setUpEmplComm');
		CloudClock.error(error);
	}
};

// at init of the timecard we want to know what context (flow) the user is in
// it could be the clock in/out
// or the options context, so we will add that to be an argument at init
// we also have the employee stored in the session so we can use that information
timecard.init = function(_context){
	// we are initializing the timecard
	timecard.context = _context;

	timecard.confirmationMessage.create(); // create the notification

	timecard.params = {
		'termID' : Ti.App.Properties.getString('TERMID'),
		'badge': CloudClock.sessionObj.employee.get('badge'),
		'weekId': 0
	};

	CloudClock.log('Info', 'Timecard initialized for employee: '+CloudClock.sessionObj.employee.get('name'));

	timecard.setEmplCommParams = {
		'termID' : Ti.App.Properties.getString('TERMID'),
		'badge': CloudClock.sessionObj.employee.get('badge')
	};
};

timecard.gc = function(){
	console.log('\n\nTimecard garbage collection :)');

	timecard.context = null;

	// ui elements
	timecard.confirmationMessage.message = null;

	// get rid of timeout
	delete timecard.confirmationDialog_timeout;
	// and error label
	if(_.has(timecard, 'errorLabel'))
		delete timecard.errorLabel;
};

module.exports = {
	init: timecard.init,
	submitPunchAndView: timecard.submitPunchAndView,
	viewDetails: timecard.viewDetails,
	viewDetailsPrint: timecard.viewDetailsPrint,
	navigateWeeks: timecard.navigateWeeks,
	prevNextChangeBackground: timecard.prevNextChangeBackground,
	textMe: timecard.textMe,
	emailMe: timecard.emailMe,
	printMe: timecard.printMe,
	setUpEmplComm: timecard.setUpEmplComm,
	commButtonsChangeColor: timecard.commButtonsChangeColor,
	gc: timecard.gc // MUST REMEBER TO DO GARBAGE COLLECTION ON THE TIMECARD ONCE THE CONTROLLER IS DONE WITH IT!!!!
};



