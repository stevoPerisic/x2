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
    this.__controllerPath = "employeeOptions_notifications";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.notifications = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "notifications"
    });
    $.__views.notifications && $.addTopLevelView($.__views.notifications);
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
    $.__views.notifications.add($.__views.contentHeader);
    $.__views.notifications_header = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "notifications_header"
    });
    $.__views.contentHeader.add($.__views.notifications_header);
    $.__views.notificationsSettingsTblWrap = Ti.UI.createView({
        top: "80dp",
        width: "90%",
        layout: "vertical",
        id: "notificationsSettingsTblWrap"
    });
    $.__views.notifications.add($.__views.notificationsSettingsTblWrap);
    $.__views.deliveryPref = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "10dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "deliveryPref"
    });
    $.__views.notificationsSettingsTblWrap.add($.__views.deliveryPref);
    var __alloyId30 = [];
    $.__views.Email = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "Email"
    });
    __alloyId30.push($.__views.Email);
    $.__views.EmailLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "EmailLbl"
    });
    $.__views.Email.add($.__views.EmailLbl);
    $.__views.Text = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "Text"
    });
    __alloyId30.push($.__views.Text);
    $.__views.TextLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "TextLbl"
    });
    $.__views.Text.add($.__views.TextLbl);
    $.__views.both = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "both"
    });
    __alloyId30.push($.__views.both);
    $.__views.bothLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "bothLbl"
    });
    $.__views.both.add($.__views.bothLbl);
    $.__views.notifType = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "144dp",
        data: __alloyId30,
        id: "notifType"
    });
    $.__views.notificationsSettingsTblWrap.add($.__views.notifType);
    $.__views.deliveryDay = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "10dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "deliveryDay"
    });
    $.__views.notificationsSettingsTblWrap.add($.__views.deliveryDay);
    var __alloyId31 = [];
    $.__views.sunday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "sunday"
    });
    __alloyId31.push($.__views.sunday);
    $.__views.sundayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "sundayLbl"
    });
    $.__views.sunday.add($.__views.sundayLbl);
    $.__views.monday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "monday"
    });
    __alloyId31.push($.__views.monday);
    $.__views.mondayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "mondayLbl"
    });
    $.__views.monday.add($.__views.mondayLbl);
    $.__views.tuesday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "tuesday"
    });
    __alloyId31.push($.__views.tuesday);
    $.__views.tuesdayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "tuesdayLbl"
    });
    $.__views.tuesday.add($.__views.tuesdayLbl);
    $.__views.wednesday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "wednesday"
    });
    __alloyId31.push($.__views.wednesday);
    $.__views.wednesdayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "wednesdayLbl"
    });
    $.__views.wednesday.add($.__views.wednesdayLbl);
    $.__views.thursday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "thursday"
    });
    __alloyId31.push($.__views.thursday);
    $.__views.thursdayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "thursdayLbl"
    });
    $.__views.thursday.add($.__views.thursdayLbl);
    $.__views.friday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "friday"
    });
    __alloyId31.push($.__views.friday);
    $.__views.fridayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "fridayLbl"
    });
    $.__views.friday.add($.__views.fridayLbl);
    $.__views.saturday = Ti.UI.createTableViewRow({
        backgroundFocusedColor: "#fff",
        backgroundImage: "none",
        bacgroundSelectedColor: "#fff",
        selectedBackgroundColor: "#34AADC",
        focusedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "saturday"
    });
    __alloyId31.push($.__views.saturday);
    $.__views.saturdayLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "saturdayLbl"
    });
    $.__views.saturday.add($.__views.saturdayLbl);
    $.__views.notifDay = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "336dp",
        data: __alloyId31,
        id: "notifDay"
    });
    $.__views.notificationsSettingsTblWrap.add($.__views.notifDay);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeOptions", "employeeOptions", CloudClock.employeeOptions.header.exit);
            CloudClock.clock.showEmployeeOptionsDialog = true;
        }
        function changeNotifType(e) {
            try {
                $.notifType.removeEventListener("click", changeNotifType);
                restartTimeout();
                $[type] && $[type].remove(typeChckMark);
                type = e.source.id;
                $[type].add(typeChckMark);
                setNotificationPrefs_cfg.params.type = e.source.id;
                if (setNotificationPrefs_cfg.params.time) {
                    CloudClock.employeeOptions.activityIndicator.show();
                    setNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    CloudClock.api.request(setNotificationPrefs_cfg);
                }
                $.notifType.addEventListener("click", changeNotifType);
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function changeNotifDay(e) {
            try {
                $.notifDay.removeEventListener("click", changeNotifDay);
                restartTimeout();
                $[day] && $[day].remove(dayChckMark);
                day = e.source.id;
                $[day].add(dayChckMark);
                $[day].applyProperties({
                    font: {
                        fontSize: "18dp",
                        fontWeight: "bold"
                    }
                });
                var paramsDay = day.substr(0, 3);
                setNotificationPrefs_cfg.params[paramsDay] = 1;
                setNotificationPrefs_cfg.params.time = "0900";
                if (setNotificationPrefs_cfg.params.time) {
                    CloudClock.employeeOptions.activityIndicator.show();
                    setNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    CloudClock.api.request(setNotificationPrefs_cfg);
                }
                $.notifDay.addEventListener("click", changeNotifDay);
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function setLanguage() {
            $.notifications_header.setText(CloudClock.customL.strings("notifications_header"));
            $.deliveryPref.setText(CloudClock.customL.strings("delivery_prefs"));
            $.deliveryDay.setText(CloudClock.customL.strings("delivery_day"));
            $.EmailLbl.setText(CloudClock.customL.strings("sett_name_email"));
            $.TextLbl.setText(CloudClock.customL.strings("notif_text"));
            $.bothLbl.setText(CloudClock.customL.strings("notif_both"));
            $.sundayLbl.setText(CloudClock.customL.strings("sunday"));
            $.mondayLbl.setText(CloudClock.customL.strings("monday"));
            $.tuesdayLbl.setText(CloudClock.customL.strings("tuesday"));
            $.wednesdayLbl.setText(CloudClock.customL.strings("wednesday"));
            $.thursdayLbl.setText(CloudClock.customL.strings("thursday"));
            $.fridayLbl.setText(CloudClock.customL.strings("friday"));
            $.saturdayLbl.setText(CloudClock.customL.strings("saturday"));
        }
        function updateUI() {
            setLanguage();
        }
        function addEventListeners() {
            $.notifType.addEventListener("click", changeNotifType);
            $.notifDay.addEventListener("click", changeNotifDay);
        }
        try {
            var employee = CloudClock.sessionObj.employee;
            var chckMarkParams = {
                image: "/images/icons/1_navigation_accept_blk.png",
                width: "33dp",
                height: "33dp",
                right: "15dp"
            };
            var typeChckMark = Ti.UI.createImageView(chckMarkParams);
            var dayChckMark = Ti.UI.createImageView(chckMarkParams);
            var type;
            var day;
            var params = {
                badge: employee.get("badge")
            };
            var getNotificationPrefs_cfg = {
                endpoint: "getSchedule",
                params: params,
                onSuccess: function(response) {
                    _.each(response, function(item, key) {
                        if (1 === item) {
                            day = key;
                            $[day] && $[day].add(dayChckMark);
                        }
                    });
                    type = response.type;
                    $[type] && $[type].add(typeChckMark);
                    null !== CloudClock.employeeOptions && CloudClock.employeeOptions.activityIndicator.hide();
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error getting notification pref.: " + JSON.stringify(response));
                    null !== CloudClock.employeeOptions && CloudClock.employeeOptions.activityIndicator.hide();
                }
            };
            var setNotificationPrefs_cfg = {
                endpoint: "updateSchedule",
                params: params,
                onSuccess: function() {
                    null !== CloudClock.employeeOptions && CloudClock.employeeOptions.activityIndicator.hide();
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error setting notification pref.: " + JSON.stringify(response));
                    null !== CloudClock.employeeOptions && CloudClock.employeeOptions.activityIndicator.hide();
                }
            };
            updateUI();
            addEventListeners();
            CloudClock.employeeOptions.activityIndicator.show();
            getNotificationPrefs_cfg.params.termID = Ti.App.Properties.getString("TERMID");
            CloudClock.api.request(getNotificationPrefs_cfg);
            restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;