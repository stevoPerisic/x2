function getProps() {
    shiftInWindow = parseInt(Ti.App.Properties.getString("SHIFTINWINDOW"), 10);
    shiftOutWindow = parseInt(Ti.App.Properties.getString("SHIFTOUTWINDOW"), 10);
    outsideGraceWindow = parseInt(Ti.App.Properties.getString("OUTSIDEGRACE"), 10);
}

function immediatePunchHandler(_params) {
    try {
        var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
        CloudClock.dispatcher.stopFlow = false;
        _params.context.activityIndicator.hide();
        if (_params.error) {
            CloudClock.flashConfirmation = "error";
            CloudClock.log("Error", "Error in missed break API call: " + JSON.stringify(_params.response));
            CloudClock.sessionObj.missedBreakData = false;
            CloudClock.sessionObj.nextWindow = "0" === CONFIRMATION ? "index" : "employeeFlow_hoursVerification";
        } else {
            CloudClock.flashConfirmation = true;
            CloudClock.sessionObj.missedBreakData = _.has(_params.response, "exceptionScreens") ? _params.response : false;
            CloudClock.sessionObj.nextWindow = _.has(_params.response, "exceptionScreens") ? "employeeFlow_missedBreak" : "0" === CONFIRMATION ? "index" : "employeeFlow_hoursVerification";
            var sentTransaction = Alloy.Collections.transactions.where({
                employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,
                transTime: CloudClock.sessionObj.currentPunch.transTime
            });
            sentTransaction && sentTransaction[0].save({
                sent: 1
            }, {
                success: function(model) {
                    CloudClock.log("Info", "Transaction saved as sent after immediate punch for " + model.get("name") + "\n" + JSON.stringify(_.omit(model.attributes, "photoData")));
                },
                error: function(model, response) {
                    CloudClock.log("Error", "Transaction Model: " + JSON.stringify(response));
                }
            });
        }
        CloudClock.dispatcher.nextWindow({
            context: _params.context
        });
    } catch (error) {
        CloudClock.error(error);
    }
}

var shiftInWindow = 0;

var shiftOutWindow = 0;

var outsideGraceWindow = 0;

exports.inPunch = function(_context) {
    function checkForExceptions(shift) {
        try {
            if (shiftInWindow >= shift.get("absDiff")) {
                if (0 > shift.get("actDiff")) {
                    console.log("Early In");
                    CloudClock.sessionObj.showActual = 1;
                    CloudClock.sessionObj.punchException = false;
                } else if (shift.get("actDiff") > 0) {
                    console.log("Late In");
                    CloudClock.sessionObj.showActual = false;
                    CloudClock.sessionObj.punchException = "1" === shift.get("lateIn") && shift.get("absDiff") >= shift.get("lateInMins") ? 14 : false;
                }
            } else if (shift.get("absDiff") > shiftInWindow && outsideGraceWindow >= shift.get("absDiff")) if (0 > shift.get("actDiff")) {
                console.log("Very Early In");
                CloudClock.sessionObj.showActual = false;
                if ("1" === shift.get("veryEarlyIn")) {
                    console.log("Show Very Early In exceptions");
                    CloudClock.sessionObj.punchException = 1;
                } else CloudClock.sessionObj.punchException = false;
            } else if (shift.get("actDiff") > 0) {
                console.log("Very Late In");
                CloudClock.sessionObj.showActual = false;
                CloudClock.sessionObj.punchException = false;
            }
            return true;
        } catch (error) {
            CloudClock.error(error);
            return false;
        }
    }
    var sessionObj = CloudClock.sessionObj;
    var shift = {};
    var ninetyMinuteRule = 54e5;
    getProps();
    if ("O" === sessionObj.latestTransaction.transType && ninetyMinuteRule > sessionObj.difference && sessionObj.latestTransaction.shiftID) {
        sessionObj.shift = Alloy.Collections.deptShifts.findByID(sessionObj.latestTransaction.shiftID);
        sessionObj.currentPunch.shiftID = sessionObj.shift[0].get("deptShiftID");
    } else sessionObj.shift = Alloy.Collections.deptShifts.findWithCurrentPunch();
    shift = sessionObj.shift[0];
    if (!checkForExceptions(shift)) {
        CloudClock.log("Error", "Soft scheduling inPunch flow error.");
        return false;
    }
    _context.activityIndicator.hide();
    _context.activityIndicator.applyProperties({
        top: "25%",
        left: "20%",
        height: "50%",
        width: "60%"
    });
    if (!sessionObj.showActual && !sessionObj.punchException && 1 === sessionObj.shift.length) {
        sessionObj.currentPunch.shiftID = sessionObj.shift[0].get("deptShiftID");
        return false;
    }
    if (sessionObj.showActual || sessionObj.shift.length > 1) {
        sessionObj.nextWindow = "employeeFlow_actualVsScheduled";
        return true;
    }
    if (sessionObj.punchException) {
        sessionObj.nextWindow = "employeeFlow_earlyOrLate";
        return true;
    }
};

exports.outPunch = function(_context) {
    function checkForExceptions(shift) {
        try {
            if (shiftOutWindow >= shift.get("absDiff")) {
                if (0 > shift.get("actDiff")) {
                    console.log("Early Out");
                    if ("1" === shift.get("earlyOut") && shift.get("absDiff") >= shift.get("earlyOutMins")) {
                        CloudClock.sessionObj.showActual = false;
                        CloudClock.sessionObj.punchException = 15;
                    } else {
                        CloudClock.sessionObj.showActual = false;
                        CloudClock.sessionObj.punchException = false;
                    }
                } else if (shift.get("actDiff") > 0) {
                    console.log("Late Out");
                    CloudClock.sessionObj.showActual = 1;
                    CloudClock.sessionObj.punchException = false;
                }
            } else if (shift.get("absDiff") > shiftOutWindow && outsideGraceWindow >= shift.get("absDiff")) if (0 > shift.get("actDiff")) {
                console.log("Very Early Out");
                if ("1" === shift.get("earlyOut")) {
                    CloudClock.sessionObj.showActual = false;
                    CloudClock.sessionObj.punchException = 15;
                } else {
                    CloudClock.sessionObj.showActual = false;
                    CloudClock.sessionObj.punchException = false;
                }
            } else if (shift.get("actDiff") > 0) {
                console.log("Very Late Out");
                if ("1" === shift.get("veryLateOut")) {
                    CloudClock.sessionObj.showActual = false;
                    CloudClock.sessionObj.punchException = 16;
                } else {
                    CloudClock.sessionObj.showActual = false;
                    CloudClock.sessionObj.punchException = false;
                }
            }
            return true;
        } catch (error) {
            CloudClock.error(error);
            return false;
        }
    }
    function lateOutEarlyOut() {
        if (sessionObj.showActual || sessionObj.shift.length > 1) {
            sessionObj.nextWindow = "employeeFlow_actualVsScheduled";
            return true;
        }
        if (sessionObj.punchException) {
            sessionObj.nextWindow = "employeeFlow_earlyOrLate";
            return true;
        }
    }
    var sessionObj = CloudClock.sessionObj;
    var shift = {};
    var clockWorkSpan = 36e5 * parseInt(Ti.App.Properties.getString("WORKSPAN"), 10);
    getProps();
    if ("I" === sessionObj.latestTransaction.transType && clockWorkSpan > sessionObj.difference && sessionObj.latestTransaction.shiftID) {
        sessionObj.shift = Alloy.Collections.deptShifts.findByID(sessionObj.latestTransaction.shiftID);
        sessionObj.currentPunch.shiftID = sessionObj.shift[0].get("deptShiftID");
    } else sessionObj.shift = Alloy.Collections.deptShifts.findWithCurrentPunch();
    shift = sessionObj.shift[0];
    if (checkForExceptions(shift)) {
        var workSpan1 = parseInt(sessionObj.shift[0].get("workSpan1"), 10);
        var workSpan2 = parseInt(sessionObj.shift[0].get("workSpan2"), 10);
        if ("I" === sessionObj.latestTransaction.transType && 1 === sessionObj.shift.length && workSpan1 >= sessionObj.shift[0].attributes.absDiff || workSpan2 >= sessionObj.shift[0].attributes.absDiff) {
            _context.activityIndicator.hide();
            _context.activityIndicator.applyProperties({
                top: "25%",
                left: "25%",
                height: "50%",
                width: "50%"
            });
            _context.areYouLeavingForDay = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("no"), CloudClock.customL.strings("yes") ],
                title: CloudClock.customL.strings("alert"),
                message: CloudClock.customL.strings("leavingForDay"),
                callback: {
                    eType: "click",
                    action: function(_e) {
                        if (_e.source.id === this.cancel) {
                            sessionObj.currentPunch.shiftID = shift.get("deptShiftID");
                            sessionObj.nextWindow = "";
                        } else lateOutEarlyOut();
                        _context.areYouLeavingForDay.hide.apply(_context);
                        CloudClock.dispatcher.stopFlow = false;
                        CloudClock.dispatcher.nextWindow({
                            context: _context
                        });
                    }
                },
                stayOpen: true
            });
            _context.areYouLeavingForDay.show.apply(_context);
            CloudClock.dispatcher.stopFlow = true;
            return true;
        }
        return lateOutEarlyOut() ? true : false;
    }
    CloudClock.log("Error", "Soft scheduling outPunch flow error.");
    return false;
};

exports.shortLunch = function(_context) {
    var sessionObj = CloudClock.sessionObj;
    var restrictionINOUT = 6e4 * parseInt(Ti.App.Properties.getString("OUTINPUNCHRESTRICT"), 10);
    var shortLunch = Ti.App.Properties.getString("SHORTLUNCH");
    var ninetyMinuteRule = 54e5;
    getProps();
    _context.clokingInEarlyFromBreak = CloudClock.customAlert.create({
        type: "alert",
        cancel: 0,
        buttonNames: [ CloudClock.customL.strings("no"), CloudClock.customL.strings("yes") ],
        title: CloudClock.customL.strings("alert"),
        message: CloudClock.customL.strings("earlyFromBreak"),
        callback: {
            eType: "click",
            action: function(_e) {
                if (_e.source.id === this.cancel) {
                    sessionObj.nextWindow = "index";
                    CloudClock.clock.showEmployeeFlowDialog = false;
                    return false;
                }
                CloudClock.sessionObj.currentPunch.shiftID = CloudClock.sessionObj.shift[0].get("deptShiftID");
                return true;
            }
        }
    });
    if (0 === sessionObj.latestTransaction.transType || "I" === sessionObj.latestTransaction.transType) return false;
    if (restrictionINOUT > sessionObj.difference && "1" === shortLunch) {
        sessionObj.nextWindow = "";
        sessionObj.punchException = 0;
        _context.clokingInEarlyFromBreak.show.apply(_context);
        CloudClock.dispatcher.stopFlow = true;
        return true;
    }
    if (restrictionINOUT > sessionObj.difference && "2" === shortLunch) {
        sessionObj.nextWindow = "employeeFlow_earlyOrLate";
        sessionObj.punchException = 12;
        _context.clokingInEarlyFromBreak.show.apply(_context);
        CloudClock.dispatcher.stopFlow = true;
        return true;
    }
    return ninetyMinuteRule > sessionObj.difference ? false : false;
};

exports.immediatePunch = function(_context) {
    var immediatePunch_cfg = {
        endpoint: "missedBreak",
        params: {
            termID: Ti.App.Properties.getString("TERMID"),
            badge: CloudClock.sessionObj.employee.get("badge"),
            weekId: 0,
            screenId: 0
        },
        payload: {
            punch: {
                idType: CloudClock.sessionObj.currentPunch.idType,
                employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,
                transType: CloudClock.sessionObj.currentPunch.transType,
                departmentNum: CloudClock.sessionObj.currentPunch.departmentNum,
                transTime: CloudClock.sessionObj.currentPunch.transTime,
                transSrc: 0,
                verified: 0,
                transDateTime: CloudClock.sessionObj.currentPunch.transDateTime,
                shiftID: CloudClock.sessionObj.currentPunch.shiftID,
                overrideFlag: CloudClock.sessionObj.currentPunch.overrideFlag,
                exceptions: [ {
                    reasonCodeID: CloudClock.sessionObj.currentPunch.reasonCodeID,
                    reasonCodeType: CloudClock.sessionObj.currentPunch.reasonCodeType
                } ],
                initials: CloudClock.sessionObj.currentPunch.initials
            }
        },
        onSuccess: function(response) {
            console.log("recieved success response from immediate punch: " + JSON.stringify(response));
            _.has(response, "status") ? 0 !== response.status ? immediatePunchHandler({
                error: true,
                response: response,
                context: _context
            }) : immediatePunchHandler({
                error: false,
                response: response,
                context: _context
            }) : _.isEmpty(response.exceptionScreens) ? immediatePunchHandler({
                error: true,
                response: response,
                context: _context
            }) : immediatePunchHandler({
                error: false,
                response: response,
                context: _context
            });
        },
        onError: function(response) {
            console.log("recieved error response from immediate punch: " + JSON.stringify(response));
            immediatePunchHandler({
                error: true,
                response: response,
                context: _context
            });
        }
    };
    _context.activityIndicator.setMessage(CloudClock.customL.strings("savingPunch"));
    _context.activityIndicator.show();
    var CAPTUREPHOTO = Ti.App.Properties.getString("CAPTUREPHOTO");
    if ("1" === CAPTUREPHOTO && CloudClock.sessionObj.currentPunch.photoData) {
        var batchModePhotosDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "BatchModePhotos");
        batchModePhotosDir.exists() || batchModePhotosDir.createDirectory();
        var immediatePunchPic_path = CloudClock.sessionObj.currentPunch.employeeBadge + "_" + CloudClock.sessionObj.currentPunch.photoTime + ".jpg";
        var immediatePunchPic_data = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, immediatePunchPic_path);
        immediatePunchPic_data.write(CloudClock.sessionObj.currentPunch.photoData);
        immediatePunchPic_data.move("BatchModePhotos/" + immediatePunchPic_path);
        immediatePunchPic_data.deleteFile();
    }
    CloudClock.sessionObj.saveTransaction();
    if (true === Ti.Network.online) {
        CloudClock.dispatcher.stopFlow = true;
        console.log("\n\nFlow stopped waiting for immediate punch response...");
        CloudClock.api.request(immediatePunch_cfg);
    } else {
        _context.activityIndicator.hide();
        var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
        CloudClock.flashConfirmation = "error";
        CloudClock.sessionObj.missedBreakData = false;
        CloudClock.sessionObj.nextWindow = "0" === CONFIRMATION ? "index" : "employeeFlow_hoursVerification";
    }
};