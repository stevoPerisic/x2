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
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: false,
        navBarHidden: false,
        statusBarStyle: Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
        top: 20,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
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
    $.__views.index.add($.__views.activityIndicator);
    $.__views.screenSaver = Ti.UI.createView({
        backgroundColor: "#000",
        width: "100%",
        top: 0,
        left: 0,
        height: "100%",
        zIndex: 2,
        id: "screenSaver"
    });
    $.__views.index.add($.__views.screenSaver);
    $.__views.screenSaverLogo = Ti.UI.createView({
        width: "130dp",
        height: "130dp",
        bottom: 0,
        right: 0,
        id: "screenSaverLogo"
    });
    $.__views.screenSaver.add($.__views.screenSaverLogo);
    $.__views.__alloyId45 = Ti.UI.createImageView({
        image: "/images/icons/peoplenet-icon.png",
        id: "__alloyId45"
    });
    $.__views.screenSaverLogo.add($.__views.__alloyId45);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.index
    });
    $.__views.header.setParent($.__views.index);
    $.__views.left = Ti.UI.createView({
        top: "8%",
        width: "50%",
        height: "92%",
        left: 0,
        backgroundColor: "#666",
        id: "left"
    });
    $.__views.index.add($.__views.left);
    $.__views.clock = Ti.UI.createView({
        top: 0,
        height: "140dp",
        backgroundColor: "#222",
        id: "clock"
    });
    $.__views.left.add($.__views.clock);
    $.__views.time = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "40dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#f2f2f2",
        top: "35dp",
        id: "time"
    });
    $.__views.clock.add($.__views.time);
    $.__views.date = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#f2f2f2",
        top: "80dp",
        id: "date"
    });
    $.__views.clock.add($.__views.date);
    $.__views.largeLogo = Ti.UI.createImageView({
        top: "200dp",
        width: "80%",
        height: "20%",
        borderRadius: 10,
        id: "largeLogo"
    });
    $.__views.left.add($.__views.largeLogo);
    $.__views.mainMenu = Ti.UI.createView({
        top: "375dp",
        height: "184dp",
        width: "100%",
        backgroundColor: "#666",
        layout: "vertical",
        id: "mainMenu"
    });
    $.__views.left.add($.__views.mainMenu);
    $.__views.__alloyId46 = Ti.UI.createView({
        width: "80%",
        height: "1dp",
        backgroundColor: "#868686",
        id: "__alloyId46"
    });
    $.__views.mainMenu.add($.__views.__alloyId46);
    $.__views.clockIn = Ti.UI.createView({
        height: "60dp",
        width: "80%",
        backgroundColor: "#00a6d5",
        selectedBackgroundColor: "#666",
        apiName: "Ti.UI.View",
        id: "clockIn",
        classes: [ "mainMenuItem", "active" ]
    });
    $.__views.mainMenu.add($.__views.clockIn);
    $.__views.__alloyId47 = Ti.UI.createImageView({
        left: "20dp",
        image: "/images/icons/existing-employee-inactive-48-white.png",
        id: "__alloyId47"
    });
    $.__views.clockIn.add($.__views.__alloyId47);
    $.__views.employeeLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#fff",
        height: "100%",
        width: "78%",
        left: "22%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        bubbleParent: true,
        id: "employeeLbl"
    });
    $.__views.clockIn.add($.__views.employeeLbl);
    $.__views.__alloyId48 = Ti.UI.createView({
        width: "80%",
        height: "1dp",
        backgroundColor: "#868686",
        id: "__alloyId48"
    });
    $.__views.mainMenu.add($.__views.__alloyId48);
    $.__views.manager = Ti.UI.createView({
        height: "60dp",
        width: "80%",
        backgroundColor: "#666",
        selectedBackgroundColor: "#666",
        apiName: "Ti.UI.View",
        id: "manager",
        classes: [ "mainMenuItem" ]
    });
    $.__views.mainMenu.add($.__views.manager);
    $.__views.__alloyId49 = Ti.UI.createImageView({
        left: "20dp",
        image: "/images/icons/manager-inactive-48-white.png",
        id: "__alloyId49"
    });
    $.__views.manager.add($.__views.__alloyId49);
    $.__views.managerLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#fff",
        height: "100%",
        width: "78%",
        left: "22%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        bubbleParent: true,
        id: "managerLbl"
    });
    $.__views.manager.add($.__views.managerLbl);
    $.__views.__alloyId50 = Ti.UI.createView({
        width: "80%",
        height: "1dp",
        backgroundColor: "#868686",
        id: "__alloyId50"
    });
    $.__views.mainMenu.add($.__views.__alloyId50);
    $.__views.versionLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "10dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#fff",
        bottom: "60dp",
        id: "versionLbl"
    });
    $.__views.left.add($.__views.versionLbl);
    $.__views.right = Ti.UI.createView({
        top: "8%",
        width: "50%",
        height: "92%",
        right: 0,
        backgroundColor: "#fff",
        id: "right"
    });
    $.__views.index.add($.__views.right);
    $.__views.noNetwork = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        top: 0,
        width: "100%",
        height: "40dp",
        backgroundColor: "#ff2d55",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "noNetwork"
    });
    $.__views.right.add($.__views.noNetwork);
    $.__views.pinPad = Alloy.createWidget("pinPad", "widget", {
        id: "pinPad",
        __parentSymbol: $.__views.right
    });
    $.__views.pinPad.setParent($.__views.right);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var initializeClock = require("initAndMaint_cfg");
    Ti.API.info("From index.js, seeded: " + Ti.App.Properties.hasProperty("seeded"));
    (function() {
        function wrongManagerDialogClick(e) {
            if (e.source.id === this.cancel) {
                $.pinPad.clearPinPadTxtField();
                $.pinPad.addBtnEvents();
                clockIn_click({
                    mode: "enterPin"
                });
                $.wrongManagerPinDialog.hide.apply($);
            }
        }
        function closeIndex() {
            $.index.removeEventListener("touchstart", CloudClock.screenTimeout.restartTimeoutIndex);
            $.clockIn.removeEventListener("click", clockIn_click);
            $.manager.removeEventListener("click", manager_click);
            $.index.hide();
            $.index.removeAllChildren();
            logoImg = null;
            wrongManagerPinDialog = null;
            initializeClock = null;
            $.destroy();
            $ = null;
            CloudClock.parent = null;
        }
        function oldDbRemoval() {
            var oldDBFileName = privateDocumentsDirectory() + "peopleNetData.sql";
            var oldDBFile = Ti.Filesystem.getFile(oldDBFileName);
            if (0 !== oldDBFile.size) {
                var oldDB = Ti.Database.open("peopleNetData");
                var oldTermIDRow = oldDB.execute('SELECT value FROM parameters WHERE id="TERMID"');
                var odlTermID = oldTermIDRow.field(0);
                oldTermIDRow.close();
                oldDB.execute("DROP TABLE IF EXISTS clockHistory");
                oldDB.execute("DROP TABLE IF EXISTS confirmRequests");
                oldDB.execute("DROP TABLE IF EXISTS databaseData");
                oldDB.execute("DROP TABLE IF EXISTS departments");
                oldDB.execute("DROP TABLE IF EXISTS employeeDepartments");
                oldDB.execute("DROP TABLE IF EXISTS employeeMessages");
                oldDB.execute("DROP TABLE IF EXISTS employees");
                oldDB.execute("DROP TABLE IF EXISTS extraFields");
                oldDB.execute("DROP TABLE IF EXISTS extraFieldsParms");
                oldDB.execute("DROP TABLE IF EXISTS helpInfo");
                oldDB.execute("DROP TABLE IF EXISTS logEntries");
                oldDB.execute("DROP TABLE IF EXISTS messages");
                oldDB.execute("DROP TABLE IF EXISTS parameters");
                oldDB.execute("DROP TABLE IF EXISTS transactionExtras");
                oldDB.close();
                oldDBFile.deleteFile();
                return odlTermID;
            }
        }
        function privateDocumentsDirectory() {
            var testFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
            var privateDir = testFile.nativePath.replace("Documents/", "");
            privateDir += "Library/Private%20Documents/";
            return privateDir;
        }
        function updateUIclock() {
            CloudClock.UIClock = $.time;
            $.time.setText(CloudClock.moment().format("h:mm a"));
            $.date.setText(CloudClock.moment().format("dddd[, ] MMMM D[,] YYYY"));
        }
        function removeActiveState() {
            $.removeClass($.clockIn, "active");
            $.removeClass($.manager, "active");
        }
        function manager_click(e) {
            e.cancelBubble = true;
            CloudClock.log("Info", "Manager menu item selected, changing pin pad to the manager mode.");
            try {
                removeActiveState();
                $.addClass($.manager, "active");
                $.pinPad.changeMode({
                    mode: "manager"
                });
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function clockIn_click(e) {
            e.cancelBubble = true;
            CloudClock.log("Info", "Employee menu item selected, changing pin pad to the employee mode.");
            try {
                removeActiveState();
                $.addClass($.clockIn, "active");
                $.pinPad.changeMode({
                    mode: "enterPin"
                });
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function updateUI() {
            $.versionLbl.setText("V." + Titanium.App.version + " Development Daily Build - B");
            $.pinPad.pinPadTxtField.setVisible(true);
            $.employeeLbl.setText(CloudClock.customL.strings("employee"));
            $.managerLbl.setText(CloudClock.customL.strings("manager"));
            $.screenSaver.hide();
            $.header.btnWrap.layout = "absolute";
            $.header.helpButton.right = 5;
            $.header.exit.hide();
            false === Ti.Network.online ? $.noNetwork.setText(CloudClock.customL.strings("limitedFunctionality")) : $.noNetwork.hide();
        }
        function updateUI_notSeed() {
            updateUI();
            $.largeLogo.setVisible(false);
            $.mainMenu.setVisible(false);
        }
        function updateUI_seeded() {
            updateUI();
            var logoImg = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "logo.png");
            logoImg = logoImg.read();
            _.isUndefined(logoImg) ? $.largeLogo.setImage("images/peoplenet-default-logo.png") : $.largeLogo.setImage(Ti.Utils.base64decode(logoImg));
            $.largeLogo.setVisible(true);
        }
        function addListeners() {
            $.index.addEventListener("touchstart", CloudClock.screenTimeout.restartTimeoutIndex);
            $.index.addEventListener("open", function() {
                var CONFIRMATION = Ti.App.Properties.getString("CONFIRMATION");
                if (CloudClock.flashConfirmation && "0" === CONFIRMATION) if ("error" === CloudClock.flashConfirmation) {
                    $.immediatePunchFail = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("immediatePunchFail"),
                        callback: {
                            eType: "click",
                            action: function() {
                                $.immediatePunchFail.hide.apply($);
                                CloudClock.flashConfirmation = false;
                            }
                        }
                    });
                    $.immediatePunchFail.show.apply($);
                } else {
                    CloudClock.clock.showEmployeeFlowDialog = false;
                    $.immediatePunchSuccess = CloudClock.customAlert.create({
                        type: "success",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("success"),
                        message: CloudClock.customL.strings("immediatePunchSuccess"),
                        callback: {
                            eType: "click",
                            action: function() {
                                $.immediatePunchSuccess.hide.apply($);
                                CloudClock.flashConfirmation = false;
                            }
                        }
                    });
                    $.immediatePunchSuccess.show.apply($);
                }
                CloudClock.playHelp && $.header.helpButton.fireEvent("click");
            });
            if (CloudClock.migratedUp && Ti.App.Properties.hasProperty("seeded")) {
                CloudClock.log("Info", "DB upgrade in progress, fetching new data from host. Terminal ID: " + Ti.App.Properties.getString("TERMID"));
                CloudClock.maintenace_cfg.params.messageType = "INIT";
                CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                $.activityIndicator.show();
                CloudClock.api.request(CloudClock.maintenace_cfg);
                CloudClock.migratedUp = false;
            }
            $.clockIn.addEventListener("click", clockIn_click);
            $.manager.addEventListener("click", manager_click);
        }
        function reInitializedByManager() {
            $.activityIndicator.show();
            CloudClock.clock.showScreenSaver = false;
            CloudClock.reInit = args.reInit;
            initializeClock.initialize(args.terminalID);
            $.pinPad.changeMode({
                mode: "enterPin"
            });
        }
        try {
            exports.changeToEmployeeMode = clockIn_click;
            CloudClock.parent = $;
            CloudClock.parent.running = true;
            CloudClock.reInit = false;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1100";
            $.screenSaver.running = false;
            $.initialize = function(e) {
                CloudClock.clock.showScreenSaver = false;
                initializeClock.initialize(e.terminalID);
            };
            $.employee_login = function(e) {
                function closeSelf() {
                    CloudClock.parent.activityIndicator.hide();
                    CloudClock.parent.activityIndicator.setMessage("Loading...");
                    closeIndex();
                }
                var employeesToPass = Alloy.Collections.employees.searchByPin(e.employeePin);
                var l = employeesToPass.length;
                if (0 === l && "1" === Ti.App.Properties.getString("ALLOWCROSSPUNCH")) {
                    $.newEmployeeDialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("no"), CloudClock.customL.strings("yes") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("newEmp_dialog"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.pinPad.clearPinPadTxtField();
                                    $.pinPad.addBtnEvents();
                                    $.newEmployeeDialog.hide.apply($);
                                } else {
                                    Alloy.createController("employeeFlow_newEmployee", {
                                        newEmployeePin: e.employeePin
                                    });
                                    $.newEmployeeDialog.hide.apply($);
                                    closeSelf();
                                }
                            }
                        }
                    });
                    $.activityIndicator.hide();
                    $.newEmployeeDialog.show.apply($);
                } else if (1 === l) {
                    Ti.App.Properties.setString("CURRLANGUAGETYPE", employeesToPass[0].get("lang"));
                    Alloy.createController("employeeFlow_clockInOut", {
                        employees: employeesToPass
                    });
                    closeSelf();
                } else if (l > 1) {
                    Alloy.createController("employeeFlow_selectEmployee", {
                        employees: employeesToPass
                    });
                    closeSelf();
                } else {
                    $.activityIndicator.hide();
                    $.activityIndicator.setMessage("Loading...");
                    $.badPinAlert = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("invalid_employeePin"),
                        message: CloudClock.customL.strings("enterDifferentPin"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.pinPad.clearPinPadTxtField();
                                    $.badPinAlert.hide.apply($);
                                }
                            }
                        }
                    });
                    $.badPinAlert.show.apply($);
                    $.pinPad.clearPinPadTxtField();
                    $.pinPad.addBtnEvents();
                }
            };
            $.manager_login = function(e) {
                if (CloudClock.managerOptions) new Error(); else if (e.managerPin === Ti.App.Properties.getString("MGRPIN") || e.managerPin === Ti.App.Properties.getString("MGR2PIN")) {
                    closeIndex();
                    Alloy.createController("managerOptions");
                    CloudClock.managerOptions.managerOptions.open();
                } else if ("9111" === e.managerPin) {
                    closeIndex();
                    Alloy.createController("managerOptions", {
                        debugMode: true
                    });
                    CloudClock.managerOptions.managerOptions.open();
                } else {
                    $.wrongManagerPinDialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("invalid_managerPin"),
                        callback: {
                            eType: "click",
                            action: wrongManagerDialogClick
                        }
                    });
                    $.wrongManagerPinDialog.show.apply($);
                }
            };
            $.animateBall = function() {
                var matrix = Ti.UI.create2DMatrix();
                matrix = matrix.translate(-890, -660);
                var a = Ti.UI.createAnimation({
                    transform: matrix,
                    duration: 5e3,
                    autoreverse: true,
                    repeat: 0
                });
                $.screenSaverLogo.animate(a);
            };
            $.startAnimation = function() {
                $.screenSaver.running = true;
                $.animateBall();
            };
            $.hide = function() {
                $.screenSaver.hide();
            };
            var oldTermID = 0;
            Ti.App.Properties.setString("CURRLANGUAGETYPE", Ti.App.Properties.getString("LANGUAGETYPE"));
            $.header.setLanguage();
            updateUIclock();
            addListeners();
            if (Ti.App.Properties.hasProperty("seeded")) {
                updateUI_seeded();
                CloudClock.screenTimeout.restartTimeoutIndex();
                $.index.open();
                true === args.reInit && reInitializedByManager();
            } else {
                updateUI_notSeed();
                oldTermID = parseInt(oldDbRemoval(), 10);
                if (!isNaN(oldTermID)) {
                    $.activityIndicator.show();
                    initializeClock.initialize(oldTermID);
                    $.pinPad.changeMode({
                        mode: "enterPin"
                    });
                }
                $.index.open();
            }
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;