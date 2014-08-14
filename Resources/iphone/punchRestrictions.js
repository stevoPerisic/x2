function getProps() {
    restrictions.IN = 6e4 * parseInt(Ti.App.Properties.getString("INPUNCHRESTRICT"), 10);
    restrictions.OUT = 6e4 * parseInt(Ti.App.Properties.getString("OUTPUNCHRESTRICT"), 10);
    restrictions.INOUT = 6e4 * parseInt(Ti.App.Properties.getString("OUTINPUNCHRESTRICT"), 10);
}

var restrictions = {
    IN: 6e4 * parseInt(Ti.App.Properties.getString("INPUNCHRESTRICT"), 10),
    OUT: 6e4 * parseInt(Ti.App.Properties.getString("OUTPUNCHRESTRICT"), 10),
    INOUT: 6e4 * parseInt(Ti.App.Properties.getString("OUTINPUNCHRESTRICT"), 10)
};

module.exports.inPunch = function() {
    getProps();
    var sessionObj = CloudClock.sessionObj;
    var untilCanGoBackIn = restrictions.INOUT - sessionObj.difference;
    try {
        if (_.keys(sessionObj.previousClockOuts).length > 0 && "O" === sessionObj.latestTransaction.transType && sessionObj.difference < restrictions.INOUT) {
            console.log("Employee can clock back in after: " + moment(untilCanGoBackIn).format("mm [minutes.]"));
            sessionObj.restrictionDialog = 3;
            return false;
        }
        if (_.keys(sessionObj.previousClockIns).length > 0 && sessionObj.difference < restrictions.IN && sessionObj.last_inPunch.departmentNum === sessionObj.currentPunch.departmentNum) {
            console.log("Employee already clocked in, have to clock out first!");
            sessionObj.restrictionDialog = 1;
            return false;
        }
        return true;
    } catch (error) {
        CloudClock.error(error);
    }
};

module.exports.outPunch = function() {
    getProps();
    var sessionObj = CloudClock.sessionObj;
    try {
        if (_.keys(sessionObj.previousClockOuts).length > 0 && sessionObj.difference <= restrictions.OUT) {
            console.log("Employee already clocked out, have to clock in first!");
            sessionObj.restrictionDialog = 2;
            return false;
        }
        return true;
    } catch (error) {
        CloudClock.error(error);
    }
};