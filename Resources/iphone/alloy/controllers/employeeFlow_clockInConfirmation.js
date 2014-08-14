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
    this.__controllerPath = "employeeFlow_clockInConfirmation";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.clockIn_confirmation = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "clockIn_confirmation"
    });
    $.__views.clockIn_confirmation && $.addTopLevelView($.__views.clockIn_confirmation);
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
    $.__views.clockIn_confirmation.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.clockIn_confirmation
    });
    $.__views.header.setParent($.__views.clockIn_confirmation);
    $.__views.__alloyId11 = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        top: "8%",
        layout: "vertical",
        id: "__alloyId11"
    });
    $.__views.clockIn_confirmation.add($.__views.__alloyId11);
    $.__views.review = Ti.UI.createView({
        height: "50%",
        width: Ti.UI.Fill,
        backgroundColor: "#fff",
        layout: "horizontal",
        id: "review"
    });
    $.__views.__alloyId11.add($.__views.review);
    $.__views.reviewLeft = Ti.UI.createView({
        top: "30dp",
        width: "56%",
        height: Ti.UI.Fill,
        left: "4%",
        layout: "vertical",
        id: "reviewLeft"
    });
    $.__views.review.add($.__views.reviewLeft);
    $.__views.reviewText = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "reviewText"
    });
    $.__views.reviewLeft.add($.__views.reviewText);
    $.__views.nameAndPin = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        top: "20dp",
        id: "nameAndPin"
    });
    $.__views.reviewLeft.add($.__views.nameAndPin);
    $.__views.pin = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "pin"
    });
    $.__views.reviewLeft.add($.__views.pin);
    $.__views.departmentName = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "departmentName"
    });
    $.__views.reviewLeft.add($.__views.departmentName);
    $.__views.date = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "date"
    });
    $.__views.reviewLeft.add($.__views.date);
    $.__views.clockInTime = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "22dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#ff9500",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "clockInTime"
    });
    $.__views.reviewLeft.add($.__views.clockInTime);
    $.__views.reviewRight = Ti.UI.createView({
        top: "20dp",
        width: "40%",
        height: Ti.UI.Fill,
        layout: "horizontal",
        id: "reviewRight"
    });
    $.__views.review.add($.__views.reviewRight);
    $.__views.punchPhotoWrap = Ti.UI.createView({
        top: "20dp",
        width: "180dp",
        height: "240dp",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ff9500",
        left: "2%",
        right: "2%",
        id: "punchPhotoWrap"
    });
    $.__views.reviewRight.add($.__views.punchPhotoWrap);
    $.__views.punchPhoto = Ti.UI.createImageView({
        id: "punchPhoto"
    });
    $.__views.punchPhotoWrap.add($.__views.punchPhoto);
    $.__views.reviewPicLabel = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        height: "20dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        bottom: "15dp",
        id: "reviewPicLabel",
        text: "Punch Photo"
    });
    $.__views.punchPhotoWrap.add($.__views.reviewPicLabel);
    $.__views.masterPhotoWrap = Ti.UI.createView({
        top: "20dp",
        width: "180dp",
        height: "240dp",
        id: "masterPhotoWrap"
    });
    $.__views.reviewRight.add($.__views.masterPhotoWrap);
    $.__views.masterPhoto = Ti.UI.createImageView({
        id: "masterPhoto"
    });
    $.__views.masterPhotoWrap.add($.__views.masterPhoto);
    $.__views.masterPhotoLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        height: "20dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        bottom: "15dp",
        id: "masterPhotoLbl"
    });
    $.__views.masterPhotoWrap.add($.__views.masterPhotoLbl);
    $.__views.acceptPunchButtons = Ti.UI.createView({
        height: "50%",
        width: "100%",
        backgroundColor: "#fcfcfc",
        id: "acceptPunchButtons"
    });
    $.__views.__alloyId11.add($.__views.acceptPunchButtons);
    $.__views.acceptPunchText = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        backgroundColor: "#fcfcfc",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        top: "40dp",
        height: "40dp",
        id: "acceptPunchText"
    });
    $.__views.acceptPunchButtons.add($.__views.acceptPunchText);
    $.__views.yesAcceptPunch = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "25dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        top: "110dp",
        width: "300dp",
        height: "60dp",
        borderRadius: 10,
        borderColor: "#62bb47",
        backgroundColor: "#62bb47",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        left: "15%",
        id: "yesAcceptPunch"
    });
    $.__views.acceptPunchButtons.add($.__views.yesAcceptPunch);
    $.__views.yesAndViewHours = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "25dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        top: "110dp",
        width: "300dp",
        height: "60dp",
        borderRadius: 10,
        borderColor: "#62bb47",
        backgroundColor: "#62bb47",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        right: "15%",
        id: "yesAndViewHours"
    });
    $.__views.acceptPunchButtons.add($.__views.yesAndViewHours);
    $.__views.exit = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "25dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#34aadc",
        left: "34.5%",
        backgroundColor: "#fcfcfc",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        bottom: "70dp",
        height: "60dp",
        width: "310dp",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#34aadc",
        id: "exit"
    });
    $.__views.acceptPunchButtons.add($.__views.exit);
    exports.destroy = function() {};
    _.extend($, $.__views);
    try {
        (function() {
            function exitClick() {
                $.exit.removeEventListener("click", exitClick);
                CloudClock.clock.showEmployeeFlowDialog = false;
                CloudClock.log("Info", "Employee exited the confirmation screen without confirming punch!");
                sessionObj.clearSession();
                Alloy.createController("index", {
                    doNotSetParams: true
                });
                $.clockIn_confirmation.close();
            }
            function emptyFn(e) {
                $[e.source.id].removeEventListener("doubletap", emptyFn);
                return false;
            }
            function savePunch() {
                try {
                    $.activityIndicator.setMessage("Saving punch...");
                    $.activityIndicator.show();
                    sessionObj.saveTransaction();
                    return true;
                } catch (error) {
                    CloudClock.error(error);
                }
            }
            function acceptAndExit(e) {
                if ($.punchAccepted) {
                    console.log("Punch already accepted, get out!");
                    return false;
                }
                $.punchAccepted = 1;
                e.source.removeEventListener("click", acceptAndExit);
                var punchSaved = savePunch();
                if (punchSaved) {
                    CloudClock.clock.showEmployeeFlowDialog = false;
                    sessionObj.clearSession();
                    $.activityIndicator.hide();
                    Alloy.createController("index", {
                        doNotSetParams: true
                    });
                    $.clockIn_confirmation.close();
                } else {
                    $.activityIndicator.setMessage("Unable to save your punch.\nPlease press start over,\nand try again.");
                    $.activityIndicator.hide();
                }
            }
            function acceptAndViewTimecard(e) {
                if ($.punchAccepted) {
                    console.log("Punch already accepted, get out!");
                    return false;
                }
                $.punchAccepted = 1;
                e.source.removeEventListener("click", acceptAndViewTimecard);
                $.header.btnWrap.hide();
                var punchSaved = savePunch();
                if (punchSaved) {
                    $.activityIndicator.hide();
                    if (true === Ti.Network.online) {
                        Alloy.createController("employeeFlow_timecardDetail");
                        $.clockIn_confirmation.close();
                    } else {
                        $.noNetworkForTimecard = CloudClock.customAlert.create({
                            type: "alert",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("alert"),
                            message: CloudClock.customL.strings("noNetworkForTimecard"),
                            callback: {
                                eType: "click",
                                action: function() {
                                    $.noNetworkForTimecard.hide.apply($);
                                    Alloy.createController("index", {
                                        doNotSetParams: true
                                    });
                                    $.clockIn_confirmation.close();
                                }
                            }
                        });
                        $.noNetworkForTimecard.show.apply($);
                    }
                } else {
                    $.activityIndicator.setMessage("Unable to save your punch.\nPlease press start over,\nand try again.");
                    $.activityIndicator.hide();
                }
            }
            function changeColor(e) {
                "touchstart" === e.type ? e.source.setBackgroundColor("#34aadc") : e.source.setBackgroundColor("#62bb47");
            }
            function destroy() {
                CloudClock.sound && CloudClock.sound.stop();
                $.clockIn_confirmation.removeEventListener("touchstart", restartTimeout);
                $.clockIn_confirmation.removeEventListener("close", destroy);
                $.exit.removeEventListener("click", exitClick);
                $.exit.removeEventListener("doubletap", emptyFn);
                $.yesAcceptPunch.removeEventListener("click", acceptAndExit);
                $.yesAcceptPunch.removeEventListener("touchstart", changeColor);
                $.yesAcceptPunch.removeEventListener("touchend", changeColor);
                $.yesAcceptPunch.removeEventListener("doubletap", emptyFn);
                if (_.isObject($.yesAndViewHours)) {
                    $.yesAndViewHours.removeEventListener("click", acceptAndViewTimecard);
                    $.yesAndViewHours.removeEventListener("touchstart", changeColor);
                    $.yesAndViewHours.removeEventListener("touchend", changeColor);
                    $.yesAndViewHours.removeEventListener("doubletap", emptyFn);
                }
                console.log("\n\n\nDestroying the confirmation screen!");
                $.destroy();
                $.clockIn_confirmation.removeAllChildren();
                sessionObj = null;
                $ = null;
                console.log("\n\n\nConfirmation screen destroyed: " + JSON.stringify($));
            }
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "clockIn_confirmation", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function addEvents() {
                $.clockIn_confirmation.addEventListener("close", destroy);
                $.clockIn_confirmation.addEventListener("open", function() {
                    restartTimeout();
                    Alloy.Collections.deviceHelp.audioPlayer.play();
                });
                $.clockIn_confirmation.addEventListener("touchstart", restartTimeout);
                $.exit.addEventListener("click", exitClick);
                $.exit.addEventListener("doubletap", emptyFn);
                $.yesAcceptPunch.addEventListener("click", acceptAndExit);
                $.yesAcceptPunch.addEventListener("touchstart", changeColor);
                $.yesAcceptPunch.addEventListener("touchend", changeColor);
                $.yesAcceptPunch.addEventListener("doubletap", emptyFn);
                $.yesAndViewHours.addEventListener("click", acceptAndViewTimecard);
                $.yesAndViewHours.addEventListener("touchstart", changeColor);
                $.yesAndViewHours.addEventListener("touchend", changeColor);
                $.yesAndViewHours.addEventListener("doubletap", emptyFn);
            }
            function updateUI(now, employee, currentPunch) {
                try {
                    $.reviewText.setText(CloudClock.customL.strings("review_Text"));
                    $.masterPhotoLbl.setText(CloudClock.customL.strings("master_photo"));
                    $.reviewPicLabel.setText(CloudClock.customL.strings("punch_photo"));
                    $.acceptPunchText.setText(CloudClock.customL.strings("in_punch_accept"));
                    $.yesAcceptPunch.setText(CloudClock.customL.strings("yes_accept"));
                    $.yesAndViewHours.setText(CloudClock.customL.strings("yes_view_hours"));
                    $.exit.setText(CloudClock.customL.strings("no_exit"));
                    $.nameAndPin.setText(employee.get("name").replace(/\s*$/, "") + " (" + employee.get("badge") + ")");
                    $.pin.setText(CloudClock.customL.strings("pin") + Ti.App.Properties.getString("PINFORSHOW"));
                    var punchTime = moment(currentPunch.transDateTime);
                    $.date.setText(CloudClock.customL.strings("date") + punchTime.format("dddd[, ] MMMM D"));
                    "O" === currentPunch.transType ? $.clockInTime.setText(CloudClock.customL.strings("clock_out_time") + punchTime.format("h:mm a")) : $.clockInTime.setText(CloudClock.customL.strings("clock_in_time") + punchTime.format("h:mm a"));
                    var departmentName = Alloy.Collections.departments.where({
                        departmentNum: currentPunch.departmentNum
                    });
                    $.departmentName.text = 0 !== departmentName.length ? "Dept: " + departmentName[0].get("name") : CloudClock.customL.strings("openDept_deptNotFound");
                    if (0 === employee.get("badge") || "0" === Ti.App.Properties.getString("ALLOWVIEW")) {
                        $.acceptPunchButtons.remove($.yesAndViewHours);
                        $.yesAndViewHours = null;
                        $.yesAcceptPunch.width = "310dp";
                        $.yesAcceptPunch.left = "34.5%";
                    }
                    if ("1" === Ti.App.Properties.getString("CAPTUREPHOTO")) {
                        if (currentPunch.photoData) {
                            var decodedFace = Ti.Utils.base64decode(sessionObj.currentPunch.photoData);
                            var properties = Object.getOwnPropertyNames(decodedFace);
                            for (var i = 0; properties.length > i; i++) console.log("Property: " + properties[i] + "\nValue: " + decodedFace[properties[i]]);
                            $.punchPhoto.image = decodedFace;
                        } else $.punchPhoto.setImage("images/icons/no-photo-256-gray.png");
                        0 === employee.get("photoFileName").indexOf("/images/icons/") ? $.masterPhoto.setImage(employee.get("photoFileName")) : CloudClock.getLocalPhoto($.masterPhoto, employee.get("photoFileName"));
                    } else {
                        $.punchPhotoWrap.visible = false;
                        $.masterPhotoWrap.visible = false;
                        $.reviewRight.hide();
                    }
                    "O" === sessionObj.currentPunch.transType && $.acceptPunchText.applyProperties({
                        text: CloudClock.customL.strings("out_punch_accept")
                    });
                } catch (error) {
                    console.log("\n\nError in the updateUI fn: " + JSON.stringify(error));
                    CloudClock.error(error);
                }
            }
            function updateHelp() {
                $.header.helpButton.show();
                $.header.helpButton.employeeLang = Ti.App.Properties.getString("CURRLANGUAGETYPE");
                $.header.helpButton.viewNo = "1900";
            }
            var now = CloudClock.moment();
            sessionObj = CloudClock.sessionObj;
            $.punchAcceppted = false;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1601";
            addEvents();
            updateHelp();
            updateUI(now, sessionObj.employee, sessionObj.currentPunch);
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;