var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

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
            employee_alloyID: "text",
            reasonCodeID: "integer",
            reasonCodeType: "integer",
            amount: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "clockHistory"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            change: function() {
                console.log("\n\n\nFrom change in clock history function: ");
            },
            validate: function(attrs) {
                if (_.isNull(attrs.transTime) || _.isNaN(attrs.transTime)) return "Tried to save punch history with transTime = null!";
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("Clock History initialized.");
            },
            removeHistory: function() {
                var that = this;
                CloudClock.log("Info", "Checking for entries from Clock History older than 18 hours");
                var count = 0;
                var now = Math.round(new Date().getTime());
                that.each(function(historyEntry) {
                    var then = historyEntry.get("transTime");
                    var clockHistoryTime = moment.unix(then);
                    if (now - clockHistoryTime._i > 648e5) try {
                        historyEntry.destroy();
                        count += 1;
                    } catch (error) {
                        CloudClock.error(error);
                    }
                });
                console.log("\n\n\nRemoved " + count + " entries from clock history.");
                CloudClock.log("Info", "Removed " + count + " entries from Clock History");
            },
            getPreviousClockIns: function(_employeeAlloyID) {
                var obj = {};
                var l = this.models.length;
                for (var i = 0; l > i; i++) this.models[i].get("employee_alloyID") === _employeeAlloyID && "I" === this.models[i].get("transType") && (obj[i] = this.models[i]);
                return obj;
            },
            getPreviousClockOuts: function(_employeeAlloyID) {
                var obj = {};
                var l = this.models.length;
                for (var i = 0; l > i; i++) this.models[i].get("employee_alloyID") === _employeeAlloyID && "O" === this.models[i].get("transType") && (obj[i] = this.models[i]);
                return obj;
            },
            getLatestClockIn: function(_employeeAlloyID) {
                var prevClockIns = this.getPreviousClockIns(_employeeAlloyID);
                var r = {};
                if (true !== _.isEmpty(prevClockIns)) {
                    var obj = _.max(prevClockIns, function(model) {
                        return model.attributes.transTime;
                    });
                    r.transTime = obj.get("transTime");
                    r.transDateTime = obj.get("transDateTime");
                    r.departmentNum = obj.get("departmentNum");
                    r.shiftID = obj.get("shiftID");
                    return r;
                }
                r.transTime = 0;
                r.transDateTime = 0;
                r.departmentNum = 0;
                r.shiftID = 0;
                return r;
            },
            getLatestClockOut: function(_employeeAlloyID) {
                var prevClockOuts = this.getPreviousClockOuts(_employeeAlloyID);
                var r = {};
                if (true !== _.isEmpty(prevClockOuts)) {
                    var obj = _.max(prevClockOuts, function(model) {
                        return model.attributes.transTime;
                    });
                    r.transTime = obj.get("transTime");
                    r.transDateTime = obj.get("transDateTime");
                    r.departmentNum = obj.get("departmentNum");
                    r.shiftID = obj.get("shiftID");
                    return r;
                }
                r.transTime = 0;
                r.transDateTime = 0;
                r.departmentNum = 0;
                r.shiftID = 0;
                return r;
            },
            getLatest: function(_employeeAlloyID) {
                var r = {
                    transTime: 0,
                    transType: 0,
                    departmentNum: 0,
                    shiftID: 0
                };
                if (0 !== this.length) {
                    var obj = _.chain(this.models).filter(function(model) {
                        return model.attributes.employee_alloyID === _employeeAlloyID;
                    }).max(function(model) {
                        return model.attributes.transTime;
                    }).value();
                    if (_.isObject(obj)) {
                        r.transTime = obj.get("transTime");
                        r.transType = obj.get("transType");
                        r.departmentNum = obj.get("departmentNum");
                        r.shiftID = obj.get("shiftID");
                        "1" === Ti.App.Properties.getString("SOFTSCHEDULING") && (r.overrideFlag = obj.get("overrideFlag"));
                        obj = null;
                    }
                }
                return r;
            }
        });
        return Collection;
    }
};

model = Alloy.M("clockHistory", exports.definition, [ function(migration) {
    migration.name = "clockHistory";
    migration.id = "201405121341911";
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
                employee_alloyID: "text",
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

collection = Alloy.C("clockHistory", exports.definition, model);

exports.Model = model;

exports.Collection = collection;