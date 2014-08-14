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
    this.__controllerPath = "employeeFlow_earlyOrLate";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.earlyOrLate = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "earlyOrLate"
    });
    $.__views.earlyOrLate && $.addTopLevelView($.__views.earlyOrLate);
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
    $.__views.earlyOrLate.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.earlyOrLate
    });
    $.__views.header.setParent($.__views.earlyOrLate);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.earlyOrLate.add($.__views.content);
    $.__views.earlyOrLateLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        id: "earlyOrLateLbl"
    });
    $.__views.content.add($.__views.earlyOrLateLbl);
    $.__views.earlyOrLateReasons = Ti.UI.createView({
        top: "120dp",
        width: "100%",
        height: "400dp",
        left: 0,
        layout: "horizontal",
        id: "earlyOrLateReasons"
    });
    $.__views.content.add($.__views.earlyOrLateReasons);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeFlow", "earlyOrLate", $.header.exit);
            CloudClock.clock.showEmployeeFlowDialog = true;
        }
        function changeLabelColor(e) {
            e.source.removeEventListener(e.type, changeLabelColor);
            e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
        }
        function reasonSelected(e) {
            try {
                e.source.removeEventListener("click", reasonSelected);
                sessionObj.currentPunch.shiftID = _.isFunction(sessionObj.shift.get) ? sessionObj.shift.get("deptShiftID") : sessionObj.shift[0].get("deptShiftID");
                sessionObj.currentPunch.reasonCodeID = e.source.reasonCodeID;
                sessionObj.currentPunch.reasonCodeType = e.source.reasonCodeType;
                CloudClock.dispatcher.nextWindow({
                    context: $
                });
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function destroy() {
            $.earlyOrLate.removeEventListener("touchstart", restartTimeout);
            $.earlyOrLate.removeEventListener("close", destroy);
            $.destroy();
            $.earlyOrLate.removeAllChildren();
            sessionObj = null;
            $ = null;
        }
        function updateUI() {
            $.earlyOrLateLbl.text = 2 === sessionObj.punchException ? CloudClock.customL.strings("earlyIn") : 15 === sessionObj.punchException ? CloudClock.customL.strings("earlyOut") : 14 === sessionObj.punchException ? CloudClock.customL.strings("lateIn") : 9 === sessionObj.punchException ? CloudClock.customL.strings("lateOut") : 1 === sessionObj.punchException ? CloudClock.customL.strings("veryEarlyIn") : 16 === sessionObj.punchException ? CloudClock.customL.strings("veryLateOut") : CloudClock.customL.strings("earlyOrLate") + reasonType + " punch.";
            _.each(earlyOrLateReasons, function(reason, i) {
                var reasonLabel = Ti.UI.createLabel({
                    reasonCodeID: reason.get("reasonCodeID"),
                    reasonCodeType: reason.get("reasonCodeType"),
                    text: reason.get("reasonLabel"),
                    top: "20dp",
                    left: "10%",
                    width: "35%",
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
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                });
                $.earlyOrLateReasons.add(reasonLabel);
                $.earlyOrLateReasons.children[i].addEventListener("click", reasonSelected);
                $.earlyOrLateReasons.children[i].addEventListener("touchstart", changeLabelColor);
                $.earlyOrLateReasons.children[i].addEventListener("touchend", changeLabelColor);
                reasonlabel = null;
            });
        }
        function addEventListeners() {
            $.earlyOrLate.addEventListener("close", destroy);
            $.earlyOrLate.addEventListener("open", function() {
                restartTimeout();
                Alloy.Collections.deviceHelp.audioPlayer.play();
            });
            $.earlyOrLate.addEventListener("touchstart", restartTimeout);
        }
        try {
            Alloy.Collections.reasonCodes.fetch({
                success: function() {
                    console.log("Reason codes successfuly retrieved from local DB.");
                },
                error: function(collection, response) {
                    CloudClock.log("Error", JSON.stringify(response));
                }
            });
            var sessionObj = CloudClock.sessionObj;
            var earlyOrLateReasons = Alloy.Collections.reasonCodes.where({
                reasonCodeType: sessionObj.punchException
            });
            var reasonType = Alloy.Collections.reasonCodes.reasonCodeTypes[sessionObj.punchException];
            require("softScheduling");
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = 2 === sessionObj.punchException ? "1501" : 15 === sessionObj.punchException ? "1502" : 14 === sessionObj.punchException ? "1504" : 9 === sessionObj.punchException ? "1507" : "0";
            if (0 === earlyOrLateReasons.length) {
                CloudClock.log("Error", "The clock does not have data in the Reasons table, please set them up and initiate a Long Update.");
                CloudClock.log("Info", "Taking the shift ID: " + sessionObj.currentPunch.shiftID + ", Reason Code: " + sessionObj.currentPunch.reasonCodeID + ", Reason type:" + sessionObj.currentPunch.reasonCodeType + ".");
                sessionObj.nextWindow = "";
                CloudClock.dispatcher.nextWindow({
                    context: $
                });
            } else {
                updateUI();
                addEventListeners();
            }
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;