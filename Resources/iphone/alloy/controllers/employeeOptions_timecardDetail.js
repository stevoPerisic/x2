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
    this.__controllerPath = "employeeOptions_timecardDetail";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.timecardDetail = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        layout: "composite",
        id: "timecardDetail"
    });
    $.__views.timecardDetail && $.addTopLevelView($.__views.timecardDetail);
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
    $.__views.timecardDetail.add($.__views.contentHeader);
    $.__views.back = Ti.UI.createButton({
        height: "80%",
        font: {
            fontSize: "20dp"
        },
        color: "#ffffff",
        borderColor: "#34aadc",
        backgroundImage: "none",
        borderWidth: 1,
        width: "160dp",
        top: "10%",
        left: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        title: "",
        id: "back"
    });
    $.__views.contentHeader.add($.__views.back);
    $.__views.__alloyId32 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/back-32-blue.png",
        id: "__alloyId32"
    });
    $.__views.back.add($.__views.__alloyId32);
    $.__views.backBtnLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34AADC",
        left: 60,
        id: "backBtnLbl"
    });
    $.__views.back.add($.__views.backBtnLbl);
    $.__views.weekNavBtns = Ti.UI.createView({
        width: "301dp",
        height: "40dp",
        left: "8%",
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
    $.__views.__alloyId33 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/print-24.png",
        id: "__alloyId33"
    });
    $.__views.print.add($.__views.__alloyId33);
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
    $.__views.__alloyId34 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/text-message-24.png",
        id: "__alloyId34"
    });
    $.__views.text.add($.__views.__alloyId34);
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
    $.__views.__alloyId35 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/1395344760_icon-ios7-email.png",
        id: "__alloyId35"
    });
    $.__views.email.add($.__views.__alloyId35);
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
        top: "60dp",
        height: "100%",
        layout: "composite",
        id: "timecardWrap"
    });
    $.__views.timecardDetail.add($.__views.timecardWrap);
    $.__views.timecardWrapHeader = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: "5dp",
        height: "40dp",
        id: "timecardWrapHeader"
    });
    $.__views.timecardWrap.add($.__views.timecardWrapHeader);
    $.__views.tableHolder = Ti.UI.createView({
        top: "65dp",
        layout: "horizontal",
        id: "tableHolder"
    });
    $.__views.timecardWrap.add($.__views.tableHolder);
    $.__views.tableLeftContainer = Ti.UI.createView({
        top: 0,
        left: "5%",
        width: "35%",
        layout: "vertical",
        id: "tableLeftContainer"
    });
    $.__views.tableHolder.add($.__views.tableLeftContainer);
    $.__views.__alloyId36 = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "64dp",
        id: "__alloyId36"
    });
    $.__views.tableLeftContainer.add($.__views.__alloyId36);
    $.__views.weeklySummLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: 10,
        width: "160dp",
        id: "weeklySummLbl"
    });
    $.__views.__alloyId36.add($.__views.weeklySummLbl);
    var __alloyId37 = [];
    $.__views.weeklySum = Ti.UI.createTableViewSection({
        left: 0,
        width: "100%",
        id: "weeklySum"
    });
    __alloyId37.push($.__views.weeklySum);
    $.__views.tableWeeklySum = Ti.UI.createTableView({
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "44dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "88dp",
        data: __alloyId37,
        id: "tableWeeklySum"
    });
    $.__views.tableLeftContainer.add($.__views.tableWeeklySum);
    $.__views.tableRightContainer = Ti.UI.createView({
        top: 0,
        left: "5%",
        width: "50%",
        layout: "vertical",
        id: "tableRightContainer"
    });
    $.__views.tableHolder.add($.__views.tableRightContainer);
    $.__views.__alloyId38 = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "64dp",
        id: "__alloyId38"
    });
    $.__views.tableRightContainer.add($.__views.__alloyId38);
    $.__views.dailySummLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: 10,
        width: "160dp",
        id: "dailySummLbl"
    });
    $.__views.__alloyId38.add($.__views.dailySummLbl);
    $.__views.moreDetails = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34aadc",
        right: 0,
        height: "44dp",
        width: "120dp",
        backgroundColor: "#fff",
        borderColor: "#34aadc",
        borderRadius: 10,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "moreDetails"
    });
    $.__views.__alloyId38.add($.__views.moreDetails);
    var __alloyId39 = [];
    $.__views.dailySum = Ti.UI.createTableViewSection({
        left: 0,
        width: "100%",
        id: "dailySum"
    });
    __alloyId39.push($.__views.dailySum);
    $.__views.tableDailySum = Ti.UI.createTableView({
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "44dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "311dp",
        data: __alloyId39,
        id: "tableDailySum"
    });
    $.__views.tableRightContainer.add($.__views.tableDailySum);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function emptyFn(e) {
            $[e.source.id].removeEventListener("doubletap", emptyFn);
            return false;
        }
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeOptions", "employeeOptions", CloudClock.employeeOptions.header.exit);
            CloudClock.clock.showEmployeeOptionsDialog = true;
        }
        function goBack() {
            restartTimeout();
            if (CloudClock.APIcallInProgress) return false;
            $.back.removeEventListener("click", goBack);
            CloudClock.employeeOptions.optionsContent.left = "30%";
            CloudClock.employeeOptions.optionsContent.width = "70%";
            CloudClock.employeeOptions.sidebar.show();
            console.log(JSON.stringify($.timecardWrap.children));
            _.each($.timecardWrap.children, function(child) {
                _.has(child, "id") && "timecardWebView" === child.id && $.timecardWrap.remove(child);
                _.has(child, "id") && "timecardErrorLabel" === child.id && $.timecardWrap.remove(child);
            });
            $.timecardWrapHeader.show();
            $.timecardDetail.show();
            $.tableHolder.show();
            $.weekNavBtns.visible = true;
            $.back.hide();
            $.back.addEventListener("click", goBack);
        }
        function moreDetailsClick() {
            restartTimeout();
            if (CloudClock.APIcallInProgress) return false;
            $.moreDetails.removeEventListener("click", moreDetailsClick);
            CloudClock.employeeOptions.activityIndicator.show();
            CloudClock.employeeOptions.optionsContent.left = 0;
            CloudClock.employeeOptions.optionsContent.width = "100%";
            CloudClock.employeeOptions.sidebar.hide();
            $.weekNavBtns.visible = false;
            $.back.show();
            $.tableHolder.hide();
            timecard.viewDetailsPrint();
            $.moreDetails.addEventListener("click", moreDetailsClick);
        }
        function moreDetailsBackgroundChange(e) {
            e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
            e.source.borderColor = "touchstart" === e.type ? "#fff" : "#34aadc";
            e.source.color = "touchstart" === e.type ? "#fff" : "#34aadc";
        }
        function setText() {
            $.backBtnLbl.setText(CloudClock.customL.strings("back_btn"));
            $.previousWeekLbl.setText(CloudClock.customL.strings("previous"));
            $.nextWeekLbl.setText(CloudClock.customL.strings("next"));
            $.weeklySummLbl.setText(CloudClock.customL.strings("weekly_summ"));
            $.dailySummLbl.setText(CloudClock.customL.strings("daily_summ"));
            $.moreDetails.setText(CloudClock.customL.strings("more_details"));
            $.printLbl.setText(CloudClock.customL.strings("print"));
            $.smsLbl.setText(CloudClock.customL.strings("sms"));
            $.emailLbl.setText(CloudClock.customL.strings("email"));
        }
        function updateUI() {
            CloudClock.employeeOptions.activityIndicator.show();
            timecard.viewDetails();
            $.back.setVisible(false);
            $.timecardDetail.setVisible(false);
            setText();
            var parm = CloudClock.getAppParameters();
            $.email.setVisible(parm.isEmailAllowed);
            $.text.setVisible(parm.isTextAllowed);
            $.print.setVisible(parm.isPrintAllowed);
        }
        function addEventListeners() {
            $.previousWeek.addEventListener("click", timecard.navigateWeeks);
            $.previousWeek.addEventListener("doubletap", emptyFn);
            $.previousWeek.addEventListener("touchstart", timecard.prevNextChangeBackground);
            $.previousWeek.addEventListener("touchend", timecard.prevNextChangeBackground);
            $.nextWeek.addEventListener("click", timecard.navigateWeeks);
            $.nextWeek.addEventListener("doubletap", emptyFn);
            $.nextWeek.addEventListener("touchstart", timecard.prevNextChangeBackground);
            $.nextWeek.addEventListener("touchend", timecard.prevNextChangeBackground);
            $.back.addEventListener("click", goBack);
            $.moreDetails.addEventListener("click", moreDetailsClick);
            $.moreDetails.addEventListener("touchstart", moreDetailsBackgroundChange);
            $.moreDetails.addEventListener("touchend", moreDetailsBackgroundChange);
            $.text.addEventListener("touchstart", timecard.commButtonsChangeColor);
            $.email.addEventListener("touchstart", timecard.commButtonsChangeColor);
            $.print.addEventListener("touchstart", timecard.commButtonsChangeColor);
            $.text.addEventListener("touchend", timecard.commButtonsChangeColor);
            $.email.addEventListener("touchend", timecard.commButtonsChangeColor);
            $.print.addEventListener("touchend", timecard.commButtonsChangeColor);
            $.print.addEventListener("click", timecard.printMe);
            $.text.addEventListener("click", CloudClock.sessionObj.employee.get("cellPhone") ? timecard.textMe : timecard.setUpEmplComm);
            $.email.addEventListener("click", CloudClock.sessionObj.employee.get("email") ? timecard.emailMe : timecard.setUpEmplComm);
        }
        try {
            $.week = 0;
            $.weekEnding = true;
            $.restartTimeout = restartTimeout;
            $.nextWeek.enabled = false;
            $.previousWeek.week = 1;
            $.nextWeek.week = 0;
            var timecard = CloudClock.employeeOptions.timecard;
            timecard.init($);
            updateUI();
            addEventListeners();
            restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;