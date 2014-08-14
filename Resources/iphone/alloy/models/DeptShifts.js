var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            deptShiftID: "integer",
            displayName: "text",
            departmentNum: "integer",
            shiftNum: "integer",
            applyDay1: "text",
            applyDay2: "text",
            applyDay3: "text",
            applyDay4: "text",
            applyDay5: "text",
            applyDay6: "text",
            applyDay7: "text",
            shiftStart: "text",
            shiftEnd: "text",
            applyBreak: "text",
            workSpan1: "text",
            breakLength1: "text",
            workSpan2: "text",
            breakLength2: "text",
            inGraceMinutes: "integer",
            earlyIn: "text",
            veryEarlyIn: "text",
            lateIn: "text",
            lateOut: "text",
            veryLateOut: "text",
            earlyOut: "text",
            lateInMins: "integer",
            earlyOutMins: "integer",
            earlyBreakIn: "text",
            autoBreak: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "deptShifts"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {},
            findWithCurrentPunch: function() {
                function findShift(_shifts) {
                    var transType = CloudClock.sessionObj.currentPunch.transType;
                    var actualTime = CloudClock.sessionObj.currentPunch.transDateTime;
                    var applyDay = moment(actualTime).day() + 1;
                    var actualTimeMins = 60 * parseInt(actualTime.slice(11, 13), 10) + parseInt(actualTime.slice(14, 16), 10);
                    var shiftWindow = "I" === transType ? parseInt(Ti.App.Properties.getString("SHIFTINWINDOW"), 10) : parseInt(Ti.App.Properties.getString("SHIFTOUTWINDOW"), 10);
                    var outsideGraceWindow = parseInt(Ti.App.Properties.getString("OUTSIDEGRACE"), 10);
                    var insideShiftWindow;
                    var outsideGraceShift;
                    var insideShiftWindow_2;
                    var outsideGraceShift_2;
                    var closestShift = [];
                    var diff = 0;
                    var diff_2 = 0;
                    insideShiftWindow = _.chain(_shifts).filter(function(shift) {
                        var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                        var absDiff = Math.abs(actualTimeMins - startOrEnd);
                        var actDiff = actualTimeMins - startOrEnd;
                        shift.set({
                            absDiff: absDiff,
                            actDiff: actDiff
                        });
                        if ("0" !== shift.get("applyDay" + applyDay) && shift.get("absDiff") >= 0 && shiftWindow >= shift.get("absDiff")) {
                            console.log(shift.get("departmentNum"));
                            return shift;
                        }
                    }).sortBy(function(shift) {
                        return shift.get("absDiff");
                    }).value();
                    if (1 === insideShiftWindow.length) {
                        insideShiftWindow[0].set({
                            insideShiftWindow: true
                        });
                        return insideShiftWindow;
                    }
                    if (insideShiftWindow.length > 1) {
                        diff = _.chain(insideShiftWindow).first().value().get("absDiff");
                        insideShiftWindow_2 = _.chain(insideShiftWindow).filter(function(shift) {
                            var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                            var absDiff = Math.abs(actualTimeMins - startOrEnd);
                            var actDiff = actualTimeMins - startOrEnd;
                            shift.set({
                                absDiff: absDiff,
                                actDiff: actDiff
                            });
                            if ("0" !== shift.get("applyDay" + applyDay) && shift.get("absDiff") >= 0 && shiftWindow >= shift.get("absDiff") && shift.get("absDiff") === diff) {
                                console.log(shift.get("departmentNUm"));
                                return shift;
                            }
                        }).value();
                        return insideShiftWindow_2;
                    }
                    outsideGraceShift = _.chain(_shifts).filter(function(shift) {
                        var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                        var absDiff = Math.abs(actualTimeMins - startOrEnd);
                        var actDiff = actualTimeMins - startOrEnd;
                        shift.set({
                            absDiff: absDiff,
                            actDiff: actDiff
                        });
                        if ("0" !== shift.get("applyDay" + applyDay) && shift.get("absDiff") >= 0 && outsideGraceWindow >= shift.get("absDiff")) {
                            console.log(shift.get("departmentNum"));
                            return shift;
                        }
                    }).sortBy(function(shift) {
                        return shift.get("departmentNum");
                    }).sortBy(function(shift) {
                        return shift.get("absDiff");
                    }).value();
                    if (1 === outsideGraceShift.length) {
                        outsideGraceShift[0].set({
                            outsideGraceShift: true
                        });
                        return outsideGraceShift;
                    }
                    if (outsideGraceShift.length > 1) {
                        diff_2 = _.chain(outsideGraceShift).first().value().get("absDiff");
                        outsideGraceShift_2 = _.chain(outsideGraceShift).filter(function(shift) {
                            var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                            var absDiff = Math.abs(actualTimeMins - startOrEnd);
                            var actDiff = actualTimeMins - startOrEnd;
                            shift.set({
                                absDiff: absDiff,
                                actDiff: actDiff
                            });
                            if ("0" !== shift.get("applyDay" + applyDay) && shift.get("absDiff") >= 0 && outsideGraceWindow >= shift.get("absDiff") && shift.get("absDiff") === diff_2) {
                                console.log(shift.get("departmentNum"));
                                return shift;
                            }
                        }).value();
                        return outsideGraceShift_2;
                    }
                    closestShift.push(_.chain(_shifts).filter(function(shift) {
                        var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                        var absDiff = Math.abs(actualTimeMins - startOrEnd);
                        var actDiff = actualTimeMins - startOrEnd;
                        shift.set({
                            absDiff: absDiff,
                            actDiff: actDiff
                        });
                        if ("0" !== shift.get("applyDay" + applyDay) && shift.get("absDiff") >= 0) {
                            console.log(shift.get("departmentNum"));
                            return shift;
                        }
                    }).sortBy(function(shift) {
                        return shift.get("absDiff");
                    }).first().value());
                    return _.isUndefined(closestShift[0]) ? false : closestShift;
                }
                function getDept9999shifts() {
                    var dept9999Shifts = Alloy.Collections.deptShifts.where({
                        departmentNum: 9999
                    });
                    return findShift(dept9999Shifts);
                }
                try {
                    var deptShifts = this.where({
                        departmentNum: CloudClock.sessionObj.currentPunch.departmentNum
                    });
                    var retObj;
                    if (0 !== deptShifts.length) {
                        retObj = findShift(deptShifts);
                        if (retObj) return retObj;
                        retObj = getDept9999shifts();
                        return retObj;
                    }
                    retObj = getDept9999shifts();
                    return retObj;
                } catch (error) {
                    CloudClock.error(error);
                }
            },
            findByID: function(_shiftID) {
                var transType = CloudClock.sessionObj.currentPunch.transType;
                var actualTime = CloudClock.sessionObj.currentPunch.transDateTime;
                moment(actualTime).day() + 1;
                var actualTimeMins = 60 * parseInt(actualTime.slice(11, 13), 10) + parseInt(actualTime.slice(14, 16), 10);
                var shift = _.chain(this.models).filter(function(shift) {
                    var startOrEnd = parseInt("I" === transType ? shift.get("shiftStart") : shift.get("shiftEnd"), 10);
                    var absDiff = Math.abs(actualTimeMins - startOrEnd);
                    var actDiff = actualTimeMins - startOrEnd;
                    shift.set({
                        absDiff: absDiff,
                        actDiff: actDiff
                    });
                    return shift.get("deptShiftID") === _shiftID;
                }).value();
                return shift;
            }
        });
        return Collection;
    }
};

model = Alloy.M("deptShifts", exports.definition, [ function(migration) {
    migration.name = "deptShifts";
    migration.id = "201405121347667";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                deptShiftID: "integer",
                displayName: "text",
                departmentNum: "integer",
                shiftNum: "integer",
                applyDay1: "text",
                applyDay2: "text",
                applyDay3: "text",
                applyDay4: "text",
                applyDay5: "text",
                applyDay6: "text",
                applyDay7: "text",
                shiftStart: "text",
                shiftEnd: "text",
                applyBreak: "text",
                workSpan1: "text",
                breakLength1: "text",
                workSpan2: "text",
                breakLength2: "text",
                inGraceMinutes: "integer",
                earlyIn: "text",
                veryEarlyIn: "text",
                lateIn: "text",
                lateOut: "text",
                veryLateOut: "text",
                earlyOut: "text",
                lateInMins: "integer",
                earlyOutMins: "integer",
                earlyBreakIn: "text",
                autoBreak: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("deptShifts", exports.definition, model);

exports.Model = model;

exports.Collection = collection;