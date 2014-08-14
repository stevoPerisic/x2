var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var api = require("api");

var csv = require("exportCSVData");

exports.definition = {
    config: {
        columns: {
            idType: "text",
            employeeBadge: "integer",
            transType: "text",
            departmentNum: "integer",
            transTime: "integer",
            transDateTime: "text",
            initials: "text",
            photoFileName: "text",
            photoTime: "integer",
            photoData: "text",
            shiftID: "integer",
            overrideFlag: "integer",
            sent: "integer",
            reasonCodeID: "integer",
            reasonCodeType: "integer",
            amount: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "transactions"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function(attrs) {
                1 === attrs.sent && this.destroy({
                    success: function() {
                        console.log("transaction destroyed");
                    }
                });
            },
            change: function() {
                console.log("\n\n\nFrom change in transactions function: ");
            },
            validate: function(attrs) {
                if (_.isNull(attrs.transTime) || _.isNaN(attrs.transTime)) return "Tried to save a transaction with transTime = null!";
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            transactions_cfg: {
                endpoint: "postTransactions",
                params: {},
                payload: {
                    transactionRequest: {
                        punches: [],
                        photos: []
                    }
                },
                onSuccess: function(response) {
                    if (response.error) CloudClock.log("Error", "Server responded to the transactions call: " + JSON.stringify(response)); else if (0 === response.status) {
                        console.log("\nTRANSACTIONS RESPONSE: " + response);
                        CloudClock.log("Info", "Punch transactions successfully sent to the server: " + JSON.stringify(response));
                        Alloy.Collections.transactions.fetch({
                            success: function() {
                                console.log("Transactions successfuly retrieved from local DB.");
                                _.each(response.result, function(postedTransaction) {
                                    var localTransaction = Alloy.Collections.transactions.where({
                                        transTime: postedTransaction
                                    });
                                    localTransaction[0].save({
                                        sent: 1
                                    }, {
                                        success: function() {
                                            CloudClock.log("Info", "Transaction marked as sent: " + JSON.stringify(_.omit(localTransaction[0].attributes, "photoData")));
                                        },
                                        error: function(model, response) {
                                            CloudClock.log("Error", "Transaction Model: " + JSON.stringify(response));
                                        }
                                    });
                                });
                            },
                            error: function(collection, response) {
                                CloudClock.log("Error", JSON.stringify(response));
                            }
                        });
                    } else if (0 !== response.status) {
                        CloudClock.log("Error", JSON.stringify(response));
                        Alloy.Collections.transactions.setPunches_toBeSent();
                    }
                    var now = CloudClock.moment();
                    Ti.App.Properties.setString("LAST_CONNECT", now.format("h:mm a"));
                    Ti.App.Properties.setString("LAST_QUPDATE", now.format("h:mm a"));
                    try {
                        if (CloudClock.managerOptions) {
                            CloudClock.managerOptions.setLastConnectText();
                            CloudClock.managerOptions.setQUpdateText();
                        }
                    } catch (error) {
                        CloudClock.error(error);
                    }
                },
                onError: function(response) {
                    console.log("\nERROR: " + JSON.stringify(response));
                    CloudClock.log("Error", "There was an error with sending punch transactions to the server. Error: " + JSON.stringify(response));
                    Alloy.Collections.transactions.setPunches_toBeSent();
                }
            },
            setPunches_toBeSent: function() {
                var unsentPunches = _.filter(this.models, function(punch) {
                    return 1 !== punch.attributes.sent;
                });
                _.each(unsentPunches, function(punch) {
                    CloudClock.log("Info", "Unsent punch for employee badge: " + punch.attributes.employeeBadge + ", @ " + punch.attributes.transDateTime);
                    punch.save({
                        sent: 0
                    }, {
                        success: function() {
                            CloudClock.log("Info", "Transaction marked to be sent: " + JSON.stringify(_.omit(punch.attributes, "photoData")));
                        }
                    });
                });
            },
            initialize: function() {
                console.log("Transactions collection initialized.");
            },
            sendTransactions: function() {
                console.log("Application prompted to send punch transactions.");
                var CAPTUREPHOTO = Ti.App.Properties.getString("CAPTUREPHOTO");
                var maxTransactions = 10;
                var currentNumOfTransactions = 0;
                var tempPunches = [];
                var tempPhotos = [];
                var that = this;
                if (0 === that.models.length) {
                    console.log("No transactions to process.");
                    return false;
                }
                if (Ti.Network.online) {
                    var unsentPunches = that.where({
                        sent: 0
                    });
                    console.log("\n\n\nUnsent punches length: " + unsentPunches.length);
                    CloudClock.log("Info", "Unsent punches: " + unsentPunches.length);
                    _.each(unsentPunches, function(transaction, key) {
                        function sendPunches_resetCFGarrays() {
                            console.log("\n\n\nSending " + tempPunches.length + " punches....");
                            CloudClock.log("Info", "Sending " + tempPunches.length + " punches....");
                            that.transactions_cfg.payload.transactionRequest.punches = tempPunches;
                            that.transactions_cfg.payload.transactionRequest.photos = tempPhotos.length > 0 ? tempPhotos : [];
                            csv.exportCsvData(tempPunches);
                            that.transactions_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                            api.request(that.transactions_cfg);
                            tempPunches = [];
                            tempPhotos = [];
                        }
                        try {
                            var deviceException = [];
                            deviceException.push(_.pick(transaction.attributes, "reasonCodeID", "reasonCodeType", "amount"));
                            tempPunches.push(function() {
                                var r = {};
                                r.idType = transaction.attributes.idType;
                                r.employeeBadge = transaction.attributes.employeeBadge;
                                r.transType = transaction.attributes.transType;
                                r.departmentNum = "I" === transaction.attributes.transType ? transaction.attributes.departmentNum : 0;
                                r.transTime = transaction.attributes.transTime;
                                r.transDateTime = transaction.attributes.transDateTime;
                                r.shiftID = transaction.attributes.shiftID;
                                r.overrideFlag = transaction.attributes.overrideFlag;
                                r.exceptions = deviceException;
                                "0" !== transaction.attributes.initials && (r.initials = transaction.attributes.initials);
                                currentNumOfTransactions += 1;
                                return r;
                            }());
                            if ("1" === CAPTUREPHOTO && transaction.has("photoData")) {
                                console.log("This employee has photo data.");
                                tempPhotos.push(_.pick(transaction.attributes, "employeeBadge", "photoTime", "photoData"));
                            } else {
                                console.log("This employee does not have photo data");
                                console.log("do not include photos in this transaction");
                            }
                            tempPunches.length === maxTransactions ? sendPunches_resetCFGarrays() : key === unsentPunches.length - 1 && tempPunches.length > 0 && sendPunches_resetCFGarrays();
                            transaction.save({
                                sent: 2
                            }, {
                                success: function() {
                                    CloudClock.log("Info", "Transaction marked to be sent: " + JSON.stringify(_.omit(transaction.attributes, "photoData")));
                                }
                            });
                        } catch (error) {
                            CloudClock.error(error);
                        }
                    });
                } else if (!Ti.Network.online) {
                    console.log("Device is not online transactions will be sent as soon as the network signal is available");
                    CloudClock.log("Error", "Device is not online, transactions will be sent as soon as the network is available.");
                }
            }
        });
        return Collection;
    }
};

model = Alloy.M("transactions", exports.definition, [ function(migration) {
    migration.name = "transactions";
    migration.id = "201405121349305";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                idType: "text",
                employeeBadge: "integer",
                transType: "text",
                departmentNum: "integer",
                transTime: "integer",
                transDateTime: "text",
                initials: "text",
                photoFileName: "text",
                photoTime: "integer",
                photoData: "text",
                shiftID: "integer",
                overrideFlag: "integer",
                sent: "integer",
                reasonCodeID: "integer",
                reasonCodeType: "integer",
                amount: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("transactions", exports.definition, model);

exports.Model = model;

exports.Collection = collection;