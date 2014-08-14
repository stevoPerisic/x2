function setLoaderText_and_fetchHelpFiles() {
    CloudClock.parent && null !== CloudClock.parent ? CloudClock.parent.activityIndicator.setMessage("Getting help files...") : CloudClock.managerOptions && null !== CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.setMessage("Getting help files...");
    Alloy.Collections.deviceHelp.getHelpFiles();
}

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var api = require("api");

exports.definition = {
    config: {
        columns: {
            badge: "integer",
            pin: "integer",
            name: "text",
            primaryDeptNum: "integer",
            mostUsedDeptNum: "integer",
            allowOpenDept: "numeric",
            byPassBio: "numeric",
            requestPTO: "numeric",
            scheduleReport: "text",
            replyTo: "text",
            lang: "text",
            fixPunch: "numeric",
            cellPhone: "text",
            cellCarrier: "text",
            email: "text",
            isBioRegistered: "numeric",
            type1: "text",
            type2: "text",
            photoFileName: "text",
            photoData: "text"
        },
        defaults: {
            badge: 0,
            pin: 0,
            name: "Model Default",
            primaryDeptNum: 0,
            lang: "en_us",
            photoFileName: "/images/icons/no-photo-256-gray.png"
        },
        adapter: {
            type: "sql",
            collection_name: "employees"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function() {
                0 === this.get("badge") && this.removeNewEmployee(this);
            },
            change: function() {
                var changes = this.changedAttributes();
                changes.photoFileName && (this.attributes.photoFileName = this.attributes.photoFileName.replace("\\", "/"));
            },
            getPhoto: function(_badge, _photoFileName) {
                this.collection.employeePhotos_cfg.payload.request.photos = [];
                var tempObj = {
                    employeeBadge: _badge,
                    photoData: _photoFileName
                };
                this.collection.employeePhotos_cfg.payload.request.photos.push(tempObj);
                api.request(this.collection.employeePhotos_cfg);
            },
            removeNewEmployee: function(that) {
                that.removeTimer = 0;
                that.removeTimer = setInterval(function() {
                    console.log("About to destroy: " + that.get("name"));
                    that.destroy({
                        success: function() {
                            console.log("model successfuly destroyed.");
                            CloudClock.log("Info", "New employee " + that.get("name") + " removed from local database.");
                            clearInterval(that.removeTimer);
                        },
                        error: function(err) {
                            console.log(err);
                            CloudClock.log("Error", "Error removing the new employee: " + that.get("name"));
                        }
                    });
                }, 936e5);
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            employeePhotos_cfg: {
                endpoint: "getPhotos",
                params: {},
                payload: {
                    request: {
                        photos: []
                    }
                },
                onSuccess: function(response) {
                    var l = response.length;
                    var employee;
                    try {
                        if (response.error) {
                            CloudClock.log("Error", "Server responded to Get Photos request with: " + JSON.stringify(response));
                            setLoaderText_and_fetchHelpFiles();
                        } else {
                            var masterPicsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "MasterPhoto");
                            masterPicsDir.exists() || masterPicsDir.createDirectory();
                            for (var i = 0; l > i; i++) {
                                employee = Alloy.Collections.employees.where({
                                    badge: response[i].employeeBadge
                                });
                                if (employee[0]) if ("Unable to retrieve photo" === response[i].photoData) employee[0].save({
                                    photoFileName: "/images/icons/no-photo-256-gray.png"
                                }); else {
                                    var masterFilePath = response[i].employeeBadge + ".jpg";
                                    var masterPicture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "MasterPhoto/" + masterFilePath);
                                    try {
                                        masterPicture.exists() && masterPicture.deleteFile();
                                        masterPicture.write(response[i].photoData);
                                    } catch (error) {
                                        CloudClock.error(error);
                                    }
                                    employee[0].save({
                                        photoFileName: "MasterPhoto/" + masterFilePath
                                    });
                                    masterPicture = null;
                                    masterFilePath = null;
                                } else CloudClock.log("Error", "During photo retrieval employee with badge number: " + response[i].employeeBadge + " could not be found!");
                            }
                        }
                        setLoaderText_and_fetchHelpFiles();
                        employee = null;
                        response = null;
                    } catch (error) {
                        CloudClock.error(error);
                        setLoaderText_and_fetchHelpFiles();
                    }
                },
                onError: function(response) {
                    Ti.API.error("Error: " + JSON.stringify(response));
                    CloudClock.log("Error", "Server responded to Get Photos request with: " + JSON.stringify(response));
                    CloudClock.parent.activityIndicator.hide();
                    CloudClock.parent.activityIndicator.setMessage("Loading...");
                    Alloy.Collections.deviceHelp.getHelpFiles(Alloy.Collections.employees.employeePhotos_cfg.params.termID);
                }
            },
            initialize: function() {
                console.log("Employees Collection innitialized, have to get the master photos if they exist!");
            },
            searchByPin: function(employeePin) {
                var arr = [];
                for (var i = 0; this.models.length > i; i++) this.models[i].get("pin") === employeePin && arr.push(this.models[i]);
                return arr;
            },
            getPhotos: function() {
                CloudClock.parent && null !== CloudClock.parent ? CloudClock.parent.activityIndicator.setMessage("Getting photos...") : CloudClock.managerOptions && null !== CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.setMessage("Getting photos...");
                this.employeePhotos_cfg.payload.request.photos = [];
                for (var i = 0; this.models.length > i; i++) if (this.models[i].get("photoFileName")) {
                    var tempObj = {
                        employeeBadge: this.models[i].get("badge"),
                        photoData: this.models[i].get("photoFileName")
                    };
                    this.employeePhotos_cfg.payload.request.photos.push(tempObj);
                }
                this.employeePhotos_cfg.qryStr = "";
                console.log("Getting photos! cfg: " + JSON.stringify(this.employeePhotos_cfg));
                this.employeePhotos_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                api.request(this.employeePhotos_cfg);
            },
            sendBatchPhotos_cfg: {
                endpoint: "postPhotos_batchMode",
                params: {},
                payload: {
                    transactionRequest: {
                        photos: []
                    }
                },
                onSuccess: function(response) {
                    console.log("Success response from postPhotos_batchMode: " + JSON.stringify(response));
                },
                onError: function(response) {
                    console.log("Error response from postPhotos_batchMode: " + JSON.stringify(response));
                }
            },
            sendPhotos_batchMode: function() {
                var that = this;
                var batchModePhotosDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "BatchModePhotos");
                if (!batchModePhotosDir.exists()) return false;
                var listing = batchModePhotosDir.getDirectoryListing();
                for (var i = 0; listing.length > i; i++) {
                    var tempFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "BatchModePhotos", listing[i]);
                    var index = tempFile.name.indexOf("_");
                    var endOfName = tempFile.name.indexOf(".");
                    var employeeBadge = tempFile.name.substring(0, index);
                    var photoTime = tempFile.name.substring(index + 1, endOfName);
                    var photoData = tempFile.read();
                    var tempObj = {
                        employeeBadge: employeeBadge,
                        photoTime: photoTime,
                        photoData: photoData.toString()
                    };
                    that.sendBatchPhotos_cfg.payload.transactionRequest.photos.push(tempObj);
                    tempFile.deleteFile();
                }
                if (0 !== that.sendBatchPhotos_cfg.payload.transactionRequest.photos.length) {
                    api.request(that.sendBatchPhotos_cfg);
                    that.sendBatchPhotos_cfg.payload.transactionRequest.photos = [];
                }
            }
        });
        return Collection;
    }
};

model = Alloy.M("employees", exports.definition, [ function(migration) {
    migration.name = "employees";
    migration.id = "201405121348942";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                badge: "integer",
                pin: "integer",
                name: "text",
                primaryDeptNum: "integer",
                allowOpenDept: "numeric",
                byPassBio: "numeric",
                requestPTO: "numeric",
                scheduleReport: "text",
                replyTo: "text",
                lang: "text",
                fixPunch: "numeric",
                cellPhone: "text",
                cellCarrier: "text",
                email: "text",
                isBioRegistered: "numeric",
                type1: "text",
                type2: "text",
                photoFileName: "text",
                photoData: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
}, function(migration) {
    migration.name = "employees";
    migration.id = "20140512145118";
    migration.up = function(migrator) {
        migrator.db.execute("ALTER TABLE " + migrator.table + " ADD COLUMN mostUsedDeptNum INT;");
        CloudClock.migratedUp = true;
    };
    migration.down = function(migrator) {
        var db = migrator.db;
        var table = migrator.table;
        db.execute("CREATE TEMPORARY TABLE employees_backup(badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id);");
        db.execute("INSERT INTO employees_backup SELECT badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id FROM " + table + ";");
        db.dropTable();
        db.createTable({
            columns: {
                badge: "integer",
                pin: "integer",
                name: "text",
                primaryDeptNum: "integer",
                allowOpenDept: "numeric",
                byPassBio: "numeric",
                requestPTO: "numeric",
                scheduleReport: "text",
                replyTo: "text",
                lang: "text",
                fixPunch: "numeric",
                cellPhone: "text",
                cellCarrier: "text",
                email: "text",
                isBioRegistered: "numeric",
                type1: "text",
                type2: "text",
                photoFileName: "text",
                photoData: "text"
            }
        });
        db.execute("INSERT INTO " + table + " SELECT badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id FROM employees_backup;");
        db.execute("DROP TABLE employees_backup");
    };
} ]);

collection = Alloy.C("employees", exports.definition, model);

exports.Model = model;

exports.Collection = collection;