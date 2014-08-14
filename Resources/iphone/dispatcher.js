var previousView = "";

exports.route = function(global, container, viewToOpen, viewToClose, data, extraParams) {
    console.log(global);
    try {
        if (viewToClose && void 0 !== CloudClock[global][container][previousView]) {
            CloudClock[global][container].removeAllChildren();
            CloudClock[global][container][previousView].destroy();
            CloudClock[global][container][previousView] = null;
        }
        CloudClock[global][container][viewToOpen] = Alloy.createController(viewToOpen, {
            data: data,
            extraParams: extraParams
        });
        CloudClock[global][container].add(CloudClock[global][container][viewToOpen].getView());
        previousView = viewToOpen;
    } catch (error) {
        CloudClock.error(error);
    }
};

var softScheduling = require("softScheduling");

var employeeFlow = {
    checkPhoto: function() {
        console.log("Checking photo...");
        var CAPTUREPHOTO = Ti.App.Properties.getString("CAPTUREPHOTO");
        console.log("Checking photo..." + CAPTUREPHOTO);
        if ("1" === CAPTUREPHOTO) {
            CloudClock.sessionObj.nextWindow = "employeeFlow_cameraView";
            return false;
        }
        console.log("Keep checking down the line!");
        return true;
    },
    checkDepartments: function() {
        console.log("Checking depts...");
        var OPENDEPT = Ti.App.Properties.getString("OPENDEPT");
        var employee = CloudClock.sessionObj.employee;
        var employeeDepartments = CloudClock.sessionObj.employeeDepartments;
        console.log("Checking Open depts..." + OPENDEPT);
        if ("1" === OPENDEPT || "1" === employee.get("allowOpenDept") || 1 === employee.get("allowOpenDept") || employeeDepartments.length > 0) {
            CloudClock.sessionObj.nextWindow = "employeeFlow_departmentSelection";
            return false;
        }
        console.log("Keep checking down the line!");
        return true;
    },
    checkSoftScheduling: function(_context) {
        console.log("Checking Soft scheduling...");
        var SOFTSCHEDULING = Ti.App.Properties.getString("SOFTSCHEDULING");
        if ("1" === SOFTSCHEDULING) {
            if ("I" === CloudClock.sessionObj.currentPunch.transType) {
                if (softScheduling.inPunch(_context)) {
                    console.log("Break out!");
                    return false;
                }
                console.log("Keep checking down the line!");
                return true;
            }
            if (softScheduling.outPunch(_context)) {
                console.log("Break out!");
                return false;
            }
            console.log("Keep checking down the line!");
            return true;
        }
        return true;
    },
    checkShortLunch: function(_context) {
        console.log("Checking Short lunch...");
        var SHORTLUNCH = Ti.App.Properties.getString("SHORTLUNCH");
        if (0 !== SHORTLUNCH) {
            if (softScheduling.shortLunch(_context)) {
                console.log("Break out!");
                return false;
            }
            console.log("Keep checking down the line!");
            return true;
        }
        return true;
    },
    checkConfirmation: function(_context) {
        console.log("Checking Confirmation...");
        var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
        var SOFTSCHEDULING = Ti.App.Properties.getString("SOFTSCHEDULING");
        if ("1" === CONFIRMATION && "0" === SOFTSCHEDULING) {
            CloudClock.sessionObj.nextWindow = "employeeFlow_clockInConfirmation";
            console.log("Go to confirmation!");
            return false;
        }
        if ("1" === CONFIRMATION && "0" !== SOFTSCHEDULING) {
            if (softScheduling.immediatePunch(_context)) {
                CloudClock.sessionObj.nextWindow = "employeeFlow_missedBreak";
                console.log("Go to missed break!");
            } else {
                CloudClock.sessionObj.nextWindow = "employeeFlow_hoursVerification";
                console.log("Go to hours verif/SS confirmation!");
            }
            return false;
        }
        if ("0" === CONFIRMATION && "0" !== SOFTSCHEDULING) {
            if (softScheduling.immediatePunch(_context)) {
                CloudClock.sessionObj.nextWindow = "employeeFlow_missedBreak";
                console.log("Go to missed break!");
            } else {
                CloudClock.sessionObj.nextWindow = "index";
                CloudClock.flashConfirmation = true;
                console.log("Go to back to index, flash confirmation!");
            }
            return false;
        }
        CloudClock.sessionObj.saveTransaction();
        CloudClock.sessionObj.clearSession();
        CloudClock.clock.showEmployeeFlowDialog = false;
        CloudClock.sessionObj.nextWindow = "index";
        console.log("Go to back to index!");
        return true;
    },
    init: function() {
        employeeFlow.I_order = {
            0: employeeFlow.checkPhoto,
            1: employeeFlow.checkDepartments,
            2: employeeFlow.checkSoftScheduling,
            3: employeeFlow.checkShortLunch,
            4: employeeFlow.checkConfirmation
        };
        employeeFlow.O_order = {
            0: employeeFlow.checkPhoto,
            1: employeeFlow.checkSoftScheduling,
            2: employeeFlow.checkConfirmation
        };
    },
    action: function(e) {
        try {
            _.every(employeeFlow[e.direction + "_order"], function(doThis, i) {
                console.log(i);
                delete employeeFlow[e.direction + "_order"][i];
                return true === doThis(e.context);
            });
        } catch (error) {
            CloudClock.error(error);
        }
    }
};

exports.emplFlowInit = employeeFlow.init;

exports.stopFlow = false;

exports.nextWindow = function(_params) {
    try {
        var currentContext = {};
        (0 === CloudClock.sessionObj.nextWindow.length || _.isUndefined(CloudClock.sessionObj.nextWindow)) && employeeFlow.action({
            direction: CloudClock.sessionObj.currentPunch.transType,
            context: _params.context
        });
        console.log("Next Window: " + CloudClock.sessionObj.nextWindow);
        if (!CloudClock.dispatcher.stopFlow && 0 !== CloudClock.sessionObj.nextWindow.length) {
            CloudClock.log("Info", "Creating next window: " + CloudClock.sessionObj.nextWindow);
            currentContext = Alloy.createController(CloudClock.sessionObj.nextWindow);
            CloudClock.screenTimeout._context = currentContext;
            currentContext.getView().open();
            CloudClock.sessionObj.nextWindow = "";
            _params.context.getView().close();
            return false;
        }
    } catch (error) {
        CloudClock.error(error);
    }
};