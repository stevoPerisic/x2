var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var api = require("api");

exports.definition = {
    config: {
        columns: {
            id: "integer",
            language: "text",
            helpText: "text",
            helpAudioFile: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "deviceHelp"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function() {}
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            numOfResponses: 0,
            numOfRequests: 0,
            responseRecieved: false,
            deviceHelp_cfg: {
                endpoint: "getHelpFiles",
                params: {},
                payload: {
                    request: {
                        helpFiles: [ {
                            data: ""
                        } ]
                    }
                },
                onSuccess: function(response) {
                    var l = response.length;
                    var helpFileName = "";
                    var helpFilePath = "";
                    var helpFile = {};
                    try {
                        if (response.error) {
                            console.log("Error getting help file: " + JSON.stringify(response));
                            CloudClock.log("Error", "Error getting help file: " + JSON.stringify(response));
                            if (CloudClock.parent && null !== CloudClock.parent) {
                                CloudClock.parent.activityIndicator.hide();
                                CloudClock.parent.activityIndicator.setMessage("Loading...");
                            } else if (CloudClock.managerOptions && null !== CloudClock.managerOptions) {
                                CloudClock.managerOptions.activityIndicator.setMessage("Getting help files...");
                                CloudClock.managerOptions.activityIndicator.setMessage("Loading...");
                            }
                            Ti.App.Properties.setString("seeded", "yes");
                            CloudClock.dbSeeded.fetchParams(true);
                            CloudClock.dbSeeded.fetchLocalData();
                        } else {
                            Alloy.Collections.deviceHelp.numOfResponses = Alloy.Collections.deviceHelp.numOfResponses + response.length;
                            CloudClock.parent && null !== CloudClock.parent ? CloudClock.parent.activityIndicator.setMessage("Getting help files..." + Alloy.Collections.deviceHelp.numOfResponses + " of " + Alloy.Collections.deviceHelp.numOfRequests) : CloudClock.managerOptions && null !== CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.setMessage("Getting help files..." + Alloy.Collections.deviceHelp.numOfResponses + " of " + Alloy.Collections.deviceHelp.numOfRequests);
                            var helpFilesDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "helpFiles");
                            console.log("Does our Help files folder exist? " + helpFilesDir.exists());
                            if (false === helpFilesDir.exists()) {
                                console.log("\n No it does not exist create it.");
                                helpFilesDir.createDirectory();
                            }
                            for (var i = 0; l > i; i++) try {
                                if ("Unable to retrieve help file" !== response[i].data) {
                                    helpFileName = response[i].helpAudioFile.replace("\\help\\CloudClockPlus\\", "");
                                    helpFileName = helpFileName.replace(".MP3", "");
                                    helpFilePath = helpFileName + ".mp3";
                                    helpFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, helpFilePath);
                                    if (helpFile.exists()) {
                                        console.log("\n If it does delete it.");
                                        helpFile.deleteFile();
                                    }
                                    helpFile.write(Ti.Utils.base64decode(response[i].data));
                                    var prevVersion = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "helpFiles/" + helpFilePath);
                                    if (prevVersion.exists()) {
                                        console.log("\n If it does delete it.");
                                        prevVersion.deleteFile();
                                        prevVersion = null;
                                    }
                                    helpFile.move("helpFiles/" + helpFilePath);
                                    helpFile.deleteFile();
                                    helpFile = null;
                                } else console.log(response[i].data);
                            } catch (error) {
                                CloudClock.error(error);
                            }
                            if (Alloy.Collections.deviceHelp.numOfResponses === Alloy.Collections.deviceHelp.numOfRequests) {
                                Alloy.Collections.deviceHelp.numOfResponses = 0;
                                Alloy.Collections.deviceHelp.numOfRequests = 0;
                                if (CloudClock.parent && null !== CloudClock.parent) {
                                    CloudClock.parent.activityIndicator.hide();
                                    CloudClock.parent.activityIndicator.setMessage("Loading...");
                                } else if (CloudClock.managerOptions && null !== CloudClock.managerOptions) {
                                    CloudClock.managerOptions.activityIndicator.hide();
                                    CloudClock.managerOptions.activityIndicator.setMessage("Loading...");
                                }
                                Ti.App.Properties.setString("seeded", "yes");
                                CloudClock.dbSeeded.fetchParams(true);
                                CloudClock.dbSeeded.fetchLocalData();
                                CloudClock.clock.showScreenSaver = true;
                            } else Alloy.Collections.deviceHelp.sendRequest();
                        }
                    } catch (error) {
                        CloudClock.error(error);
                        Ti.App.Properties.setString("seeded", "yes");
                        CloudClock.dbSeeded.fetchParams(true);
                        CloudClock.dbSeeded.fetchLocalData();
                        CloudClock.clock.showScreenSaver = true;
                    }
                },
                onError: function(response) {
                    console.log("there was an error in getting help files: " + JSON.stringify(response));
                    CloudClock.log("Error", "There was an error in getting help files: " + JSON.stringify(response));
                    if (CloudClock.parent && null !== CloudClock.parent) {
                        CloudClock.parent.activityIndicator.setMessage("Done processing the help files...");
                        CloudClock.parent.activityIndicator.hide();
                        CloudClock.parent.activityIndicator.setMessage("Loading...");
                    } else if (CloudClock.managerOptions && null !== CloudClock.managerOptions) {
                        CloudClock.managerOptions.activityIndicator.setMessage("Done processing the help files...");
                        CloudClock.managerOptions.activityIndicator.hide();
                        CloudClock.managerOptions.activityIndicator.setMessage("Loading...");
                    }
                    Ti.App.Properties.setString("seeded", "yes");
                    CloudClock.dbSeeded.fetchParams(true);
                    CloudClock.dbSeeded.fetchLocalData();
                }
            },
            initialize: function() {
                console.log("device help collection innitialized, Number of models: " + this.length);
            },
            modifiedRequest: [],
            sendRequest: function() {
                var that = this;
                try {
                    that.deviceHelp_cfg.payload.request.helpFiles = that.modifiedRequest[0];
                    that.modifiedRequest.splice(0, 1);
                    that.deviceHelp_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                    api.request(that.deviceHelp_cfg);
                } catch (error) {
                    CloudClock.error(error);
                }
            },
            getHelpFiles: function() {
                try {
                    var that = this;
                    var l = that.models.length;
                    var tempArr = [];
                    var tempObj = {};
                    var chunkSize = 10;
                    for (var i = 0; l > i; i++) {
                        if ("" !== that.models[i].get("helpAudioFile")) {
                            tempObj = {
                                helpAudioFile: that.models[i].get("helpAudioFile"),
                                data: ""
                            };
                            tempArr.push(tempObj);
                        }
                        if (tempArr.length === chunkSize) {
                            that.modifiedRequest.push(tempArr);
                            that.numOfRequests = that.numOfRequests + chunkSize;
                            tempArr = [];
                        }
                        if (i === l - 1) {
                            if (0 !== tempArr.length) {
                                that.modifiedRequest.push(tempArr);
                                that.numOfRequests = that.numOfRequests + tempArr.length;
                            }
                            that.sendRequest();
                        }
                    }
                } catch (error) {
                    CloudClock.error(error);
                }
            },
            audioPlayer: {
                docsDir: Ti.Filesystem.getApplicationDataDirectory(),
                viewNo: false,
                formatLang: function(language) {
                    return "EN" === language || "en-us" === language || "en_us" === language || "en-US" === language ? "EN" : "es" === language ? "ES" : "fr" === language ? "FR" : "EN";
                },
                play: function() {
                    var language = "EN";
                    try {
                        CloudClock.sound && CloudClock.sound.stop();
                        var that = Alloy.Collections.deviceHelp.audioPlayer;
                        var soundLang = that.formatLang(language);
                        CloudClock.sound = false;
                        var helpfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "helpFiles/" + soundLang + "_" + that.viewNo + ".mp3");
                        if (helpfile.exists() && CloudClock.playHelp) {
                            CloudClock.sound = Titanium.Media.createSound({
                                url: that.docsDir + "helpFiles/" + soundLang + "_" + that.viewNo + ".mp3"
                            });
                            CloudClock.sound.play();
                        }
                    } catch (error) {
                        console.log("Help player play fn: " + error);
                        CloudClock.error(error);
                    }
                }
            }
        });
        return Collection;
    }
};

model = Alloy.M("deviceHelp", exports.definition, [ function(migration) {
    migration.name = "deviceHelp";
    migration.id = "201405121347682";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                id: "integer",
                language: "text",
                helpText: "text",
                helpAudioFile: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("deviceHelp", exports.definition, model);

exports.Model = model;

exports.Collection = collection;