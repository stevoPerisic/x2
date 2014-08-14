
function emptyFn(){}

function addBtnEvents(){

	$.deleteBtn.addEventListener('touchstart', changeColor);
	$.deleteBtn.addEventListener('touchend', deleteBtn);
	$.deleteBtn.removeEventListener('doubletap', emptyFn);

	//Pin Pad number buttons event listener
	_.each($.__views, function(el){
		if(el.id.indexOf('__alloy') === 0 && el.id !== 'disabledButton'){
			el.enabled = true;
			el.addEventListener('touchstart', changeColor);
			el.addEventListener('touchend', pinPadGetVal);
			el.addEventListener('doubletap', emptyFn);
		}
	});

	console.log('\n\n\n\nPin pad events added!!!');
}

function removeBtnEvents(){

	$.deleteBtn.removeEventListener('touchstart', changeColor);
	$.deleteBtn.removeEventListener('touchend', deleteBtn);
	$.deleteBtn.removeEventListener('doubletap', emptyFn);

	_.each($.__views, function(el){
		if(el.id.indexOf('__alloy') === 0 && el.id !== 'disabledButton'){
			el.enabled = false;
			el.removeEventListener('touchstart', changeColor);
			el.removeEventListener('touchend', pinPadGetVal);
			el.removeEventListener('doubletap', emptyFn);
		}
	});

	console.log('\n\n\n\nPin pad events removed!!!');
}

var buttonGradient = {
	type: 'linear',
    startPoint: { x: '0', y: '0' },
    endPoint: { x: '0', y: '100' },
    colors: ['#f0f0f0', '#fafafa'],
    backFillStart: false
};

function changeColor(e){
	var button = e.source;
	button.backgroundGradient = {};
	button.backgroundColor = '#34aadc';

	$.changeBackgroundTimeout = setTimeout(function(){
		if(typeof $.changeBackgroundTimeout === 'number'){
			clearTimeout($.changeBackgroundTimeout);
			delete $.changeBackgroundTimeout;
		}
		button.backgroundGradient = buttonGradient;
		button.backgroundColor = 'transparent';
	}, 100);
}

function pinPadGetVal(e){

	// e.source.backgroundGradient = buttonGradient;
	// e.source.backgroundColor = 'transparent';

	buttonValue = e.source.title.match(/[0-9]/);
	txtFieldValue = $.pinPadTxtField.getValue();

	if(args.mode === 'openDepartment' && USEDEPTCODE !== '0' && txtFieldValue.length === DEPTCODELEN){
		console.log('remove the events');
		return false;
	}else if(args.mode === 'openDepartment' && USEDEPTCODE === '0' && txtFieldValue.length === DEPTNUMLEN){
		console.log('remove the events');
		return false;
	}

	if(buttonValue !== null){
		txtFieldValue += buttonValue;
	}

	$.pinPadTxtField.setValue(txtFieldValue);

	removeBtnEvents();

	if(args.mode === 'terminalID' && txtFieldValue.length === 10){
		CloudClock.log('Info', 'Terminal ID: ' + txtFieldValue + ' was entered to initialize the Cloud Clock.');

		sendTerminalID(txtFieldValue);
	}
	else if(args.mode === 'enterPin' && txtFieldValue.length === PINLENGTH){
		sendEmployeePin(txtFieldValue);
	}
	else if(args.mode === 'openDepartment'){
		args.reduceDepartments($.pinPadTxtField);
	}
	// if(args.mode === 'enterBreakAmount'){
	// 	Do nothing just display amount in the text field we have a submit button on that page to submit the time taken
	else if(args.mode === 'manager' && (txtFieldValue.length === MGRPIN.length || txtFieldValue.length === MGR2PIN.length)){
		CloudClock.log('Info', 'Manager PIN: ' + txtFieldValue + ' was entered to start Manager Flow.');

		CloudClock.parent.manager_login({managerPin: txtFieldValue});
	}

	addBtnEvents();
}

function deleteBtn(e){
	// e.source.backgroundGradient = buttonGradient;
	// e.source.backgroundColor = 'transparent';

	txtFieldValue = $.pinPadTxtField.getValue();
	txtFieldValue = txtFieldValue.slice(0, -1);
	
	$.pinPadTxtField.setValue(txtFieldValue);
	
	removeBtnEvents();

	// this added for open depts search capability
	if(args.mode === 'openDepartment'){
		args.reduceDepartments($.pinPadTxtField);
	}

	addBtnEvents();
}

function sendTerminalID(terminalID){
	$.pinPadTxtField.setValue('');

	CloudClock.parent.activityIndicator.setMessage('Starting initialization...');
	CloudClock.parent.activityIndicator.show();
	CloudClock.parent.initialize({terminalID: terminalID});

	addBtnEvents();

	$.pinPadTxtField.setHintText(CloudClock.customL.strings('enter_pin'));
	args.mode = 'enterPin';
}

function getPinSettings(){
	PINLENGTH = parseInt(Ti.App.Properties.getString('PINLENGTH'), 10);
	MGRPIN = Ti.App.Properties.getString('MGRPIN');
	MGR2PIN = Ti.App.Properties.getString('MGR2PIN');
}

function sendEmployeePin(employeePin){
	Ti.App.Properties.setString('PINFORSHOW', employeePin);

	employeePin = parseInt(employeePin, 10);//THIS HERE SOLVES THE LEADING ZEROS GOSH DARN IT!
	
	CloudClock.parent.activityIndicator.setMessage('Searching Employees...');
	CloudClock.parent.activityIndicator.show();
	CloudClock.parent.employee_login({employeePin: employeePin});
}

//*****************************************
//*********	Cloud Clock Widgets ***********
//*****************************************
//*******	Pin Pad Widget ****************
//*****************************************
console.log('PIN PAD being read....');

if(_.isEmpty(CloudClock.sessionObj.employee)){
	Ti.App.Properties.setString("CURRLANGUAGETYPE", Ti.App.Properties.getString("LANGUAGETYPE"));
}

var args = arguments[0] || {};
var buttonValue;
var txtFieldValue;
var PINLENGTH;
var MGRPIN;
var MGR2PIN;
var USEDEPTCODE = Ti.App.Properties.getString('USEDEPTCODE');
var DEPTCODELEN = Ti.App.Properties.getString('DEPTCODELEN');
var DEPTNUMLEN = 3; // always 3, PeopleNet setting :)

$.pinPadTxtField.setValue('');
$.pinPadTxtField.blur();

addBtnEvents();

getPinSettings();

if(!Ti.App.Properties.hasProperty('seeded')){
	$.pinPadTxtField.setHintText(CloudClock.customL.strings('enter_terminal'));
	args.mode = 'terminalID';
}else{
	$.pinPadTxtField.setHintText(CloudClock.customL.strings('enter_pin'));
	args.mode = 'enterPin';
}

exports.changeMode = function(e){
	console.log('Changing pin pad mode to: ' + e.mode);
	// CloudClock.log('Info','Changing pin pad mode to: ' + e.mode);

	args.mode = e.mode;

	if(args.mode === 'terminalID')
	{
		$.pinPadTxtField.setHintText(CloudClock.customL.strings('enter_terminal'));
	}
	else if(args.mode === 'enterPin')
	{
		$.pinPadTxtField.setHintText(CloudClock.customL.strings('enter_pin'));
	}
	else if(args.mode === 'openDepartment')
	{
		// $.pinPadTxtField.setHintText(CloudClock.customL.strings('openDept_textField'));
		$.pinPadTxtField.setHintText(Ti.App.Properties.getString('DEPTCODELEN'));
		args.reduceDepartments = e.reduceDepartments;
	}
	else if(args.mode === 'enterBreakAmount'){
		$.pinPadTxtField.setHintText(e.hintText);
		$.pinPadTxtField.itemID = e.itemID;
		$.pinPadTxtField.itemType = e.itemType;
	}
};

exports.clearPinPadTxtField = function(){ $.pinPadTxtField.setValue(''); };

exports.addBtnEvents = function(){ addBtnEvents(); };

exports.removeBtnEvents = function(){ removeBtnEvents(); };

exports.getPinSettings = function(){ getPinSettings(); };






