function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "employeeFlow_clockInOut";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.clockInOut = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "clockInOut"
    });
    $.__views.clockInOut && $.addTopLevelView($.__views.clockInOut);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        top: "25%",
        left: "20%",
        height: "50%",
        width: "60%",
        zIndex: 1,
        backgroundColor: "#000",
        color: "#fff",
        opacity: "0.7",
        borderRadius: 20,
        font: {
            fontSize: "28dp"
        },
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
        id: "activityIndicator",
        message: "Loading..."
    });
    $.__views.clockInOut.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.clockInOut
    });
    $.__views.header.setParent($.__views.clockInOut);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        layout: "horizontal",
        horizontalWrap: false,
        id: "content"
    });
    $.__views.clockInOut.add($.__views.content);
    $.__views.employeePicBackground = Ti.UI.createView({
        height: Ti.UI.Fill,
        width: "35%",
        backgroundColor: "#e4e4e4",
        layout: "vertical",
        id: "employeePicBackground"
    });
    $.__views.content.add($.__views.employeePicBackground);
    $.__views.employeePicWrap = Ti.UI.createView({
        top: "40dp",
        width: "80%",
        height: "40%",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#dadada",
        layout: "vertical",
        id: "employeePicWrap"
    });
    $.__views.employeePicBackground.add($.__views.employeePicWrap);
    $.__views.employeePic = Ti.UI.createImageView({
        top: "7%",
        width: "84%",
        height: "65%",
        id: "employeePic"
    });
    $.__views.employeePicWrap.add($.__views.employeePic);
    $.__views.name = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: "16dp",
        height: "20dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "name"
    });
    $.__views.employeePicWrap.add($.__views.name);
    $.__views.pinNo = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "5dp",
        height: "25dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "pinNo"
    });
    $.__views.employeePicWrap.add($.__views.pinNo);
    $.__views.notMe = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#fff",
        borderColor: "#ccc",
        backgroundImage: "none",
        top: "40dp",
        width: "80%",
        borderRadius: 10,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0",
                y: "0"
            },
            endPoint: {
                x: "0",
                y: "100"
            },
            colors: [ "#fff", "#e4e4e4" ],
            backFillStart: false
        },
        title: "",
        id: "notMe"
    });
    $.__views.employeePicBackground.add($.__views.notMe);
    $.__views.notMeLabel = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "notMeLabel"
    });
    $.__views.notMe.add($.__views.notMeLabel);
    $.__views.clockAndButtons = Ti.UI.createView({
        top: "20dp",
        left: "2%",
        width: "63%",
        id: "clockAndButtons"
    });
    $.__views.content.add($.__views.clockAndButtons);
    $.__views.clock = Ti.UI.createView({
        top: "70dp",
        height: "140dp",
        backgroundColor: "#fcfcfc",
        id: "clock"
    });
    $.__views.clockAndButtons.add($.__views.clock);
    $.__views.time = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "60dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#000",
        top: "35dp",
        id: "time"
    });
    $.__views.clock.add($.__views.time);
    $.__views.date = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "25dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#000",
        top: "110dp",
        id: "date"
    });
    $.__views.clock.add($.__views.date);
    $.__views.clockIn = Ti.UI.createView({
        width: "260dp",
        height: "140dp",
        left: "4%",
        backgroundColor: "#62bb47",
        color: "#fff",
        borderRadius: 10,
        borderColor: "#62bb47",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "clockIn",
        customAttr: "clockIn"
    });
    $.__views.clockAndButtons.add($.__views.clockIn);
    $.__views.clockInLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "34dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        left: 0,
        backgroundColor: "transparent",
        width: "260dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "clockInLbl",
        customAttr: "clockIn"
    });
    $.__views.clockIn.add($.__views.clockInLbl);
    $.__views.lastTimeInLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#fff",
        bottom: "10dp",
        id: "lastTimeInLbl",
        customAttr: "clockIn"
    });
    $.__views.clockIn.add($.__views.lastTimeInLbl);
    $.__views.clockOut = Ti.UI.createView({
        width: "260dp",
        height: "140dp",
        right: "4%",
        backgroundColor: "#ff2d55",
        color: "#fff",
        borderRadius: 10,
        borderColor: "#ff2d55",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "clockOut",
        customAttr: "clockOut"
    });
    $.__views.clockAndButtons.add($.__views.clockOut);
    $.__views.clockOutLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "34dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        left: 0,
        backgroundColor: "transparent",
        width: "260dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "clockOutLbl",
        customAttr: "clockOut"
    });
    $.__views.clockOut.add($.__views.clockOutLbl);
    $.__views.lastTimeOutLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#fff",
        bottom: "10dp",
        id: "lastTimeOutLbl",
        customAttr: "clockOut"
    });
    $.__views.clockOut.add($.__views.lastTimeOutLbl);
    $.__views.footer = Alloy.createController("footer", {
        id: "footer",
        __parentSymbol: $.__views.clockInOut
    });
    $.__views.footer.setParent($.__views.clockInOut);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    (function() {
        function emptyFn(e) {
            $[e.source.id].removeEventListener("doubletap", emptyFn);
            return false;
        }
        function notMeClick() {
            $.notMe.removeEventListener("click", notMeClick);
            if ("0" === Ti.App.Properties.getString("ALLOWCROSSPUNCH")) {
                $.contactManagerDialog = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("contact_manager"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.header.exit.fireEvent("click");
                                $.contactManagerDialog.hide.apply($);
                            }
                        }
                    }
                });
                $.contactManagerDialog.show.apply($);
            } else {
                Alloy.createController("employeeFlow_newEmployee", {
                    newEmployeePin: sessionObj.employee.get("pin")
                });
                $.clockInOut.close();
            }
        }
        function changeColor(e) {
            $[e.source.id].removeEventListener(e.type, changeColor);
            e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#000";
        }
        function changeColorIN(e) {
            $.clockIn.removeEventListener(e.type, changeColorIN);
            $.clockIn.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#62bb47";
        }
        function changeColorOUT(e) {
            $.clockOut.removeEventListener(e.type, changeColorOUT);
            $.clockOut.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#ff2d55";
        }
        function populateSession() {
            try {
                sessionObj.employee = args.employees[0];
                sessionObj.last_inPunch = Alloy.Collections.clockHistory.getLatestClockIn(sessionObj.employee.get("alloy_id"));
                sessionObj.last_outPunch = Alloy.Collections.clockHistory.getLatestClockOut(sessionObj.employee.get("alloy_id"));
                sessionObj.latestTransaction = Alloy.Collections.clockHistory.getLatest(sessionObj.employee.get("alloy_id"));
                sessionObj.employeeDepartments = Alloy.Collections.employeeDepartments.getByEmployeeBadge(sessionObj.employee.get("badge"));
                sessionObj.previousClockIns = Alloy.Collections.clockHistory.getPreviousClockIns(sessionObj.employee.get("alloy_id"));
                sessionObj.previousClockOuts = Alloy.Collections.clockHistory.getPreviousClockOuts(sessionObj.employee.get("alloy_id"));
                CloudClock.log("Info", "Session started for: " + JSON.stringify(sessionObj.employee));
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function updateUIclock() {
            CloudClock.UIClock = $.time;
            $.time.setText(CloudClock.moment().format("h:mm a"));
            $.date.setText(CloudClock.moment().format("dddd[, ] MMMM D[,] YYYY"));
        }
        function updateUI() {
            function buttonLabelTime(t) {
                var time = t;
                var n = time.lastIndexOf("-");
                var l = time.length;
                var timeZone = time.substr(n, l);
                time = time.replace(timeZone, "");
                var formattedTime = CloudClock.moment(time).zone(timeZone);
                return formattedTime;
            }
            CloudClock.buttonLabelTime = buttonLabelTime;
            0 === sessionObj.employee.get("badge") && ($.footer.employeeOptions.visible = false);
            $.clockInLbl.setText(CloudClock.customL.strings("clock_in"));
            $.clockOutLbl.setText(CloudClock.customL.strings("clock_out"));
            $.notMeLabel.setText(CloudClock.customL.strings("not_me"));
            $.name.setText(sessionObj.employee.get("name").replace(/\s*$/, ""));
            $.pinNo.setText(CloudClock.customL.strings("pin") + Ti.App.Properties.getString("PINFORSHOW"));
            $.clockIn.badgeNo = sessionObj.employee.get("badge");
            "1" === Ti.App.Properties.getString("CAPTUREPHOTO") ? 0 === sessionObj.employee.get("photoFileName").indexOf("/images/icons/") ? $.employeePic.setImage(sessionObj.employee.get("photoFileName")) : CloudClock.getLocalPhoto($.employeePic, sessionObj.employee.get("photoFileName")) : $.employeePic.setImage("/images/icons/no-photo-256-gray.png");
            var lastShiftUsed = sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime ? Alloy.Collections.deptShifts.where({
                deptShiftID: sessionObj.last_inPunch.shiftID
            }) : Alloy.Collections.deptShifts.where({
                deptShiftID: sessionObj.last_outPunch.shiftID
            });
            if ("0" === Ti.App.Properties.getString("SOFTSCHEDULING") || _.isEmpty(lastShiftUsed)) {
                console.log("\n\nEither no last shift used or no softscheduling :)");
                sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime ? $.lastTimeInLbl.setText(buttonLabelTime(sessionObj.last_inPunch.transDateTime).format("ddd MMM D[ @ ]h:mm a")) : sessionObj.last_inPunch.transTime < sessionObj.last_outPunch.transTime && $.lastTimeOutLbl.setText(buttonLabelTime(sessionObj.last_outPunch.transDateTime).format("ddd MMM D[ @ ]h:mm a"));
            } else {
                var minutes = 0;
                var lastPunchTime = "";
                var timeString = function(minutes) {
                    var punchTime = moment(lastPunchTime);
                    var timeString = moment(lastPunchTime);
                    var hour = (minutes - minutes % 60) / 60;
                    var minute = minutes % 60;
                    timeString = timeString.hour(hour);
                    timeString = timeString.minute(minute);
                    var displayTime = sessionObj.latestTransaction.overrideFlag ? punchTime.format("ddd MMM D[ @ ]h:mm a") : timeString.format("ddd MMM D[ @ ]h:mm a");
                    return displayTime;
                };
                try {
                    if (sessionObj.last_inPunch.transTime > sessionObj.last_outPunch.transTime) {
                        lastPunchTime = sessionObj.last_inPunch.transDateTime;
                        minutes = lastShiftUsed[0].get("shiftStart");
                        $.lastTimeInLbl.setText(timeString(minutes));
                    } else if (sessionObj.last_inPunch.transTime < sessionObj.last_outPunch.transTime) {
                        lastPunchTime = sessionObj.last_outPunch.transDateTime;
                        minutes = lastShiftUsed[0].get("shiftEnd");
                        $.lastTimeOutLbl.setText(timeString(minutes));
                    }
                } catch (error) {
                    console.log("\n\nError found, no lastShiftUsed, line 373 and 379");
                    CloudClock.error(error);
                }
            }
        }
        function startPunch(e) {
            if (sessionObj.punchStarted) {
                console.log("Punch already started, get out!");
                return false;
            }
            sessionObj.punchStarted = 1;
            "1" === Ti.App.Properties.getString("QAFLAG") ? alterCurrentTime(e) : clockInOut.action(e);
        }
        function employeeOptions_click() {
            if (false !== Ti.Network.online) {
                CloudClock.sound && CloudClock.sound.stop();
                $.footer.employeeOptions.removeEventListener("click", employeeOptions_click);
                $.footer.employeeOptions.enabled = false;
                $.footer.employeeOptions.hide();
                CloudClock.clock.showEmployeeFlowDialog = false;
                Alloy.createController("employeeOptions");
                $.clockInOut.close();
            } else {
                CloudClock.noNetwork = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("noNetworkEmplOpts"),
                    callback: {
                        eType: "click",
                        action: function() {
                            CloudClock.noNetwork.hide.apply($);
                        }
                    }
                });
                CloudClock.noNetwork.show.apply($);
            }
        }
        function addListeners() {
            $.clockInOut.addEventListener("open", Alloy.Collections.deviceHelp.audioPlayer.play);
            $.clockInOut.addEventListener("close", destroy);
            $.clockInOut.addEventListener("touchstart", restartTimeout);
            $.notMe.addEventListener("click", notMeClick);
            $.notMe.addEventListener("touchstart", changeColor);
            $.notMe.addEventListener("touchend", changeColor);
            $.clockIn.addEventListener("doubletap", emptyFn);
            $.clockIn.addEventListener("click", startPunch);
            $.clockIn.addEventListener("touchstart", changeColorIN);
            $.clockIn.addEventListener("touchend", changeColorIN);
            $.clockOut.addEventListener("doubletap", emptyFn);
            $.clockOut.addEventListener("click", startPunch);
            $.clockOut.addEventListener("touchstart", changeColorOUT);
            $.clockOut.addEventListener("touchend", changeColorOUT);
            $.footer.employeeOptions.addEventListener("click", employeeOptions_click);
        }
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeFlow", "clockInOut", $.header.exit);
            CloudClock.clock.showEmployeeFlowDialog = true;
        }
        function destroy() {
            $.clockInOut.removeEventListener("open", Alloy.Collections.deviceHelp.audioPlayer.play);
            $.clockInOut.removeEventListener("close", destroy);
            $.clockInOut.removeEventListener("touchstart", restartTimeout);
            $.notMe.removeEventListener("click", notMeClick);
            $.notMe.removeEventListener("touchstart", changeColor);
            $.notMe.removeEventListener("touchend", changeColor);
            $.clockIn.removeEventListener("doubletap", emptyFn);
            $.clockIn.removeEventListener("click", "1" === Ti.App.Properties.getString("QAFLAG") ? alterCurrentTime : clockInOut.action);
            $.clockIn.removeEventListener("touchstart", changeColorIN);
            $.clockIn.removeEventListener("touchend", changeColorIN);
            $.clockOut.removeEventListener("doubletap", emptyFn);
            $.clockOut.removeEventListener("click", "1" === Ti.App.Properties.getString("QAFLAG") ? alterCurrentTime : clockInOut.action);
            $.clockOut.removeEventListener("touchstart", changeColorOUT);
            $.clockOut.removeEventListener("touchend", changeColorOUT);
            $.destroy();
            $.clockInOut.removeAllChildren();
            leavingFortheDayDialog = null;
            softScheduling = null;
            $.sessionObj = null;
            $ = null;
        }
        function alterCurrentTime(_e) {
            $.alteredTime = {
                secondsSince111970: 0,
                convertedUnix: ""
            };
            var changeActualTimeDialog = {};
            changeActualTimeDialog = Ti.UI.createAlertDialog({
                title: "ENTER THE ACTUAL TIME, FORMAT: YYYY-MM-DD HH:MM:SS",
                style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
                buttonNames: [ "OK" ]
            });
            changeActualTimeDialog.addEventListener("click", function(e) {
                var date = "";
                var time = "";
                var match;
                match = e.text.match(/\d+[\-:]*/g);
                if (!match || 6 !== match.length) {
                    alert("Please enter a valid value in the textbox.");
                    return false;
                }
                date = e.text.slice(0, 10);
                time = e.text.slice(11, 19);
                CloudClock.clock.showEmployeeFlowDialog = false;
                var now = CloudClock.clock.getCurrentTime();
                console.log(now);
                var timeZone = now.convertedUnix.slice(19, 25);
                $.alteredTime.convertedUnix = date + "T" + time + timeZone;
                $.alteredTime.secondsSince111970 = Math.round(new Date($.alteredTime.convertedUnix).getTime() / 1e3);
                clockInOut.action(_e);
            });
            changeActualTimeDialog.show();
            restartTimeout();
            CloudClock.clock.showEmployeeFlowDialog = false;
        }
        try {
            var clockInOut = {
                clockWorkSpan: 36e5 * parseInt(Ti.App.Properties.getString("WORKSPAN"), 10),
                restrictionIN: 6e4 * parseInt(Ti.App.Properties.getString("INPUNCHRESTRICT"), 10),
                restrictionINOUT: 6e4 * parseInt(Ti.App.Properties.getString("OUTINPUNCHRESTRICT"), 10),
                restrictionOUT: 6e4 * parseInt(Ti.App.Properties.getString("OUTPUNCHRESTRICT"), 10),
                softScheduling_param: Ti.App.Properties.getString("SOFTSCHEDULING"),
                shortLunch: Ti.App.Properties.getString("SHORTLUNCH"),
                ninetyMinuteRule: 54e5,
                timeOfAction: {},
                direction: "",
                recordTransaction: function(_direction, _moment) {
                    try {
                        sessionObj.currentPunch = {
                            idType: sessionObj.employee.get("badge") ? "U" : "P",
                            employeeBadge: 0 !== sessionObj.employee.get("badge") ? sessionObj.employee.get("badge") : sessionObj.employee.get("pin"),
                            transType: "clockIn" === _direction ? "I" : "O",
                            departmentNum: 0 !== sessionObj.last_inPunch.departmentNum ? sessionObj.last_inPunch.departmentNum : sessionObj.employee.get("primaryDeptNum"),
                            transTime: _moment.secondsSince111970,
                            transDateTime: _moment.convertedUnix,
                            initials: 0 !== sessionObj.employee.get("badge") ? false : sessionObj.employee.get("name"),
                            shiftID: 0,
                            overrideFlag: 1,
                            sent: 0,
                            reasonCodeID: 0,
                            reasonCodeType: 0,
                            amount: 0
                        };
                    } catch (error) {
                        CloudClock.error(error);
                    }
                },
                checkRestrictions: function() {
                    if ("clockIn" === clockInOut.direction) {
                        if (CloudClock.punchRestrictions.inPunch()) {
                            console.log("No restrictions!");
                            return true;
                        }
                        console.log("Yes restrictions!");
                        if (3 === sessionObj.restrictionDialog) {
                            var untilCanGoBackIn = clockInOut.restrictionINOUT - sessionObj.difference;
                            $.restrictionINOUT_dialog = CloudClock.customAlert.create({
                                type: "alert",
                                cancel: 0,
                                buttonNames: [ CloudClock.customL.strings("ok") ],
                                title: CloudClock.customL.strings("alert"),
                                message: CloudClock.customL.strings("cantGoBackIn") + moment(untilCanGoBackIn).format("mm [minutes.]"),
                                callback: {
                                    eType: "click",
                                    action: function(_e) {
                                        if (_e.source.id === this.cancel) {
                                            $.restrictionINOUT_dialog.hide.apply($);
                                            CloudClock.sessionObj.clearSession();
                                            CloudClock.clock.showEmployeeFlowDialog = false;
                                            Alloy.createController("index", {
                                                doNotSetParams: true
                                            });
                                            $.clockInOut.close();
                                        }
                                    }
                                }
                            });
                            $.restrictionINOUT_dialog.show.apply($);
                        } else {
                            $.restrictionIN_dialog = CloudClock.customAlert.create({
                                type: "alert",
                                cancel: 0,
                                buttonNames: [ CloudClock.customL.strings("ok") ],
                                title: CloudClock.customL.strings("alert"),
                                message: CloudClock.customL.strings("alreadyClockedIn") + CloudClock.buttonLabelTime(sessionObj.last_inPunch.transDateTime).format("h:mm a"),
                                callback: {
                                    eType: "click",
                                    action: function(_e) {
                                        if (_e.source.id === this.cancel) {
                                            $.restrictionIN_dialog.hide.apply($);
                                            CloudClock.sessionObj.clearSession();
                                            CloudClock.clock.showEmployeeFlowDialog = false;
                                            Alloy.createController("index", {
                                                doNotSetParams: true
                                            });
                                            $.clockInOut.close();
                                        }
                                    }
                                }
                            });
                            $.restrictionIN_dialog.show.apply($);
                        }
                        return false;
                    }
                    if (CloudClock.punchRestrictions.outPunch()) {
                        console.log("No restrictions!");
                        return true;
                    }
                    console.log("Yes restrictions!");
                    $.restrictionOUT_dialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("alreadyClockedOut") + CloudClock.buttonLabelTime(sessionObj.last_outPunch.transDateTime).format("h:mm a"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.restrictionOUT_dialog.hide.apply($);
                                    CloudClock.clock.showEmployeeFlowDialog = false;
                                    Alloy.createController("index", {
                                        doNotSetParams: true
                                    });
                                    $.clockInOut.close();
                                }
                            }
                        }
                    });
                    $.restrictionOUT_dialog.show.apply($);
                    return false;
                },
                nextWindow: function() {
                    CloudClock.dispatcher.nextWindow({
                        context: $
                    });
                },
                action: function(e) {
                    try {
                        clockInOut.direction = e.source.customAttr;
                        clockInOut.timeOfAction = CloudClock.clock.getCurrentTime();
                        if ("1" === Ti.App.Properties.getString("QAFLAG")) {
                            clockInOut.recordTransaction(clockInOut.direction, $.alteredTime);
                            sessionObj.difference = 1e3 * ($.alteredTime.secondsSince111970 - sessionObj.latestTransaction.transTime);
                        } else {
                            clockInOut.recordTransaction(clockInOut.direction, clockInOut.timeOfAction);
                            sessionObj.difference = 1e3 * (clockInOut.timeOfAction.secondsSince111970 - sessionObj.latestTransaction.transTime);
                        }
                        _.every(clockInOut[clockInOut.direction + "_order"], function(doThis) {
                            return true === doThis();
                        });
                    } catch (error) {
                        CloudClock.error(error);
                    }
                },
                init: function() {
                    this.clockIn_order = {
                        0: this.checkRestrictions,
                        1: this.nextWindow
                    };
                    this.clockOut_order = {
                        0: this.checkRestrictions,
                        1: this.nextWindow
                    };
                }
            };
            CloudClock.punchRestrictions = require("punchRestrictions");
            var softScheduling = require("softScheduling");
            var sessionObj = CloudClock.sessionObj;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1200";
            populateSession();
            CloudClock.dispatcher.emplFlowInit();
            updateUIclock();
            updateUI();
            addListeners();
            clockInOut.init();
            CloudClock.screenTimeout._context = $;
            $.clockInOut.open();
            restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;