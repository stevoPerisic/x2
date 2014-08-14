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
    this.__controllerPath = "employeeFlow_actualVsScheduled";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.actualVsScheduled = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "actualVsScheduled"
    });
    $.__views.actualVsScheduled && $.addTopLevelView($.__views.actualVsScheduled);
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
        id: "activityIndicator"
    });
    $.__views.actualVsScheduled.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.actualVsScheduled
    });
    $.__views.header.setParent($.__views.actualVsScheduled);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.actualVsScheduled.add($.__views.content);
    $.__views.actualVsScheduledLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        id: "actualVsScheduledLbl"
    });
    $.__views.content.add($.__views.actualVsScheduledLbl);
    $.__views.scheduledTimeWrap = Ti.UI.createView({
        top: "120dp",
        width: "50%",
        left: 0,
        layout: "vertical",
        id: "scheduledTimeWrap"
    });
    $.__views.content.add($.__views.scheduledTimeWrap);
    $.__views.actualTimeWrap = Ti.UI.createView({
        top: "120dp",
        width: "50%",
        right: 0,
        layout: "vertical",
        id: "actualTimeWrap"
    });
    $.__views.content.add($.__views.actualTimeWrap);
    $.__views.actualTime = Ti.UI.createView({
        top: "20dp",
        width: "60%",
        height: "100dp",
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        id: "actualTime"
    });
    $.__views.actualTimeWrap.add($.__views.actualTime);
    $.__views.actualTimeLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "actualTimeLbl",
        shiftID: "0",
        shiftOrder: "0",
        overrideFlag: "1"
    });
    $.__views.actualTime.add($.__views.actualTimeLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeFlow", "actualVsScheduled", $.header.exit);
            CloudClock.clock.showEmployeeFlowDialog = true;
        }
        function changeLabelColor(e) {
            e.source.removeEventListener(e.type, changeLabelColor);
            e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
            e.source.color = "touchstart" === e.type ? "#fff" : "#333";
        }
        function actualTimeSelected(e) {
            try {
                e.source.removeEventListener("click", actualTimeSelected);
                sessionObj.punchException = "I" === sessionObj.currentPunch.transType ? 2 : 9;
                sessionObj.nextWindow = "employeeFlow_earlyOrLate";
                if (1 !== sessionObj.shift.length) updateUI_pickShift(); else {
                    sessionObj.currentPunch.shiftID = e.source.shiftID;
                    CloudClock.dispatcher.nextWindow({
                        context: $
                    });
                }
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function scheduledShiftSelected(e) {
            try {
                e.source.removeEventListener("click", scheduledShiftSelected);
                sessionObj.currentPunch.shiftID = e.source.shiftID;
                sessionObj.currentPunch.overrideFlag = 0;
                CloudClock.dispatcher.nextWindow({
                    context: $
                });
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function multiShiftPicked(e) {
            e.source.removeEventListener("click", multiShiftPicked);
            sessionObj.shift = sessionObj.shift.splice([ e.source.shiftOrder ], 1);
            sessionObj.currentPunch.shiftID = e.source.shiftID;
            if (sessionObj.punchException) {
                sessionObj.nextWindow = "employeeFlow_earlyOrLate";
                CloudClock.dispatcher.nextWindow({
                    context: $
                });
            } else softScheduling.immediatePunch($);
        }
        function buildScheduledShiftView(_shift, _parentView, _evtFunc) {
            var scheduledShiftLbl = Ti.UI.createLabel({
                text: "Scheduled\n" + _shift.get("displayName"),
                top: "10dp",
                left: numOfShifts > 4 && "scheduledTimeWrap" !== _parentView.id ? "5%" : "20%",
                right: numOfShifts > 4 && "scheduledTimeWrap" !== _parentView.id ? "5%" : "20%",
                width: numOfShifts > 4 && "scheduledTimeWrap" !== _parentView.id ? "40%" : "60%",
                height: "100dp",
                backgroundColor: "#fff",
                borderRadius: 5,
                borderWidth: "1dp",
                borderColor: "#e4e4e4",
                font: {
                    fontSize: "22dp",
                    fontWeight: "bold"
                },
                color: "#333",
                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                shiftOrder: 0,
                shiftID: _shift.get("deptShiftID"),
                overrideFlag: 0
            });
            scheduledShiftLbl.addEventListener("click", _evtFunc.click);
            scheduledShiftLbl.addEventListener("touchstart", _evtFunc.touch);
            scheduledShiftLbl.addEventListener("touchend", _evtFunc.touch);
            _parentView.add(scheduledShiftLbl);
            scheduledShiftLbl = null;
        }
        function destroy() {
            $.actualVsScheduled.removeEventListener("touchstart", restartTimeout);
            $.actualVsScheduled.removeEventListener("close", destroy);
            $.destroy();
            $.actualVsScheduled.removeAllChildren();
            sessionObj = null;
            $ = null;
        }
        function addEventListeners() {
            $.actualVsScheduled.addEventListener("close", destroy);
            $.actualVsScheduled.addEventListener("open", function() {
                restartTimeout();
                Alloy.Collections.deviceHelp.audioPlayer.play();
            });
            $.actualVsScheduled.addEventListener("touchstart", restartTimeout);
            $.actualTimeLbl.addEventListener("click", actualTimeSelected);
            $.actualTimeLbl.addEventListener("touchstart", changeLabelColor);
            $.actualTimeLbl.addEventListener("touchend", changeLabelColor);
        }
        function updateUI_pickShift() {
            $.actualTimeWrap.hide();
            $.scheduledTimeWrap.setWidth("100%");
            $.actualVsScheduledLbl.setText("I" === sessionObj.currentPunch.transType ? CloudClock.customL.strings("selectShiftIN") : CloudClock.customL.strings("selectShiftOUT"));
        }
        function updateUI() {
            if (sessionObj.showActual) {
                $.actualTimeLbl.shiftID = 1 !== sessionObj.shift.length ? 0 : sessionObj.shift[0].get("deptShiftID");
                $.actualTimeLbl.setText("Now\n" + actualMoment.format("h:mmA"));
                $.actualVsScheduledLbl.setText("I" === sessionObj.currentPunch.transType ? CloudClock.customL.strings("selectTimeIN") : CloudClock.customL.strings("selectTimeOUT"));
            } else updateUI_pickShift();
            _.each(sessionObj.shift, function(shift) {
                buildScheduledShiftView(shift, $.scheduledTimeWrap, {
                    click: 1 !== sessionObj.shift.length ? multiShiftPicked : scheduledShiftSelected,
                    touch: changeLabelColor
                });
            });
        }
        try {
            var sessionObj = CloudClock.sessionObj;
            var numOfShifts = sessionObj.shift.length;
            var actualMoment = moment(sessionObj.currentPunch.transDateTime);
            var softScheduling = require("softScheduling");
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "I" === sessionObj.currentPunch.transType ? "1500" : "1600";
            updateUI();
            addEventListeners();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;