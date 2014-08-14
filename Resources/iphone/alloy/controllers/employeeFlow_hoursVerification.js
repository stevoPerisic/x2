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
    this.__controllerPath = "employeeFlow_hoursVerification";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.hoursVerification = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "hoursVerification"
    });
    $.__views.hoursVerification && $.addTopLevelView($.__views.hoursVerification);
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
    $.__views.hoursVerification.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.hoursVerification
    });
    $.__views.header.setParent($.__views.hoursVerification);
    $.__views.timecardDetail = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        top: "8%",
        id: "timecardDetail"
    });
    $.__views.hoursVerification.add($.__views.timecardDetail);
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
    $.__views.__alloyId13 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/back-32-blue.png",
        id: "__alloyId13"
    });
    $.__views.back.add($.__views.__alloyId13);
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
        left: "30%",
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
    $.__views.__alloyId14 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/print-24.png",
        id: "__alloyId14"
    });
    $.__views.print.add($.__views.__alloyId14);
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
    $.__views.__alloyId15 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/text-message-24.png",
        id: "__alloyId15"
    });
    $.__views.text.add($.__views.__alloyId15);
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
    $.__views.__alloyId16 = Ti.UI.createImageView({
        top: "10dp",
        left: "10dp",
        width: "24dp",
        height: "24dp",
        image: "/images/icons/1395344760_icon-ios7-email.png",
        id: "__alloyId16"
    });
    $.__views.email.add($.__views.__alloyId16);
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
        left: "5%",
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
    $.__views.noNetwork = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        id: "noNetwork"
    });
    $.__views.tableLeftContainer.add($.__views.noNetwork);
    $.__views.tableHeaderWrap = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "64dp",
        id: "tableHeaderWrap"
    });
    $.__views.tableLeftContainer.add($.__views.tableHeaderWrap);
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
    $.__views.tableHeaderWrap.add($.__views.weeklySummLbl);
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
    $.__views.tableHeaderWrap.add($.__views.moreDetails);
    var __alloyId17 = [];
    $.__views.weeklySum = Ti.UI.createTableViewSection({
        left: 0,
        width: "100%",
        id: "weeklySum"
    });
    __alloyId17.push($.__views.weeklySum);
    $.__views.tableWeeklySum = Ti.UI.createTableView({
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "44dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "88dp",
        data: __alloyId17,
        id: "tableWeeklySum"
    });
    $.__views.tableLeftContainer.add($.__views.tableWeeklySum);
    $.__views.reviewLeft = Ti.UI.createView({
        top: 0,
        left: "5%",
        width: "50%",
        layout: "vertical",
        id: "reviewLeft"
    });
    $.__views.tableHolder.add($.__views.reviewLeft);
    $.__views.photoReview = Ti.UI.createView({
        top: "10dp",
        height: "180dp",
        width: "100%",
        layout: "horizontal",
        id: "photoReview"
    });
    $.__views.reviewLeft.add($.__views.photoReview);
    $.__views.punchPhotoWrap = Ti.UI.createView({
        top: 0,
        width: "180dp",
        height: "180dp",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ff9500",
        left: 0,
        right: "10%",
        id: "punchPhotoWrap"
    });
    $.__views.photoReview.add($.__views.punchPhotoWrap);
    $.__views.punchPhoto = Ti.UI.createImageView({
        top: 0,
        width: "100%",
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
        top: 0,
        width: "180dp",
        height: "180dp",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#34aadc",
        id: "masterPhotoWrap"
    });
    $.__views.photoReview.add($.__views.masterPhotoWrap);
    $.__views.masterPhoto = Ti.UI.createImageView({
        top: 0,
        width: "100%",
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
    $.__views.nameAndPin = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "nameAndPin"
    });
    $.__views.reviewLeft.add($.__views.nameAndPin);
    $.__views.pin = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "pin"
    });
    $.__views.reviewLeft.add($.__views.pin);
    $.__views.departmentName = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "departmentName"
    });
    $.__views.reviewLeft.add($.__views.departmentName);
    $.__views.date = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "date"
    });
    $.__views.reviewLeft.add($.__views.date);
    $.__views.clockInTime = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "36dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#ff9500",
        top: "20dp",
        height: "30dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "clockInTime"
    });
    $.__views.reviewLeft.add($.__views.clockInTime);
    $.__views.immediatePunchConfirmation = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "20dp",
        height: "60dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        wordWrap: true,
        id: "immediatePunchConfirmation"
    });
    $.__views.reviewLeft.add($.__views.immediatePunchConfirmation);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    (function() {
        function emptyFn(e) {
            $[e.source.id].removeEventListener("doubletap", emptyFn);
            return false;
        }
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeFlow", "hoursVerification", $.header.exit);
            CloudClock.clock.showEmployeeFlowDialog = true;
        }
        function setText() {
            $.backBtnLbl.setText(CloudClock.customL.strings("back_btn"));
            $.previousWeekLbl.setText(CloudClock.customL.strings("previous"));
            $.nextWeekLbl.setText(CloudClock.customL.strings("next"));
            $.header.exitLbl.setText(CloudClock.customL.strings("done"));
            $.weeklySummLbl.setText(CloudClock.customL.strings("weekly_summ"));
            $.moreDetails.setText(CloudClock.customL.strings("more_details"));
        }
        function updateUI() {
            $.back.hide();
            if (true === Ti.Network.online) {
                $.activityIndicator.show();
                timecard.viewDetails();
                $.timecardDetail.setVisible(false);
                $.printLbl.setText(CloudClock.customL.strings("print"));
                $.smsLbl.setText(CloudClock.customL.strings("sms"));
                $.emailLbl.setText(CloudClock.customL.strings("email"));
            } else {
                $.noNetwork.setText(CloudClock.customL.strings("error_lbl_3"));
                $.tableHeaderWrap.hide();
                $.tableWeeklySum.hide();
                $.weekNavBtns.hide();
                $.commIconsWrap.hide();
            }
            setText();
            var parm = CloudClock.getAppParameters();
            $.email.setVisible(parm.isEmailAllowed);
            $.text.setVisible(parm.isTextAllowed);
            $.print.setVisible(parm.isPrintAllowed);
            $.masterPhotoLbl.setText(CloudClock.customL.strings("master_photo"));
            $.reviewPicLabel.setText(CloudClock.customL.strings("punch_photo"));
            var CAPTUREPHOTO = Ti.App.Properties.getString("CAPTUREPHOTO");
            if ("1" === CAPTUREPHOTO) {
                if (sessionObj.currentPunch.photoData) {
                    var decodedFace = Ti.Utils.base64decode(sessionObj.currentPunch.photoData);
                    var properties = Object.getOwnPropertyNames(decodedFace);
                    for (var i = 0; properties.length > i; i++) console.log("Property: " + properties[i] + "\nValue: " + decodedFace[properties[i]]);
                    $.punchPhoto.image = decodedFace;
                } else $.punchPhoto.setImage("images/icons/no-photo-256-gray.png");
                0 === sessionObj.employee.get("photoFileName").indexOf("/images/icons/") ? $.masterPhoto.setImage(sessionObj.employee.get("photoFileName")) : CloudClock.getLocalPhoto($.masterPhoto, sessionObj.employee.get("photoFileName"));
            } else $.reviewLeft.remove($.photoReview);
            $.nameAndPin.setText(sessionObj.employee.get("name").replace(/\s*$/, "") + " (" + sessionObj.employee.get("badge") + ")");
            $.pin.setText(CloudClock.customL.strings("pin") + Ti.App.Properties.getString("PINFORSHOW"));
            var punchTime = moment(sessionObj.currentPunch.transDateTime);
            $.date.setText(CloudClock.customL.strings("date") + punchTime.format("dddd[, ] MMMM D"));
            var minutes = 0;
            var clockInOutString = "";
            var timeString = function(minutes) {
                var timeString = (minutes - minutes % 60) / 60 + ":" + minutes % 60;
                var displayTime = sessionObj.currentPunch.overrideFlag ? clockInOutString + punchTime.format("h:mm a") : clockInOutString + moment(timeString, "h:mm").format("h:mm a");
                return displayTime;
            };
            if ("O" === sessionObj.currentPunch.transType) {
                minutes = sessionObj.shift[0].get("shiftEnd");
                clockInOutString = CloudClock.customL.strings("clock_out_time");
            } else {
                minutes = sessionObj.shift[0].get("shiftStart");
                clockInOutString = CloudClock.customL.strings("clock_in_time");
            }
            $.clockInTime.setText(timeString(minutes));
            var departmentName = Alloy.Collections.departments.where({
                departmentNum: sessionObj.currentPunch.departmentNum
            });
            $.departmentName.text = 0 !== departmentName.length ? "Dept: " + departmentName[0].get("name") : CloudClock.customL.strings("openDept_deptNotFound");
        }
        function goBack() {
            if (CloudClock.APIcallInProgress) return false;
            $.back.removeEventListener("click", goBack);
            $.timecardWrap.remove($.timecardWrap.children[2]);
            timecard.viewDetails();
            $.timecardWrapHeader.show();
            $.timecardDetail.show();
            $.tableHolder.show();
            $.weekNavBtns.visible = true;
            $.back.hide();
            $.back.addEventListener("click", goBack);
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1600";
            Alloy.Collections.deviceHelp.audioPlayer.play();
        }
        function destroy() {
            sessionObj.employee.id && sessionObj.clearSession();
            $.hoursVerification.removeEventListener("touchstart", restartTimeout);
            $.hoursVerification.removeEventListener("close", destroy);
            CloudClock.clock.showEmployeeFlowDialog = false;
        }
        function moreDetailsClick() {
            restartTimeout();
            if (CloudClock.APIcallInProgress) return false;
            $.moreDetails.removeEventListener("click", moreDetailsClick);
            $.activityIndicator.show();
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
        function addEventListeners() {
            $.hoursVerification.addEventListener("close", destroy);
            $.hoursVerification.addEventListener("open", function() {
                restartTimeout();
                Alloy.Collections.deviceHelp.audioPlayer.play();
                if (CloudClock.flashConfirmation) if ("error" === CloudClock.flashConfirmation) {
                    $.immediatePunchConfirmation.color = "#ff2d55";
                    $.immediatePunchConfirmation.setText(CloudClock.customL.strings("immediatePunchFail"));
                } else {
                    $.immediatePunchConfirmation.color = "#62bb47";
                    $.immediatePunchConfirmation.setText(CloudClock.customL.strings("immediatePunchSuccess"));
                }
            });
            $.hoursVerification.addEventListener("touchstart", restartTimeout);
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
            var sessionObj = CloudClock.sessionObj;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1600";
            $.week = 0;
            $.weekEnding = true;
            $.restartTimeout = restartTimeout;
            $.nextWeek.enabled = false;
            $.previousWeek.week = 1;
            $.nextWeek.week = 0;
            var timecard = require("timecard");
            true === Ti.Network.online && timecard.init($);
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