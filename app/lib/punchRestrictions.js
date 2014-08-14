var restrictions = {
	IN: parseInt(Ti.App.Properties.getString('INPUNCHRESTRICT'), 10) * 60000, // INPUNCHRESTRICT (comes in minutes) in milliseconds
	OUT: parseInt(Ti.App.Properties.getString('OUTPUNCHRESTRICT'), 10) * 60000, // OUTPUNCHRESTRICT (comes in minutes) in milliseconds
	INOUT: parseInt(Ti.App.Properties.getString('OUTINPUNCHRESTRICT'), 10) * 60000, // OUTINPUNCHRESTRICT (comes in minutes) in milliseconds
	// in the sessionObj these will have 1, 2, 3 numbers to trigger dialog boxes
};

function getProps(){
	restrictions.IN = parseInt(Ti.App.Properties.getString('INPUNCHRESTRICT'), 10) * 60000; // INPUNCHRESTRICT (comes in minutes) in milliseconds
	restrictions.OUT = parseInt(Ti.App.Properties.getString('OUTPUNCHRESTRICT'), 10) * 60000; // OUTPUNCHRESTRICT (comes in minutes) in milliseconds
	restrictions.INOUT = parseInt(Ti.App.Properties.getString('OUTINPUNCHRESTRICT'), 10) * 60000; // OUTINPUNCHRESTRICT (comes in minutes) in milliseconds
}

module.exports.inPunch = function(){
	getProps();
	var sessionObj = CloudClock.sessionObj;
	var untilCanGoBackIn = restrictions.INOUT - sessionObj.difference;

	try{
		if(_.keys(sessionObj.previousClockOuts).length > 0 && sessionObj.latestTransaction.transType === 'O' && sessionObj.difference < restrictions.INOUT){
			// tell them how much longer they have until they can clock back in
			console.log('Employee can clock back in after: '+(moment(untilCanGoBackIn).format('mm [minutes.]')));
			sessionObj.restrictionDialog = 3;
			return false;
		}else if( _.keys(sessionObj.previousClockIns).length > 0 && sessionObj.difference < restrictions.IN  && sessionObj.last_inPunch.departmentNum === sessionObj.currentPunch.departmentNum){
			// already clocked in
			console.log('Employee already clocked in, have to clock out first!');
			sessionObj.restrictionDialog = 1;
			return false;
		}else{
			return true;
		}
	}catch(error){
		CloudClock.error(error);
	}
};

module.exports.outPunch = function(){
	getProps();
	var sessionObj = CloudClock.sessionObj;
	try{
		// check for the restrictionOUT -> "the employee can not clcok out of the shift for a set period of time"
		if(_.keys(sessionObj.previousClockOuts).length > 0 && sessionObj.difference <= restrictions.OUT){
			console.log('Employee already clocked out, have to clock in first!');
			sessionObj.restrictionDialog = 2;
			return false;
		}else{
			return true;
		}
	}catch(error){
		CloudClock.error(error);
	}
};