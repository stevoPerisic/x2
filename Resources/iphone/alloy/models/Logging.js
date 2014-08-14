var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var api = require("api");

exports.definition = {
    config: {
        columns: {
            severity: "text",
            message: "text",
            time: "integer",
            readableTime: "text",
            sent: "integer"
        },
        defaults: {
            sent: 0
        },
        adapter: {
            type: "sql",
            collection_name: "logging"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function() {
                1 === this.get("sent") && this.destroy();
            },
            change: function() {}
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            logs_cfg: {
                endpoint: "sendLogs",
                params: {},
                payload: {
                    log: {
                        logs: []
                    }
                },
                onSuccess: function(response) {
                    console.log(JSON.stringify(response));
                    var that = Alloy.Collections.logging;
                    if (response.error) CloudClock.log("Error", "Server responded to the log sending call: " + JSON.stringify(response)); else try {
                        if (true === that.sendingLogs) {
                            Alloy.Collections.logging.deleteLogsCSV();
                            _.each(that.models, function(log) {
                                0 === log.get("sent") && log.save({
                                    sent: 1
                                });
                            });
                            that.sendingLogs = false;
                            console.log("Logs sent successfully: " + JSON.stringify(response));
                            CloudClock.log("Info", "Logs sent successfully: " + JSON.stringify(response));
                            if (null !== CloudClock.parent && CloudClock.parent.screenSaver.visible) {
                                console.log("Screen saver is on, do not make the dialog and remove sent logs...");
                                while (Alloy.Collections.logging.models.length > 0) Alloy.Collections.logging.models[0].destroy();
                            } else {
                                console.log("Screensaver NOT on show dialog...");
                                CloudClock.logsSentDialog = CloudClock.customAlert.create({
                                    type: "success",
                                    cancel: 0,
                                    buttonNames: [ CloudClock.customL.strings("ok") ],
                                    title: CloudClock.customL.strings("success"),
                                    message: "Logs sent.",
                                    callback: {
                                        eType: "click",
                                        action: function(_e) {
                                            if (_e.source.id === this.cancel) {
                                                while (Alloy.Collections.logging.models.length > 0) Alloy.Collections.logging.models[0].destroy();
                                                CloudClock.logsSentDialog.hide.apply(CloudClock.managerOptions);
                                                CloudClock.logsSentDialog = null;
                                                CloudClock.managerOptions && CloudClock.managerOptions.viewLogs();
                                            }
                                        }
                                    }
                                });
                                CloudClock.logsSentDialog.show.apply(CloudClock.managerOptions);
                            }
                        }
                        if (true === that.sendingCSV) {
                            that.outputFile.deleteFile();
                            that.outputFile = null;
                            that.sendingCSV = false;
                            console.log("Transactions CSV sent successfully: " + JSON.stringify(response));
                            CloudClock.log("Info", "Transactions CSV sent successfully: " + JSON.stringify(response));
                            CloudClock.CSVsentDialog = CloudClock.customAlert.create({
                                type: "success",
                                cancel: 0,
                                buttonNames: [ CloudClock.customL.strings("ok") ],
                                title: CloudClock.customL.strings("success"),
                                message: "Transactions CSV file sent.",
                                callback: {
                                    eType: "click",
                                    action: function(_e) {
                                        if (_e.source.id === this.cancel) {
                                            CloudClock.CSVsentDialog.hide.apply(CloudClock.managerOptions);
                                            CloudClock.CSVsentDialog = null;
                                        }
                                    }
                                }
                            });
                            CloudClock.CSVsentDialog.show.apply(CloudClock.managerOptions);
                        }
                        CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.hide();
                    } catch (error) {
                        CloudClock.error(error);
                    }
                },
                onError: function(response) {
                    try {
                        console.log("Error: " + JSON.stringify(response));
                        CloudClock.log("Error", "Server responded to the log sending call: " + JSON.stringify(response));
                        var that = Alloy.Collections.logging;
                        if (true === that.sendingLogs) {
                            that.sendingLogs = false;
                            console.log("Logs NOT SENT: " + JSON.stringify(response));
                            CloudClock.log("Error", "Logs NOT SENT: " + JSON.stringify(response));
                            CloudClock.logsSentDialog = CloudClock.customAlert.create({
                                type: "alert",
                                cancel: 0,
                                buttonNames: [ CloudClock.customL.strings("ok") ],
                                title: CloudClock.customL.strings("alert"),
                                message: "Unable to send logs.\nCheck your WiFi connection.",
                                callback: {
                                    eType: "click",
                                    action: function(_e) {
                                        if (_e.source.id === this.cancel) {
                                            CloudClock.logsSentDialog.hide.apply(CloudClock.managerOptions);
                                            CloudClock.logsSentDialog = null;
                                        }
                                    }
                                }
                            });
                            CloudClock.logsSentDialog.show.apply(CloudClock.managerOptions);
                        }
                        if (true === that.sendingCSV) {
                            that.outputFile = null;
                            that.sendingCSV = false;
                            console.log("Transactions CSV NOT SENT: " + JSON.stringify(response));
                            CloudClock.log("Error", "Transactions CSV NOT SENT: " + JSON.stringify(response));
                        }
                        if (CloudClock.managerOptions) {
                            CloudClock.managerOptions.viewLogs();
                            CloudClock.managerOptions.activityIndicator.hide();
                        }
                    } catch (error) {
                        CloudClock.error(error);
                    }
                }
            },
            initialize: function() {
                var that = this;
                that.sendingLogs = false;
                that.sendingCSV = false;
                that.fetch({
                    success: function() {
                        console.log("Logs successfuly retrieved from local DB.");
                    },
                    error: function(collection, response) {
                        CloudClock.log("Error", JSON.stringify(response));
                    }
                });
                that.sortByTimeDesc();
                that.length > 10 && console.log("We have this many log entries in the DB:" + that.length);
            },
            comparator: function(a, b) {
                a = a.get(this.sort_key);
                b = b.get(this.sort_key);
                var ret;
                ret = b > a ? -1 : a > b ? 1 : 0;
                "desc" === this.sort_dir && (ret = -ret);
                return ret;
            },
            sortByTimeAsc: function() {
                this.sort_key = "time";
                this.sort_dir = "asc";
                this.sort();
            },
            sortByTimeDesc: function() {
                this.sort_key = "time";
                this.sort_dir = "desc";
                this.sort();
            },
            sortBySeverityAsc: function() {
                this.sort_key = "severity";
                this.sort_dir = "asc";
                this.sort();
            },
            sortBySeverityDesc: function() {
                this.sort_key = "severity";
                this.sort_dir = "desc";
                this.sort();
            },
            change: function() {
                console.log("changed");
            },
            saveToCSVandRemove: function() {
                Alloy.Collections.logging.fetch();
                Alloy.Collections.logging.sortByTimeAsc();
                var now = new Date();
                now = now.getTime();
                var logsForCSV = [];
                if (Alloy.Collections.logging.length > 0) {
                    _.each(Alloy.Collections.logging.models, function(log) {
                        var tempObj = {
                            time: log.get("time") + " | " + log.get("readableTime"),
                            text: log.get("severity") + " | " + log.get("message")
                        };
                        logsForCSV.push(tempObj);
                    });
                    while (Alloy.Collections.logging.models.length > 0) Alloy.Collections.logging.models[0].destroy();
                    CloudClock.csv.exportCsvData(logsForCSV, "logging_" + now + ".csv");
                }
                Alloy.Collections.logging.sendLogsCSV();
                now = null;
            },
            sendLogs: function() {
                var that = Alloy.Collections.logging;
                if (Ti.Network.online) {
                    that.logs_cfg.payload.log.logs = [];
                    that.fetch();
                    _.each(that.models, function(log) {
                        log.save({
                            sent: 0
                        });
                        that.logs_cfg.payload.log.logs.push({
                            time: log.get("time") + " | " + log.get("readableTime"),
                            text: log.get("severity") + " | " + log.get("message")
                        });
                    });
                    that.logs_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    that.sendingLogs = true;
                    console.log("About to send " + that.logs_cfg.payload.log.logs.length + " logs");
                    api.request(that.logs_cfg);
                    that.logs_cfg.payload.log.logs = [];
                } else {
                    console.log("Device is not online logs will be sent as soon as the network signal is available");
                    CloudClock.log("Error", "Device is not online, logs will be sent as soon as the network is available.");
                }
            },
            sendLogsCSV: function() {
                if (Ti.Network.online) {
                    var documentsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
                    var listing = documentsDir.getDirectoryListing();
                    for (var i = 0; listing.length > i; i++) {
                        Alloy.Collections.logging.logs_cfg.payload.log.logs = [];
                        if (-1 != listing[i].indexOf("logging")) {
                            var tempLogFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, listing[i]);
                            Alloy.Collections.logging.logs_cfg.payload.log.logs.push({
                                time: moment().format("hh:mm:ss"),
                                text: tempLogFile.read().toString()
                            });
                            Alloy.Collections.logging.sendingLogs = true;
                            api.request(Alloy.Collections.logging.logs_cfg);
                            Alloy.Collections.logging.logFileToRemove.push(listing[i]);
                        }
                    }
                } else {
                    console.log("Device is not online logs will be sent as soon as the network signal is available");
                    CloudClock.log("Error", "Device is not online, logs will be sent as soon as the network is available.");
                }
            },
            logFileToRemove: [],
            deleteLogsCSV: function() {
                if (Alloy.Collections.logging.logFileToRemove.length > 0) {
                    _.each(Alloy.Collections.logging.logFileToRemove, function(fileName) {
                        var tempLogFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
                        tempLogFile.deleteFile();
                    });
                    Alloy.Collections.logging.logFileToRemove = [];
                }
            },
            sendTransactionsCSV: function() {
                var that = Alloy.Collections.logging;
                that.outputFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "transactions.csv");
                var existingText = "";
                try {
                    if (that.outputFile.exists()) {
                        existingText = that.outputFile.read().toString();
                        that.logs_cfg.payload.log.logs.push({
                            time: moment().format("hh:mm:ss"),
                            text: existingText
                        });
                        that.logs_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                        that.sendingCSV = true;
                        CloudClock.log("Info", "transactions.csv ready to be sent!!!");
                        api.request(that.logs_cfg);
                        existingText = null;
                    } else if (CloudClock.managerOptions) {
                        CloudClock.CSVsentDialog = CloudClock.customAlert.create({
                            type: "warning",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("warning"),
                            message: "No transactions were recorded on this clock since the last time you sent the transactions CSV file.",
                            callback: {
                                eType: "click",
                                action: function(_e) {
                                    if (_e.source.id === this.cancel) {
                                        CloudClock.CSVsentDialog.hide.apply(CloudClock.managerOptions);
                                        CloudClock.CSVsentDialog = null;
                                    }
                                }
                            }
                        });
                        CloudClock.CSVsentDialog.show.apply(CloudClock.managerOptions);
                    }
                } catch (error) {
                    CloudClock.error(error);
                }
            }
        });
        return Collection;
    }
};

model = Alloy.M("logging", exports.definition, [ function(migration) {
    migration.name = "logging";
    migration.id = "201405131324805";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                severity: "text",
                message: "text",
                time: "integer",
                readableTime: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.droptTable();
    };
}, function(migration) {
    migration.name = "logging";
    migration.id = "201405131325888";
    migration.up = function(migrator) {
        try {
            migrator.db.execute("SELECT sent FROM " + migrator.table + ";");
        } catch (error) {
            migrator.db.execute("ALTER TABLE " + migrator.table + " ADD COLUMN sent INT");
            CloudClock.migratedUp = true;
        }
    };
    migration.down = function(migrator) {
        var db = migrator.db;
        var table = migrator.table;
        db.execute("CREATE TEMPORARY TABLE logging_backup(severity, message, time, readableTime, alloy_id);");
        db.execute("INSERT INTO logging_backup SELECT severity, message, time, readableTime, alloy_id FROM " + table + ";");
        db.dropTable();
        db.createTable({
            columns: {
                severity: "text",
                message: "text",
                time: "integer",
                readableTime: "text"
            }
        });
        db.execute("INSERT INTO " + table + " SELECT severity, message, time, readableTime, alloy_id FROM logging_backup;");
        db.execute("DROP TABLE logging_backup");
    };
} ]);

collection = Alloy.C("logging", exports.definition, model);

exports.Model = model;

exports.Collection = collection;