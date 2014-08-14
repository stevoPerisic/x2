module.exports = {
    i: 0,
    t: 0,
    m: 0,
    indexTimeout: 0,
    showScreenSaver: true,
    employeeFlow: 0,
    employeeFlowWindow: "",
    showEmployeeFlowDialog: false,
    employeeOptions: 0,
    showEmployeeOptionsDialog: false,
    managerOptions: 0,
    showManagerOptionsDialog: false,
    dialogTimeout: 0,
    clockInterval: 1e3,
    init: function() {
        try {
            var that = "clock" === this.id ? this : CloudClock.clock;
            if (!CloudClock.clockStarted) {
                CloudClock.clockStarted = true;
                that.updateTime();
            }
        } catch (error) {
            CloudClock.error(error);
        }
    },
    updateTime: function() {
        try {
            if ("number" == typeof CloudClock.clock.timeout) {
                clearTimeout(CloudClock.clock.timeout);
                delete CloudClock.clock.timeout;
            }
            CloudClock.clock.setTime();
            CloudClock.clock.timeout = setTimeout(CloudClock.clock.updateTime, CloudClock.clock.clockInterval);
        } catch (error) {
            CloudClock.error(error);
        }
    },
    setTime: function() {
        try {
            var that = "clock" === this.id ? this : CloudClock.clock;
            that.i = that.i + 1e3;
            that.t = that.t + 1e3;
            that.m = that.m + 1e3;
            that.indexTimeout = that.indexTimeout + 1e3;
            that.employeeFlow = that.employeeFlow + 1e3;
            that.employeeOptions = that.employeeOptions + 1e3;
            that.managerOptions = that.managerOptions + 1e3;
            that.dialogTimeout = that.dialogTimeout + 1e3;
            _.isEmpty(CloudClock.UIClock) || CloudClock.UIClock.setText(CloudClock.moment().format("h:mm a"));
            if (0 === that.i % 6e4) {
                that.comm();
                null !== CloudClock.parent && CloudClock.parent.manager.classes.length > 1 && CloudClock.parent.changeToEmployeeMode({
                    mode: "enterPin"
                });
            }
            if (0 === that.i % 864e5) {
                Alloy.Collections.clockHistory.removeHistory();
                Alloy.Collections.logging.sendTransactionsCSV();
                that.i = 0;
            }
            if (0 === that.indexTimeout % CloudClock.screenTimeout.homeScreenTimeout && null !== CloudClock.parent && true === that.showScreenSaver) {
                if (false === CloudClock.parent.screenSaver.running) {
                    console.log("\n\n\nAbout to start screen saver");
                    CloudClock.screenTimeout.startScreenSaver();
                    that.indexTimeout = 0;
                }
            } else 0 === that.indexTimeout % 1e4 && null !== CloudClock.parent && true === that.showScreenSaver && true === CloudClock.parent.screenSaver.running && CloudClock.parent.animateBall();
            if (0 === that.employeeFlow % CloudClock.screenTimeout.employeeFlow && true === that.showEmployeeFlowDialog) {
                console.log("Employee flow timed out");
                CloudClock.screenTimeout.flowTimeout(this.employeeFlowWindow, "employeeFlow");
                that.employeeFlow = 0;
            }
            if (0 !== that.employeeOptions && 0 === that.employeeOptions % CloudClock.screenTimeout.employeeOptions && true === that.showEmployeeOptionsDialog) {
                console.log("employeeOptions flow timed out");
                CloudClock.screenTimeout.flowTimeout("", "employeeOptions");
                that.employeeOptions = 0;
            }
            if (0 === that.managerOptions % CloudClock.screenTimeout.managerOptions && true === that.showManagerOptionsDialog) {
                console.log("managerOptions flow timed out");
                CloudClock.screenTimeout.flowTimeout("", "managerOptions");
                that.managerOptions = 0;
            }
        } catch (error) {
            CloudClock.error(error);
        }
    },
    getCurrentTime: function() {
        try {
            var time = {
                secondsSince111970: 0,
                convertedUnix: ""
            };
            CloudClock.moment();
            time.secondsSince111970 = Math.round(new Date().getTime() / 1e3);
            if (_.isNull(time.secondsSince111970) || _.isNaN(time.secondsSince111970)) {
                CloudClock.log("Error", "CloudClock clock could not get the seconds past 1970, retry...");
                time.secondsSince111970 = Math.round(new Date().getTime() / 1e3);
                CloudClock.log("Info", "After retry: " + time.secondsSince111970);
            }
            var convertedUnix = moment.unix(time.secondsSince111970);
            time.convertedUnix = moment.utc(convertedUnix).format();
            return time;
        } catch (error) {
            CloudClock.error(error);
        }
    },
    comm: function() {
        try {
            console.log("start comm");
            var that = "clock" === this.id ? this : CloudClock.clock;
            var transactionInterval = 6e4 * parseInt(Ti.App.Properties.getString("COMMINTERVAL1"), 10);
            var maintenaceInterval = 6e4 * parseInt(Ti.App.Properties.getString("COMMINTERVAL2"), 10);
            if (that.t === transactionInterval) {
                Alloy.Collections.transactions.sendTransactions();
                var SOFTSCHEDULING = Ti.App.Properties.getString("SOFTSCHEDULING");
                var CAPTUREPHOTO = Ti.App.Properties.getString("CAPTUREPHOTO");
                if ("1" === SOFTSCHEDULING && "1" === CAPTUREPHOTO) {
                    console.log("About to send batch mode pics....");
                    Alloy.Collections.employees.sendPhotos_batchMode();
                }
                that.t = 0;
            }
            if (that.m === maintenaceInterval) {
                CloudClock.log("Info", "AVAILABLE MEMORY ON DEVICE: " + Math.ceil(Ti.Platform.availableMemory) + " MB");
                var dataSize = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).spaceAvailable();
                CloudClock.log("Info", "Data directory size: " + Math.ceil(dataSize / 1048576) + " MB");
                dataSize = null;
                var resourcesSize = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory).spaceAvailable();
                CloudClock.log("Info", "Resources directory size: " + Math.ceil(resourcesSize / 1048576) + " MB");
                resourcesSize = null;
                var tempSize = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).spaceAvailable();
                CloudClock.log("Info", "Temp directory size: " + Math.ceil(tempSize / 1048576) + " MB");
                tempSize = null;
                var cacheSize = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory).spaceAvailable();
                CloudClock.log("Info", "Cache directory size: " + Math.ceil(cacheSize / 1048576) + " MB");
                cacheSize = null;
                console.log("Is screen saver visible: " + CloudClock.screensaverON);
                if (null !== CloudClock.parent && CloudClock.screensaverON) {
                    CloudClock.log("Info", "REQUEST MAINTENACE...");
                    CloudClock.maintenace_cfg.params.messageType = "MAINT";
                    CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    CloudClock.api.request(CloudClock.maintenace_cfg);
                    Alloy.Collections.logging.saveToCSVandRemove();
                }
                that.m = 0;
            }
        } catch (error) {
            CloudClock.error(error);
        }
    }
};