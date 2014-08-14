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
    this.__controllerPath = "managerOptions";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.managerOptions = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: false,
        navBarHidden: false,
        statusBarStyle: Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
        top: 20,
        id: "managerOptions"
    });
    $.__views.managerOptions && $.addTopLevelView($.__views.managerOptions);
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
    $.__views.managerOptions.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.managerOptions
    });
    $.__views.header.setParent($.__views.managerOptions);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.managerOptions.add($.__views.content);
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
        id: "sidebarHeader",
        text: "Manager Options"
    });
    $.__views.sidebar.add($.__views.sidebarHeader);
    $.__views.sideBarMenu = Ti.UI.createView({
        top: 0,
        width: "100%",
        layout: "vertical",
        id: "sideBarMenu"
    });
    $.__views.sidebar.add($.__views.sideBarMenu);
    $.__views.settings = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#00a6d5",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "settings",
        classes: [ "managerOptionsSidemenu", "active" ],
        viewToLoad: "managerOptions_settings"
    });
    $.__views.sideBarMenu.add($.__views.settings);
    $.__views.__alloyId51 = Ti.UI.createImageView({
        left: "10dp",
        width: "32dp",
        image: "/images/icons/settings-32-white.png",
        id: "__alloyId51"
    });
    $.__views.settings.add($.__views.__alloyId51);
    $.__views.settingsLbl = Ti.UI.createLabel({
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
        id: "settingsLbl",
        classes: [ "managerOptionsSidemenuLabel", "activeLbl" ],
        text: "Clock Settings"
    });
    $.__views.settings.add($.__views.settingsLbl);
    $.__views.people = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "people",
        classes: [ "managerOptionsSidemenu" ],
        viewToLoad: "managerOptions_people"
    });
    $.__views.sideBarMenu.add($.__views.people);
    $.__views.__alloyId52 = Ti.UI.createImageView({
        left: "10dp",
        width: "32dp",
        image: "/images/icons/people-32-blk.png",
        id: "__alloyId52"
    });
    $.__views.people.add($.__views.__alloyId52);
    $.__views.peopleLbl = Ti.UI.createLabel({
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
        id: "peopleLbl",
        classes: [ "managerOptionsSidemenuLabel" ],
        text: "People"
    });
    $.__views.people.add($.__views.peopleLbl);
    $.__views.departments = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "departments",
        classes: [ "managerOptionsSidemenu" ],
        viewToLoad: "managerOptions_departments"
    });
    $.__views.sideBarMenu.add($.__views.departments);
    $.__views.__alloyId53 = Ti.UI.createImageView({
        left: "10dp",
        width: "32dp",
        image: "/images/icons/departments-32-blk.png",
        id: "__alloyId53"
    });
    $.__views.departments.add($.__views.__alloyId53);
    $.__views.departmentsLbl = Ti.UI.createLabel({
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
        id: "departmentsLbl",
        classes: [ "managerOptionsSidemenuLabel" ],
        text: "Departments"
    });
    $.__views.departments.add($.__views.departmentsLbl);
    $.__views.employees = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "employees",
        classes: [ "managerOptionsSidemenu" ],
        viewToLoad: "managerOptions_employees"
    });
    $.__views.sideBarMenu.add($.__views.employees);
    $.__views.__alloyId54 = Ti.UI.createImageView({
        left: "10dp",
        width: "32dp",
        image: "/images/icons/employees-32-blk.png",
        id: "__alloyId54"
    });
    $.__views.employees.add($.__views.__alloyId54);
    $.__views.employeesLbl = Ti.UI.createLabel({
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
        id: "employeesLbl",
        classes: [ "managerOptionsSidemenuLabel" ],
        text: "Employees"
    });
    $.__views.employees.add($.__views.employeesLbl);
    $.__views.reports = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: "60dp",
        backgroundColor: "#fff",
        borderWidth: "1dp",
        borderColor: "#e4e4e4",
        apiName: "Ti.UI.View",
        id: "reports",
        classes: [ "managerOptionsSidemenu" ],
        viewToLoad: "managerOptions_reports"
    });
    $.__views.sideBarMenu.add($.__views.reports);
    $.__views.__alloyId55 = Ti.UI.createImageView({
        left: "10dp",
        width: "32dp",
        image: "/images/icons/reports-32-blk.png",
        id: "__alloyId55"
    });
    $.__views.reports.add($.__views.__alloyId55);
    $.__views.reportsLbl = Ti.UI.createLabel({
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
        id: "reportsLbl",
        classes: [ "managerOptionsSidemenuLabel" ],
        text: "Reports"
    });
    $.__views.reports.add($.__views.reportsLbl);
    $.__views.managerOptionsContent = Ti.UI.createView({
        left: "30%",
        width: "70%",
        id: "managerOptionsContent"
    });
    $.__views.content.add($.__views.managerOptionsContent);
    $.__views.footer = Alloy.createController("footer", {
        id: "footer",
        __parentSymbol: $.__views.managerOptions
    });
    $.__views.footer.setParent($.__views.managerOptions);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    (function() {
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("managerOptions", "managerOptions", $.header.exit);
            CloudClock.clock.showManagerOptionsDialog = true;
        }
        function destroy() {
            var reInitialize = CloudClock.managerOptions.reIntialize;
            $.managerOptions.removeEventListener("close", destroy);
            $.destroy();
            $ = null;
            CloudClock.managerOptions.destroy();
            CloudClock.managerOptions = null;
            reInitialize && Alloy.createController("index", {
                reInit: reInitialize.reInit,
                terminalID: reInitialize.terminalID
            });
        }
        function updateUI_ForDebugMode() {
            var actualTimeSwitch = Ti.UI.createView({
                top: 0,
                left: 0,
                width: "280dp",
                height: "60dp",
                backgroundColor: "#fff",
                borderWidth: "1dp",
                borderColor: "#e4e4e4"
            });
            var chckMark = Ti.UI.createImageView({
                image: "/images/icons/1_navigation_accept_blk.png",
                height: "33dp",
                right: "15dp",
                left: "10dp",
                width: "32dp"
            });
            var actualTimeSwitchLbl = Ti.UI.createLabel({
                top: 0,
                left: "50dp",
                width: "230dp",
                height: "60dp",
                font: {
                    fontSize: "16dp",
                    fontWeight: "bold"
                },
                text: "Change Actual Time Switch",
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                on: "1" === Ti.App.Properties.getString("QAFLAG") ? true : false
            });
            "1" === Ti.App.Properties.getString("QAFLAG") && actualTimeSwitch.add(chckMark);
            actualTimeSwitch.add(actualTimeSwitchLbl);
            $.footer.footer.add(actualTimeSwitch);
            actualTimeSwitchLbl.addEventListener("click", function(e) {
                if (e.source.on) {
                    Ti.App.Properties.setString("QAFLAG", "0");
                    this.parent.remove(chckMark);
                    e.source.on = false;
                } else {
                    Ti.App.Properties.setString("QAFLAG", "1");
                    this.parent.add(chckMark);
                    e.source.on = true;
                }
            });
        }
        function updateUI() {
            $.header.helpButton.setVisible(false);
            $.footer.employeeOptions.setVisible(false);
            args.debugMode ? updateUI_ForDebugMode() : $.footer.hide();
        }
        function addEventListeners() {
            $.managerOptions.addEventListener("close", destroy);
        }
        try {
            CloudClock.managerOptions = $;
            CloudClock.managerOptions.restartTimeout = restartTimeout;
            CloudClock.screenTimeout._context = $;
            updateUI();
            addEventListeners();
            CloudClock.dispatcher.route("managerOptions", "managerOptionsContent", "managerOptions_settings", false, {
                test: "Test passing data."
            });
            CloudClock.sideMenu.init("managerOptions", "managerOptionsContent", $.sideBarMenu.getChildren(), "managerOptionsSettings");
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;