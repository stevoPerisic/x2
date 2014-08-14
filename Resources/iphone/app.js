var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var CloudClock = CloudClock || {};

(function() {
    try {
        CloudClock.serverContext = {
            ver: Ti.App.version,
            hid: Ti.Platform.osname,
            mac: Ti.Platform.macaddress,
            pw: "test",
            api: "2.0"
        };
        CloudClock.pplNetApi = require("pplNetApi_routes");
        CloudClock.api = require("api");
        CloudClock.moment = require("alloy/moment");
        CloudClock.clock = require("clock");
        CloudClock.customL = require("L_strings");
        CloudClock.dispatcher = require("dispatcher");
        CloudClock.sideMenu = require("sideMenu");
        CloudClock.screenTimeout = require("screenTimeouts");
        CloudClock.customAlert = require("customAlertBox");
        CloudClock.csv = require("exportCSVData");
        CloudClock.APIcallInProgress = false;
        CloudClock.migratedUp = false;
        CloudClock.playHelp = false;
        CloudClock.screensaverON = false;
        CloudClock.log = function(severity, message) {
            var time = CloudClock.clock.getCurrentTime();
            var now = new Date();
            now = now.getTime();
            var log = Alloy.createModel("logging", {
                severity: severity,
                message: message,
                time: now,
                readableTime: moment(time.convertedUnix).format("M/D h:mm:ss a")
            });
            console.log(JSON.stringify(log));
            log.save();
        };
        CloudClock.error = function(_error) {
            var newError = {};
            var members;
            var logString = "";
            if (_.isObject(_error)) {
                members = Object.getOwnPropertyNames(_error);
                for (var i = 0; members.length > i; i++) {
                    newError[members[i]] = _error[members[i]];
                    logString = logString + members[i] + ": " + _error[members[i]] + "\n";
                }
                console.log("Error: " + newError.message);
                CloudClock.log("Error", "Message: " + newError.message);
                CloudClock.log("Error", "Full stack: " + logString);
            } else CloudClock.log("Error", "Message: " + _error);
            newError = null;
            members = null;
        };
        CloudClock.getLocalPhoto = function(_el, localPhotoFileName) {
            console.log("\n\n\nGetting local photo...");
            var f = null;
            var masterPicture = null;
            try {
                f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localPhotoFileName);
                f = f.read();
                if (!_.isObject(f)) {
                    localPhotoFileName = "MasterPhoto/" + CloudClock.sessionObj.employee.get("badge") + ".jpg";
                    f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localPhotoFileName);
                    f = f.read();
                }
            } catch (error) {
                CloudClock.error(error);
            }
            try {
                masterPicture = Ti.Utils.base64decode(f);
                f = null;
            } catch (error) {
                CloudClock.error(error);
            }
            if (void 0 !== masterPicture) try {
                _el.setImage(masterPicture);
                masterPicture = null;
                _el = null;
            } catch (error) {
                CloudClock.error(error);
            } else _el.setImage("/images/icons/no-photo-256-gray.png");
            console.log("\n\n\nDONE - getting local photo... _el: " + JSON.stringify(_el) + " masterPicture: " + masterPicture + " f: " + f);
        };
        CloudClock.dbSeeded = {
            fetchParams: function(fetchLogo) {
                Alloy.Collections.parameters.fetch({
                    success: function() {
                        CloudClock.pplNetApi.base = Ti.App.Properties.getString("PNET");
                        console.log("Changed the API base to: " + Ti.App.Properties.getString("PNET"));
                        Ti.App.Properties.setString("CURRLANGUAGETYPE", Ti.App.Properties.getString("LANGUAGETYPE"));
                        CloudClock.screenTimeout.homeScreenTimeout = 6e4 * parseInt(Ti.App.Properties.getString("SCREENSAVER"), 10);
                        CloudClock.screenTimeout.employeeFlow = 1e3 * parseInt(Ti.App.Properties.getString("PAGETIMEOUTSHORT"), 10);
                        CloudClock.screenTimeout.employeeOptions = 1e3 * parseInt(Ti.App.Properties.getString("PAGETIMEOUTMED"), 10);
                        CloudClock.screenTimeout.managerOptions = 1e3 * parseInt(Ti.App.Properties.getString("PAGETIMEOUTLONG"), 10);
                        if (fetchLogo) {
                            CloudClock.getLogo_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                            CloudClock.getLogo_cfg.params.logoImage = Ti.App.Properties.getString("LOGOIMAGENAME").replace("\\logo\\", "");
                            CloudClock.api.request(CloudClock.getLogo_cfg);
                        }
                        try {
                            if (CloudClock.parent) {
                                CloudClock.parent.mainMenu.setVisible(true);
                                CloudClock.parent.pinPad.getPinSettings();
                            }
                        } catch (error) {
                            CloudClock.error(error);
                        }
                    },
                    error: function(collection, response) {
                        CloudClock.log("Error", JSON.stringify(response));
                    }
                });
            },
            fetchLocalData: function() {
                try {
                    Alloy.Collections.employees.fetch({
                        success: function() {
                            console.log("Employees successfuly retrieved from local DB.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.employeeDepartments.fetch({
                        success: function() {
                            console.log("Employee Departments fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.departments.fetch({
                        success: function() {
                            console.log("Departments fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.deptShifts.fetch({
                        success: function() {
                            console.log("Department shifts fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.clockHistory.fetch({
                        success: function() {
                            console.log("Clock History fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.transactions.fetch({
                        success: function() {
                            console.log("Transactions fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.deviceHelp.fetch({
                        success: function() {
                            console.log("Employees successfuly retrieved from local DB.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                } catch (error) {
                    CloudClock.error(error);
                }
                CloudClock.clock.showScreenSaver = true;
            }
        };
        CloudClock.getAppParameters = function() {
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
        };
        CloudClock.sessionObj = {
            currentPunch: {},
            employee: {},
            employeeDepartments: [],
            last_inPunch: {},
            last_outPunch: {},
            difference: 0,
            latestTransaction: {},
            previousClockIns: {},
            previousClockOuts: {},
            nextWindow: "",
            punchException: 0,
            shift: {},
            showActual: 0,
            restrictionDialog: 0,
            punchStarted: 0,
            saveTransaction: function() {
                try {
                    var that = this;
                    that.currentPunch.sent = 0;
                    CloudClock.log("Info", "Creating punch transaction for " + that.employee.get("name") + ", " + JSON.stringify(_.omit(that.currentPunch, "photoData")));
                    var newTransactionModel = Alloy.createModel("transactions", that.currentPunch);
                    that.currentPunch.employee_alloyID = that.employee.get("alloy_id");
                    var newClockHistoryModel = Alloy.createModel("clockHistory", that.currentPunch);
                    newTransactionModel.save(null, {
                        success: function() {
                            CloudClock.log("Info", "Transaction saved for " + CloudClock.sessionObj.employee.get("name") + "\n" + JSON.stringify(_.omit(newTransactionModel.attributes, "photoData")));
                        },
                        error: function() {
                            CloudClock.log("Error", "Transaction Model: " + JSON.stringify(_.omit(newTransactionModel.attributes, "photoData")));
                        }
                    });
                    var forCSV = [ {
                        idType: newTransactionModel.attributes.idType,
                        employeeBadge: newTransactionModel.attributes.employeeBadge,
                        transType: newTransactionModel.attributes.transType,
                        departmentNum: "I" === newTransactionModel.attributes.transType ? newTransactionModel.attributes.departmentNum : 0,
                        transTime: newTransactionModel.attributes.transTime,
                        transDateTime: newTransactionModel.attributes.transDateTime,
                        shiftID: newTransactionModel.attributes.shiftID,
                        overrideFlag: newTransactionModel.attributes.overrideFlag,
                        exceptions: [ {
                            reasonCodeID: newTransactionModel.attributes.reasonCodeID,
                            reasonCodeType: newTransactionModel.attributes.reasonCodeType,
                            amount: newTransactionModel.attributes.amount
                        } ],
                        initials: newTransactionModel.attributes.initials
                    } ];
                    CloudClock.csv.exportCsvData(forCSV, "transactions.csv");
                    newClockHistoryModel.save(null, {
                        success: function() {
                            CloudClock.log("Info", "Clock history entry saved for " + CloudClock.sessionObj.employee.get("name") + "\n" + JSON.stringify(_.omit(newTransactionModel.attributes, "photoData")));
                        },
                        error: function() {
                            CloudClock.log("Error", "Clock history entry Model: " + JSON.stringify(_.omit(newTransactionModel.attributes, "photoData")));
                        }
                    });
                    Alloy.Collections.clockHistory.fetch({
                        add: true,
                        success: function() {
                            console.log("Clock History fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                    Alloy.Collections.transactions.fetch({
                        add: true,
                        success: function() {
                            console.log("Transactions fetched.");
                        },
                        error: function(collection, response) {
                            CloudClock.log("Error", JSON.stringify(response));
                        }
                    });
                } catch (error) {
                    CloudClock.error(error);
                }
            },
            clearSession: function() {
                var that = this;
                try {
                    _.isEmpty(that.employee) || CloudClock.log("Info", "Session for: " + that.employee.get("name") + " cleared.");
                    that.currentPunch = {};
                    that.employee = {};
                    that.employeeDepartments = [];
                    that.last_inPunch = {};
                    that.last_outPunch = {};
                    that.difference = 0;
                    that.latestTransaction = {};
                    that.nextWindow = "";
                    that.previousClockIns = {};
                    that.previousClockOuts = {};
                    that.punchException = 0;
                    that.shift = {};
                    that.showActual = 0;
                    this.restrictionDialog = 0;
                    this.punchStarted = 0;
                } catch (error) {
                    CloudClock.error(error);
                }
            }
        };
        CloudClock.clock.init();
        Alloy.Collections.instance("logging");
        Alloy.Collections.instance("transactions");
        Alloy.Collections.instance("clockHistory");
        Alloy.Collections.instance("parameters");
        Alloy.Collections.instance("deptShifts");
        Alloy.Collections.instance("reasonCodes");
        Alloy.Collections.instance("departments");
        Alloy.Collections.instance("employeeDepartments");
        Alloy.Collections.instance("employees");
        Alloy.Collections.instance("deviceHelp");
        Alloy.Collections.instance("extraFields");
        Alloy.Collections.instance("messages");
        Alloy.Collections.instance("extraFieldsParms");
        CloudClock.log("Info", "Hello, Cloud Clock is starting up...");
        Ti.API.info("Is the device online: " + Ti.Network.online);
        false === Ti.Network.online && CloudClock.log("Error", "This device is not connected to a network!");
        Ti.Network.addEventListener("change", function(e) {
            if (false === e.online) {
                CloudClock.log("Error", "Network connection lost: " + JSON.stringify(e));
                if (CloudClock.parent) {
                    CloudClock.parent.noNetwork.setText(CloudClock.customL.strings("limitedFunctionality"));
                    CloudClock.parent.noNetwork.show();
                }
            } else {
                CloudClock.log("Info", "Network regained: " + JSON.stringify(e));
                CloudClock.parent && CloudClock.parent.noNetwork.hide();
            }
        });
        if (Ti.App.Properties.hasProperty("seeded")) {
            CloudClock.dbSeeded.fetchParams(false);
            CloudClock.dbSeeded.fetchLocalData();
        }
    } catch (error) {
        CloudClock.error(error);
    }
})(CloudClock);

Alloy.createController("index");