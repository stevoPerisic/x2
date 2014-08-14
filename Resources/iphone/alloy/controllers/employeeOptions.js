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
    this.__controllerPath = "employeeOptions";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.employeeOptions = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: false,
        navBarHidden: false,
        statusBarStyle: Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
        top: 20,
        id: "employeeOptions"
    });
    $.__views.employeeOptions && $.addTopLevelView($.__views.employeeOptions);
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
    $.__views.employeeOptions.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.employeeOptions
    });
    $.__views.header.setParent($.__views.employeeOptions);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.employeeOptions.add($.__views.content);
    $.__views.sidebar = Ti.UI.createView({
        left: 0,
        width: "30%",
        layout: "vertical",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        backgroundColor: "#f2f2f2",
        id: "sidebar"
    });
    $.__views.content.add($.__views.sidebar);
    $.__views.sidebarHeader = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        top: -1,
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
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "sidebarHeader"
    });
    $.__views.sidebar.add($.__views.sidebarHeader);
    $.__views.sideBarMenu = Ti.UI.createView({
        top: 0,
        width: "100%",
        layout: "vertical",
        id: "sideBarMenu"
    });
    $.__views.sidebar.add($.__views.sideBarMenu);
    $.__views.timesheets = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#00a6d5",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "timesheets",
        classes: [ "employeeOptionsSidemenu", "active" ],
        viewToLoad: "employeeOptions_timecardDetail"
    });
    $.__views.sideBarMenu.add($.__views.timesheets);
    $.__views.__alloyId23 = Ti.UI.createImageView({
        left: "10dp",
        image: "/images/icons/timesheets-32-white.png",
        id: "__alloyId23"
    });
    $.__views.timesheets.add($.__views.__alloyId23);
    $.__views.timesheetsLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        left: "50dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        backgroundColor: "#00a6d5",
        apiName: "Ti.UI.Label",
        id: "timesheetsLbl",
        classes: [ "employeeOptionsSidemenuLabel", "activeLbl" ]
    });
    $.__views.timesheets.add($.__views.timesheetsLbl);
    $.__views.notifications = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "notifications",
        classes: [ "employeeOptionsSidemenu" ],
        viewToLoad: "employeeOptions_notifications"
    });
    $.__views.sideBarMenu.add($.__views.notifications);
    $.__views.__alloyId24 = Ti.UI.createImageView({
        left: "10dp",
        image: "/images/icons/notifications-32-blk.png",
        id: "__alloyId24"
    });
    $.__views.notifications.add($.__views.__alloyId24);
    $.__views.notificationsLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "50dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        apiName: "Ti.UI.Label",
        id: "notificationsLbl",
        classes: [ "employeeOptionsSidemenuLabel" ]
    });
    $.__views.notifications.add($.__views.notificationsLbl);
    $.__views.settings = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "settings",
        classes: [ "employeeOptionsSidemenu" ],
        viewToLoad: "employeeOptions_generalSettings"
    });
    $.__views.sideBarMenu.add($.__views.settings);
    $.__views.__alloyId25 = Ti.UI.createImageView({
        left: "10dp",
        image: "/images/icons/settings-32-blk.png",
        id: "__alloyId25"
    });
    $.__views.settings.add($.__views.__alloyId25);
    $.__views.generalSettingsLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "50dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        apiName: "Ti.UI.Label",
        id: "generalSettingsLbl",
        classes: [ "employeeOptionsSidemenuLabel" ]
    });
    $.__views.settings.add($.__views.generalSettingsLbl);
    $.__views.optionsContent = Ti.UI.createView({
        left: "30%",
        width: "70%",
        id: "optionsContent"
    });
    $.__views.content.add($.__views.optionsContent);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function setLanguage() {
            $.employeeOptions.removeEventListener("changeLang", setLanguage);
            $.sidebarHeader.setText(CloudClock.customL.strings("emplOpts_sidebarHeader"));
            $.timesheetsLbl.setText(CloudClock.customL.strings("timesheets"));
            $.notificationsLbl.setText(CloudClock.customL.strings("notifications"));
            $.generalSettingsLbl.setText(CloudClock.customL.strings("genSettings"));
        }
        function updateUI() {
            setLanguage();
            CloudClock.employeeOptions.header.helpButton.hide();
            CloudClock.dispatcher.route("employeeOptions", "optionsContent", "employeeOptions_timecardDetail", false, {
                location: "employeeOptions"
            });
            CloudClock.sideMenu.init("employeeOptions", "optionsContent", $.sideBarMenu.getChildren(), "timecardDetail", {
                location: "employeeOptions"
            });
        }
        function destroy() {
            $.employeeOptions.removeEventListener("close", destroy);
            $.timecard.gc();
            $.destroy();
            $ = null;
            CloudClock.employeeOptions.destroy();
            CloudClock.employeeOptions = null;
        }
        function addEventListeners() {
            $.employeeOptions.addEventListener("close", destroy);
            $.employeeOptions.addEventListener("changeLang", setLanguage);
            $.employeeOptions.addEventListener("open", function() {
                if (false === Ti.Network.online) {
                    $.noNetworkEmplOpts = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("noNetworkEmplOpts"),
                        callback: {
                            eType: "click",
                            action: function() {
                                $.noNetworkEmplOpts.hide.apply($);
                                Alloy.createController("index", {
                                    doNotSetParams: true
                                });
                                $.employeeOptions.close();
                            }
                        }
                    });
                    CloudClock.employeeOptions.activityIndicator.hide();
                    $.noNetworkEmplOpts.show.apply($);
                }
            });
        }
        try {
            exports.setLanguage = function() {
                setLanguage();
            };
            $.timecard = require("timecard");
            CloudClock.employeeOptions = $;
            CloudClock.screenTimeout._context = $;
            CloudClock.sessionObj.employee;
            updateUI();
            addEventListeners();
            $.employeeOptions.open();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;