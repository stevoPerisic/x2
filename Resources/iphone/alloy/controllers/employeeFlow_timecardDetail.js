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
    this.__controllerPath = "employeeFlow_timecardDetail";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.timecardDetail = Ti.UI.createWindow({
        layout: "composite",
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "timecardDetail"
    });
    $.__views.timecardDetail && $.addTopLevelView($.__views.timecardDetail);
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
    $.__views.timecardDetail.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.timecardDetail
    });
    $.__views.header.setParent($.__views.timecardDetail);
    $.__views.__alloyId19 = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        top: "8%",
        layout: "vertical",
        horizontalWrap: false,
        id: "__alloyId19"
    });
    $.__views.timecardDetail.add($.__views.__alloyId19);
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
    $.__views.__alloyId19.add($.__views.contentHeader);
    $.__views.weekNavBtns = Ti.UI.createView({
        width: "301dp",
        height: "40dp",
        right: "35%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        layout: "horizontal",
        backgroundColor: "#fff",
        id: "weekNavBtns"
    });
    $.__views.contentHeader.add($.__views.weekNavBtns);
    $.__views.previousWeek = Ti.UI.createButton({
        height: "100%",
        font: {
            fontSize: "20dp"
        },
        color: "#ffffff",
        borderColor: "#1c1d1c",
        backgroundImage: "none",
        borderWidth: 0,
        width: "150dp",
        title: "",
        apiName: "Ti.UI.Button",
        id: "previousWeek",
        classes: [ "weekNavBtn" ]
    });
    $.__views.weekNavBtns.add($.__views.previousWeek);
    $.__views.previousWeekLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#000",
        backgroundColor: "transparent",
        apiName: "Ti.UI.Label",
        id: "previousWeekLbl",
        classes: [ "weekNavLbl" ]
    });
    $.__views.previousWeek.add($.__views.previousWeekLbl);
    $.__views.verticalLine = Ti.UI.createView({
        top: 0,
        height: "100%",
        width: "1dp",
        backgroundColor: "#e4e4e4",
        id: "verticalLine"
    });
    $.__views.weekNavBtns.add($.__views.verticalLine);
    $.__views.nextWeek = Ti.UI.createButton({
        height: "100%",
        font: {
            fontSize: "20dp"
        },
        color: "#e4e4e4",
        borderColor: "#1c1d1c",
        backgroundImage: "none",
        borderWidth: 0,
        backgroundColor: "#fcfcfc",
        width: "150dp",
        title: "",
        apiName: "Ti.UI.Button",
        id: "nextWeek",
        classes: [ "weekNavBtn", "disabled" ]
    });
    $.__views.weekNavBtns.add($.__views.nextWeek);
    $.__views.nextWeekLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#f2f2f2",
        backgroundColor: "transparent",
        apiName: "Ti.UI.Label",
        id: "nextWeekLbl",
        classes: [ "weekNavLbl", "labelDisabled" ]
    });
    $.__views.nextWeek.add($.__views.nextWeekLbl);
    $.__views.commIconsWrap = Ti.UI.createView({
        width: Ti.UI.SIZE,
        right: 0,
        top: "10dp",
        height: "40dp",
        layout: "horizontal",
        id: "commIconsWrap"
    });
    $.__views.contentHeader.add($.__views.commIconsWrap);
    $.__views.print = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        right: "10dp",
        height: "40dp",
        width: Ti.UI.SIZE,
        backgroundColor: "#fff",
        borderColor: "#34aadc",
        borderRadius: 10,
        layout: "horizontal",
        text: "",
        id: "print"
    });
    $.__views.commIconsWrap.add($.__views.print);
    $.__views.__alloyId20 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/print-24.png",
        id: "__alloyId20"
    });
    $.__views.print.add($.__views.__alloyId20);
    $.__views.printLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34aadc",
        top: "10dp",
        left: "10dp",
        right: "10dp",
        width: Ti.UI.SIZE,
        id: "printLbl",
        text: "Print"
    });
    $.__views.print.add($.__views.printLbl);
    $.__views.text = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        right: "10dp",
        height: "40dp",
        width: Ti.UI.SIZE,
        backgroundColor: "#fff",
        borderColor: "#34aadc",
        borderRadius: 10,
        layout: "horizontal",
        text: "",
        id: "text"
    });
    $.__views.commIconsWrap.add($.__views.text);
    $.__views.__alloyId21 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/text-message-24.png",
        id: "__alloyId21"
    });
    $.__views.text.add($.__views.__alloyId21);
    $.__views.smsLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34aadc",
        top: "10dp",
        left: "10dp",
        right: "10dp",
        width: Ti.UI.SIZE,
        id: "smsLbl",
        text: "SMS"
    });
    $.__views.text.add($.__views.smsLbl);
    $.__views.email = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        right: "10dp",
        height: "40dp",
        width: Ti.UI.SIZE,
        backgroundColor: "#fff",
        borderColor: "#34aadc",
        borderRadius: 10,
        layout: "horizontal",
        text: "",
        id: "email"
    });
    $.__views.commIconsWrap.add($.__views.email);
    $.__views.__alloyId22 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/1395344760_icon-ios7-email.png",
        id: "__alloyId22"
    });
    $.__views.email.add($.__views.__alloyId22);
    $.__views.emailLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34aadc",
        top: "10dp",
        left: "10dp",
        right: "10dp",
        width: Ti.UI.SIZE,
        id: "emailLbl",
        text: "Email"
    });
    $.__views.email.add($.__views.emailLbl);
    $.__views.timecardWrap = Ti.UI.createView({
        top: 0,
        layout: "composite",
        backgroundColor: "#fcfcfc",
        id: "timecardWrap"
    });
    $.__views.__alloyId19.add($.__views.timecardWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    try {
        (function() {
            "use strict";
            function emptyFn(e) {
                $[e.source.id].removeEventListener("doubletap", emptyFn);
                return false;
            }
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "timecardDetail", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function destroy() {
                timecard.gc();
                $.timecardDetail.removeEventListener("touchstart", restartTimeout);
                $.timecardDetail.removeEventListener("close", destroy);
                $.previousWeek.removeEventListener("click", timecard.navigateWeeks);
                $.previousWeek.removeEventListener("doubletap", emptyFn);
                $.previousWeek.removeEventListener("touchstart", timecard.prevNextChangeBackground);
                $.previousWeek.removeEventListener("touchend", timecard.prevNextChangeBackground);
                $.nextWeek.removeEventListener("click", timecard.navigateWeeks);
                $.nextWeek.removeEventListener("doubletap", emptyFn);
                $.nextWeek.removeEventListener("touchstart", timecard.prevNextChangeBackground);
                $.nextWeek.removeEventListener("touchend", timecard.prevNextChangeBackground);
                $.text.removeEventListener("click", timecard.textMe);
                $.text.removeEventListener("click", timecard.setUpEmplComm);
                $.email.removeEventListener("click", timecard.emailMe);
                $.email.removeEventListener("click", timecard.setUpEmplComm);
                $.print.removeEventListener("click", timecard.printMe);
                $.text.removeEventListener("touchstart", timecard.commButtonsChangeColor);
                $.email.removeEventListener("touchstart", timecard.commButtonsChangeColor);
                $.print.removeEventListener("touchstart", timecard.commButtonsChangeColor);
                $.text.removeEventListener("touchend", timecard.commButtonsChangeColor);
                $.email.removeEventListener("touchend", timecard.commButtonsChangeColor);
                $.print.removeEventListener("touchend", timecard.commButtonsChangeColor);
                _.isEmpty($.sessionObj.employee) || $.sessionObj.clearSession();
                $.destroy();
                $.timecardDetail.removeAllChildren();
                timecard = null;
                $.sessionObj = null;
                $ = null;
                console.log("\n\n\nEmployee flow timecard detail destroyed: " + JSON.stringify($));
            }
            function addEvents() {
                $.timecardDetail.addEventListener("close", destroy);
                $.timecardDetail.addEventListener("touchstart", restartTimeout);
                $.timecardDetail.addEventListener("open", Alloy.Collections.deviceHelp.audioPlayer.play);
                $.previousWeek.addEventListener("click", timecard.navigateWeeks);
                $.previousWeek.addEventListener("doubletap", emptyFn);
                $.previousWeek.addEventListener("touchstart", timecard.prevNextChangeBackground);
                $.previousWeek.addEventListener("touchend", timecard.prevNextChangeBackground);
                $.nextWeek.addEventListener("click", timecard.navigateWeeks);
                $.nextWeek.addEventListener("doubletap", emptyFn);
                $.nextWeek.addEventListener("touchstart", timecard.prevNextChangeBackground);
                $.nextWeek.addEventListener("touchend", timecard.prevNextChangeBackground);
                $.text.addEventListener("click", $.sessionObj.employee.get("cellPhone") ? timecard.textMe : timecard.setUpEmplComm);
                $.email.addEventListener("click", $.sessionObj.employee.get("email") ? timecard.emailMe : timecard.setUpEmplComm);
                $.print.addEventListener("click", timecard.printMe);
                $.text.addEventListener("touchstart", timecard.commButtonsChangeColor);
                $.email.addEventListener("touchstart", timecard.commButtonsChangeColor);
                $.print.addEventListener("touchstart", timecard.commButtonsChangeColor);
                $.text.addEventListener("touchend", timecard.commButtonsChangeColor);
                $.email.addEventListener("touchend", timecard.commButtonsChangeColor);
                $.print.addEventListener("touchend", timecard.commButtonsChangeColor);
            }
            function getAppParameters() {
                var isEmail = Ti.App.Properties.getString("ALLOWEMAIL");
                var isText = Ti.App.Properties.getString("ALLOWTEXT");
                var isPrint = Ti.App.Properties.getString("ALLOWPRINT");
                var isView = Ti.App.Properties.getString("ALLOWVIEW");
                var parmObj = {
                    isEmailAllowed: isEmail && "0" !== isEmail ? true : false,
                    isTextAllowed: isText && "0" !== isText ? true : false,
                    isPrintAllowed: isPrint && "0" !== isPrint ? true : false,
                    isViewAllowed: isView && "0" !== isView ? true : false
                };
                console.log("getAppParameters() returning: " + JSON.stringify(parmObj));
                return parmObj;
            }
            function updateUI() {
                $.previousWeekLbl.setText(CloudClock.customL.strings("previous"));
                $.nextWeekLbl.setText(CloudClock.customL.strings("next"));
                $.printLbl.setText(CloudClock.customL.strings("print"));
                $.smsLbl.setText(CloudClock.customL.strings("sms"));
                $.emailLbl.setText(CloudClock.customL.strings("email"));
                true === Ti.Network.online && $.header.exit.hide();
                var parm = getAppParameters();
                $.email.setVisible(parm.isEmailAllowed);
                $.text.setVisible(parm.isTextAllowed);
                $.print.setVisible(parm.isPrintAllowed);
                $.header.exitLbl.setText(CloudClock.customL.strings("done"));
                $.previousWeek.applyProperties({
                    week: 1
                });
                $.nextWeek.applyProperties({
                    week: 0
                });
            }
            var timecard = require("timecard");
            $.sessionObj = CloudClock.sessionObj;
            $.week = 0;
            $.restartTimeout = restartTimeout;
            timecard.init($);
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1602";
            updateUI();
            addEvents();
            timecard.submitPunchAndView();
            CloudClock.screenTimeout._context = $;
            $.timecardDetail.open();
            restartTimeout();
            $.activityIndicator.show();
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;