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
    this.__controllerPath = "employeeFlow_missedBreak";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.missedBreak = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "missedBreak"
    });
    $.__views.missedBreak && $.addTopLevelView($.__views.missedBreak);
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
    $.__views.missedBreak.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.missedBreak
    });
    $.__views.header.setParent($.__views.missedBreak);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.missedBreak.add($.__views.content);
    $.__views.contentHeader = Ti.UI.createView({
        top: 0,
        height: "60dp",
        width: "100%",
        backgroundColor: "transparent",
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
            colors: [ "#fff", "#f0f0f0" ],
            backFillStart: false
        },
        borderWidth: 1,
        borderColor: "#e4e4e4",
        id: "contentHeader"
    });
    $.__views.content.add($.__views.contentHeader);
    $.__views.missedBreakTitle = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "missedBreakTitle"
    });
    $.__views.contentHeader.add($.__views.missedBreakTitle);
    $.__views.missedBreakLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "80dp",
        id: "missedBreakLbl"
    });
    $.__views.content.add($.__views.missedBreakLbl);
    $.__views.missedBreakReasons = Ti.UI.createView({
        top: "140dp",
        width: "100%",
        height: "600dp",
        left: 0,
        layout: "vertical",
        id: "missedBreakReasons"
    });
    $.__views.content.add($.__views.missedBreakReasons);
    $.__views.buttonsWrap = Ti.UI.createView({
        width: "50%",
        layout: "vertical",
        id: "buttonsWrap"
    });
    $.__views.missedBreakReasons.add($.__views.buttonsWrap);
    $.__views.pinPadWrap = Ti.UI.createView({
        width: "50%",
        height: "100%",
        id: "pinPadWrap"
    });
    $.__views.missedBreakReasons.add($.__views.pinPadWrap);
    $.__views.pinPad = Alloy.createWidget("pinPad", "widget", {
        id: "pinPad",
        __parentSymbol: $.__views.pinPadWrap
    });
    $.__views.pinPad.setParent($.__views.pinPadWrap);
    $.__views.submitBreakHours = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#fff",
        borderColor: "#62bb47",
        backgroundImage: "none",
        top: "80%",
        width: "60%",
        backgroundColor: "#62bb47",
        borderRadius: 10,
        title: "",
        id: "submitBreakHours"
    });
    $.__views.pinPadWrap.add($.__views.submitBreakHours);
    $.__views.submitBreakHoursTxt = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        width: Ti.UI.SIZE,
        id: "submitBreakHoursTxt"
    });
    $.__views.submitBreakHours.add($.__views.submitBreakHoursTxt);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    try {
        (function() {
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "missedBreak", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function captureTextFieldVal() {
                var value = $.pinPad.pinPadTxtField.value;
                var n = value.match("^[0-9]+$");
                if (n) {
                    $.missedBreakReasons.removeAllChildren();
                    sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemType = $.pinPad.pinPadTxtField.itemType;
                    sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemId = $.pinPad.pinPadTxtField.itemID;
                    sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemValue = value;
                    postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemType = $.pinPad.pinPadTxtField.itemType;
                    postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemId = $.pinPad.pinPadTxtField.itemID;
                    postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemValue = value;
                    console.log(sessionObj.currentPunch);
                    $.missedBreak.screenNum = $.missedBreak.screenNum + 1;
                    console.log($.missedBreak.screenNum);
                    console.log(_.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]));
                    if (true === _.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum])) updateUI(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]); else {
                        postExceptions_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                        $.activityIndicator.show();
                        CloudClock.api.request(postExceptions_cfg);
                    }
                } else {
                    alert("invalid input");
                    $.pinPad.pinPadTxtField.value = 0;
                }
            }
            function reasonSelected(e) {
                $.missedBreakReasons.removeAllChildren();
                sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemType = e.source.itemType;
                sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemId = e.source.itemID;
                sessionObj.currentPunch.exceptions[$.missedBreak.screenNum].itemValue = e.source.itemValue;
                postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemType = e.source.itemType;
                postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemId = e.source.itemID;
                postExceptions_cfg.payload.processExceptions[$.missedBreak.screenNum].itemValue = e.source.itemValue;
                if ("M" === e.source.itemValue) {
                    $.missedBreakLbl.text = sessionObj.missedBreakData.exceptionScreens[0].screenInputs[0].itemText;
                    $.missedBreakReasons.layout = "vertical";
                    _.each(sessionObj.missedBreakData.exceptionScreens[0].screenInputs, function(input) {
                        var textField = Ti.UI.createTextField({
                            top: 10,
                            height: "100dp",
                            width: "550dp",
                            borderWidth: 1,
                            borderColor: "#e4e4e4",
                            borderRadius: 10,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                            font: {
                                fontSize: "40dp"
                            },
                            color: "#333",
                            keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
                            itemID: input.itemID,
                            itemOrder: input.itemOrder,
                            itemType: input.itemType,
                            recordID: input.recordID
                        });
                        textField.addEventListener("change", function() {
                            restartTimeout();
                        });
                        textField.addEventListener("return", captureTextFieldVal);
                        $.missedBreakReasons.add(textField);
                        textField = null;
                    });
                    var handle = $.missedBreakReasons.getChildren();
                    handle[0].focus();
                } else {
                    $.missedBreak.screenNum = $.missedBreak.screenNum + 1;
                    if (true === _.isObject(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum])) updateUI(sessionObj.missedBreakData.exceptionScreens[$.missedBreak.screenNum]); else {
                        postExceptions_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                        $.activityIndicator.show();
                        CloudClock.api.request(postExceptions_cfg);
                    }
                }
            }
            function changeLabelColor(e) {
                e.source.removeEventListener(e.type, changeLabelColor);
                e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
                e.source.color = "touchstart" === e.type ? "#fff" : "#333";
            }
            function updateUI(_exceptionScreen) {
                var numOfButtons = _exceptionScreen.screenButtons.length;
                if (_.isEmpty(_exceptionScreen.screenInputs)) {
                    Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1503";
                    $.missedBreakReasons.remove($.pinPadWrap);
                    $.buttonsWrap.width = "100%";
                    $.buttonsWrap.layout = "horizontal";
                } else {
                    Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1505";
                    $.submitBreakHoursTxt.setText("Submit");
                    $.pinPad.changeMode({
                        mode: "enterBreakAmount",
                        hintText: _exceptionScreen.screenInputs[0].itemText,
                        itemID: _exceptionScreen.screenInputs[0].itemID,
                        itemType: _exceptionScreen.screenInputs[0].itemType
                    });
                    $.pinPad.pinPad.top = "10dp";
                    $.pinPad.pinPadTxtField.font = {
                        fontSize: "30dp"
                    };
                }
                $.missedBreakTitle.text = _exceptionScreen.screenTitle;
                $.missedBreakLbl.text = _exceptionScreen.screenTitle2;
                numOfButtons > 2 && ($.missedBreakReasons.layout = "horizontal");
                _.each(_exceptionScreen.screenButtons, function(button) {
                    var label = Ti.UI.createLabel({
                        top: 10,
                        left: "5%",
                        rigth: "5%",
                        height: "100dp",
                        width: _.isEmpty(_exceptionScreen.screenInputs) ? "40%" : "90%",
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#e4e4e4",
                        borderRadius: 5,
                        font: {
                            fontSize: "22dp",
                            fontWeight: "bold"
                        },
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        color: "#333",
                        itemID: button.itemID,
                        itemOrder: button.itemOrder,
                        text: button.itemText,
                        itemType: button.itemType,
                        itemValue: button.itemValue,
                        recordID: button.recordID
                    });
                    label.addEventListener("click", reasonSelected);
                    label.addEventListener("touchstart", changeLabelColor);
                    label.addEventListener("touchend", changeLabelColor);
                    $.buttonsWrap.add(label);
                    label = null;
                });
            }
            function destroy() {
                $.missedBreak.addEventListener("touchstart", restartTimeout);
                $.missedBreak.removeEventListener("close", destroy);
                $.destroy();
                if ($.missedBreak.screenTimedOut) {
                    postExceptions_cfg.onSuccess = function(response) {
                        console.log("Screen timed out, exceptions sent, error? : " + response.isError);
                    };
                    postExceptions_cfg.onError = function(response) {
                        console.log("Screen timed out, tried sending exceptions, error? : " + response.isError);
                    };
                    postExceptions_cfg.payload.processExceptions.flowTimedOut = true;
                    postExceptions_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    CloudClock.api.request(postExceptions_cfg);
                }
            }
            function changeColor(e) {
                e.source.setBackgroundColor("#34aadc");
                e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#62bb47";
            }
            function addEvents() {
                $.missedBreak.addEventListener("close", destroy);
                $.missedBreak.addEventListener("open", function() {
                    restartTimeout();
                    Alloy.Collections.deviceHelp.audioPlayer.play();
                });
                $.missedBreak.addEventListener("touchstart", restartTimeout);
                $.submitBreakHours.addEventListener("touchstart", changeColor);
                $.submitBreakHours.addEventListener("touchend", changeColor);
                $.submitBreakHours.addEventListener("click", captureTextFieldVal);
            }
            var sessionObj = CloudClock.sessionObj;
            sessionObj.shift.nextWindow = "";
            var postExceptions_cfg = {
                endpoint: "postExceptions",
                params: {
                    termID: Ti.App.Properties.getString("TERMID"),
                    badge: CloudClock.sessionObj.employee.get("badge"),
                    weekId: 0,
                    shiftId: CloudClock.sessionObj.currentPunch.shiftId ? CloudClock.sessionObj.currentPunch.shiftId : 0,
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
                        initials: CloudClock.sessionObj.currentPunch.initials
                    },
                    processExceptions: [ {} ]
                },
                onSuccess: function(response) {
                    response ? CloudClock.log("Info", "Success posting exceptions to postExceptions API endpoint.") : CloudClock.log("Error", "Error posting exceptions to postExceptions API endpoint.");
                    var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
                    if ("0" === CONFIRMATION) {
                        CloudClock.flashConfirmation = true;
                        CloudClock.sessionObj.nextWindow = "index";
                    } else CloudClock.sessionObj.nextWindow = "employeeFlow_hoursVerification";
                    $.activityIndicator.hide();
                    CloudClock.dispatcher.nextWindow({
                        context: $
                    });
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error in post exceptions API call: " + JSON.stringify(response));
                    var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
                    if ("0" === CONFIRMATION) {
                        CloudClock.flashConfirmation = true;
                        CloudClock.sessionObj.nextWindow = "index";
                    } else CloudClock.sessionObj.nextWindow = "";
                    $.activityIndicator.hide();
                    CloudClock.dispatcher.nextWindow({
                        context: $
                    });
                }
            };
            var numOfScreens = sessionObj.missedBreakData.exceptionScreens.length;
            sessionObj.currentPunch.exceptions = {};
            for (var i = 0; numOfScreens > i; i++) {
                sessionObj.currentPunch.exceptions[i] = {
                    transId: sessionObj.missedBreakData.transID,
                    itemType: 0,
                    itemId: 0,
                    itemValue: 0
                };
                postExceptions_cfg.payload.processExceptions[i] = {
                    transId: sessionObj.missedBreakData.transID,
                    itemType: 0,
                    itemId: 0,
                    itemValue: 0
                };
            }
            updateUI(sessionObj.missedBreakData.exceptionScreens[0]);
            $.missedBreak.screenNum = 0;
            addEvents();
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;