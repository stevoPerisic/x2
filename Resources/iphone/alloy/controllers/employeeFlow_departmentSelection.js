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
    this.__controllerPath = "employeeFlow_departmentSelection";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.departmentSelection = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "departmentSelection"
    });
    $.__views.departmentSelection && $.addTopLevelView($.__views.departmentSelection);
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
    $.__views.departmentSelection.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.departmentSelection
    });
    $.__views.header.setParent($.__views.departmentSelection);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.departmentSelection.add($.__views.content);
    $.__views.openDepts = Ti.UI.createView({
        layout: "horizontal",
        visible: false,
        id: "openDepts"
    });
    $.__views.content.add($.__views.openDepts);
    $.__views.sidebar = Ti.UI.createView({
        width: "30%",
        layout: "vertical",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        backgroundColor: "#fcfcfc",
        id: "sidebar"
    });
    $.__views.openDepts.add($.__views.sidebar);
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
        borderWidth: 1,
        borderColor: "#e4e4e4",
        id: "sidebarHeader"
    });
    $.__views.sidebar.add($.__views.sidebarHeader);
    $.__views.badgeWrap = Ti.UI.createView({
        left: 0,
        height: "630dp",
        layout: "vertical",
        backgroundColor: "#f0f0f0",
        id: "badgeWrap"
    });
    $.__views.sidebar.add($.__views.badgeWrap);
    $.__views.mostUsedLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: 5,
        width: "90%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "mostUsedLbl",
        text: "Most Used"
    });
    $.__views.badgeWrap.add($.__views.mostUsedLbl);
    $.__views.mostUsed = Ti.UI.createView({
        top: 0,
        height: "90dp",
        id: "mostUsed"
    });
    $.__views.badgeWrap.add($.__views.mostUsed);
    $.__views.lastUsedLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: 5,
        width: "90%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "lastUsedLbl",
        text: "Last Used"
    });
    $.__views.badgeWrap.add($.__views.lastUsedLbl);
    $.__views.lastUsed = Ti.UI.createView({
        top: 0,
        height: "90dp",
        id: "lastUsed"
    });
    $.__views.badgeWrap.add($.__views.lastUsed);
    $.__views.__alloyId12 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: 5,
        width: "90%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        text: "Search Results",
        id: "__alloyId12"
    });
    $.__views.badgeWrap.add($.__views.__alloyId12);
    $.__views.sideBarDeptBadgeWrap = Ti.UI.createScrollView({
        left: 0,
        height: "630dp",
        layout: "vertical",
        scrollType: "vertical",
        contentHeight: "1700dp",
        showHorizontalScrollIndicator: false,
        showVerticalScrollIndicator: true,
        backgroundColor: "#f0f0f0",
        id: "sideBarDeptBadgeWrap"
    });
    $.__views.badgeWrap.add($.__views.sideBarDeptBadgeWrap);
    $.__views.sideBarBadgeHolder = Ti.UI.createView({
        layout: "vertical",
        backgroundColor: "#f0f0f0",
        top: 0,
        height: "1700dp",
        width: "100%",
        id: "sideBarBadgeHolder"
    });
    $.__views.sideBarDeptBadgeWrap.add($.__views.sideBarBadgeHolder);
    $.__views.enterDepartment = Ti.UI.createView({
        width: "70%",
        layout: "vertical",
        id: "enterDepartment"
    });
    $.__views.openDepts.add($.__views.enterDepartment);
    $.__views.contentHeader = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        top: 0,
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
        borderWidth: 1,
        borderColor: "#e4e4e4",
        id: "contentHeader"
    });
    $.__views.enterDepartment.add($.__views.contentHeader);
    $.__views.pinPadWrap = Ti.UI.createView({
        width: "80%",
        id: "pinPadWrap"
    });
    $.__views.enterDepartment.add($.__views.pinPadWrap);
    $.__views.pinPad = Alloy.createWidget("pinPad", "widget", {
        id: "pinPad",
        __parentSymbol: $.__views.pinPadWrap
    });
    $.__views.pinPad.setParent($.__views.pinPadWrap);
    $.__views.departments = Ti.UI.createView({
        top: 0,
        layout: "vertical",
        width: "100%",
        visible: false,
        id: "departments"
    });
    $.__views.content.add($.__views.departments);
    $.__views.chooseDepartmentInstructions = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "25dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "40dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        backgroundColor: "#fcfcfc",
        id: "chooseDepartmentInstructions"
    });
    $.__views.departments.add($.__views.chooseDepartmentInstructions);
    $.__views.deptBadgeWrap = Ti.UI.createScrollView({
        left: 0,
        height: "600dp",
        layout: "horizontal",
        scrollType: "horizontal",
        contentWidth: "1700dp",
        showHorizontalScrollIndicator: true,
        showVerticalScrollIndicator: false,
        backgroundColor: "#fcfcfc",
        id: "deptBadgeWrap"
    });
    $.__views.departments.add($.__views.deptBadgeWrap);
    $.__views.badgeHolder = Ti.UI.createView({
        layout: "horizontal",
        backgroundColor: "#fcfcfc",
        top: 10,
        height: "580dp",
        width: "1700dp",
        id: "badgeHolder"
    });
    $.__views.deptBadgeWrap.add($.__views.badgeHolder);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    try {
        (function() {
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "departmentSelection", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function destroy() {
                $.destroy();
                $.departmentSelection.removeAllChildren();
                $.departmentSelection.removeEventListener("close", destroy);
                $.departmentSelection.removeEventListener("touchstart", restartTimeout);
                department = null;
                departmentBadgeProps = null;
                departmentsSelection = null;
                departmentsSelectionLength = null;
                employeeDepartments = null;
                softScheduling = null;
                previousClockIns = null;
                sessionObj = null;
                $ = null;
            }
            function emptyFn(e) {
                e.source.removeEventListener("doubletap", emptyFn);
                return false;
            }
            function changeLabelColor(e) {
                e.source.removeEventListener(e.type, changeLabelColor);
                e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
            }
            function applyDeptNum(_departmentNum) {
                sessionObj.currentPunch.departmentNum = _departmentNum;
                if (checkRestrictions()) {
                    sessionObj.nextWindow = "";
                    CloudClock.dispatcher.nextWindow({
                        context: $
                    });
                }
            }
            function departmentSelected(e) {
                function alertAndReset() {
                    $.openDepartmentAlert = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("openDept_alert"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.pinPad.clearPinPadTxtField();
                                    $.pinPad.addBtnEvents();
                                    $.openDepartmentAlert.hide.apply($);
                                }
                            }
                        }
                    });
                    $.openDepartmentAlert.show.apply($);
                }
                var departmentNum = false;
                try {
                    if ("pinPadTxtField" === e.id) {
                        departmentNum = e.value;
                        var n = departmentNum.match(/[0-9]/g);
                        var match;
                        if (n) {
                            console.log("this is a valid entry");
                            departmentNum = parseInt(departmentNum, 10);
                            match = Alloy.Collections.departments.filter(function(department) {
                                return department.get("departmentNum") === departmentNum || department.get("departmentCode") === departmentNum;
                            });
                            0 === match.length ? alertAndReset() : applyDeptNum(match[0].get("departmentNum"));
                        } else {
                            console.log("this is an invalid entry");
                            alertAndReset();
                        }
                    } else if ("submitOpenDept" === e.source.id && false === departmentNum) alertAndReset(); else {
                        departmentNum = e.source.deptNumber;
                        applyDeptNum(departmentNum);
                    }
                } catch (error) {
                    CloudClock.error(error);
                }
            }
            function checkRestrictions() {
                if (CloudClock.punchRestrictions.inPunch()) {
                    console.log("No restrictions!");
                    return true;
                }
                console.log("Yes restrictions!");
                if (3 === sessionObj.restrictionDialog) {
                    var untilCanGoBackIn = clockInOut.restrictionINOUT - sessionObj.difference;
                    $.restrictionINOUT_dialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("cantGoBackIn") + moment(untilCanGoBackIn).format("mm [minutes.]"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.restrictionINOUT_dialog.hide.apply($);
                                    CloudClock.sessionObj.clearSession();
                                    CloudClock.clock.showEmployeeFlowDialog = false;
                                    Alloy.createController("index", {
                                        doNotSetParams: true
                                    });
                                    $.departmentSelection.close();
                                }
                            }
                        }
                    });
                    $.restrictionINOUT_dialog.show.apply($);
                } else {
                    $.restrictionIN_dialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("alreadyClockedIn") + CloudClock.buttonLabelTime(sessionObj.last_inPunch.transDateTime).format("h:mm a"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.restrictionIN_dialog.hide.apply($);
                                    CloudClock.sessionObj.clearSession();
                                    CloudClock.clock.showEmployeeFlowDialog = false;
                                    Alloy.createController("index", {
                                        doNotSetParams: true
                                    });
                                    $.departmentSelection.close();
                                }
                            }
                        }
                    });
                    $.restrictionIN_dialog.show.apply($);
                }
                return false;
            }
            function addEvents() {
                $.departmentSelection.addEventListener("close", destroy);
                $.departmentSelection.addEventListener("open", function() {
                    restartTimeout();
                    Alloy.Collections.deviceHelp.audioPlayer.play();
                });
                $.departmentSelection.addEventListener("touchstart", restartTimeout);
                $.pinPadWrap.addEventListener("touchend", function() {
                    $.badgeWrap.remove($.lastUsedLbl);
                    $.badgeWrap.remove($.lastUsed);
                    $.badgeWrap.remove($.mostUsedLbl);
                    $.badgeWrap.remove($.mostUsed);
                });
            }
            function updateUI() {
                function createDeptBadge(_parent, _departmentsLength, _departmentsSelection) {
                    for (var i = 0; _departmentsLength > i; i++) {
                        var department = _.isArray(_departmentsSelection[i]) ? _departmentsSelection[i][0] : _departmentsSelection[i];
                        var departmentBadge = Ti.UI.createLabel(departmentBadgeProps);
                        var deptNum = department.get("departmentNum").toString();
                        if (deptNum.length != Ti.App.Properties.getString("DEPTCODELEN").length) {
                            var diffInLength = Ti.App.Properties.getString("DEPTCODELEN").length - deptNum.length;
                            for (var j = 0; diffInLength > j; j++) deptNum = "0" + deptNum;
                        }
                        var deptName = department.get("name");
                        var n = deptName.match(/(\w+)/g);
                        if (n) {
                            deptName = "";
                            _.each(n, function(word, k) {
                                deptName = 2 === k ? deptName + "\n" + word : deptName + " " + word;
                            });
                        }
                        departmentBadge.text = deptName + " (" + deptNum + ")";
                        departmentBadge.deptNumber = department.get("departmentNum");
                        departmentBadge.addEventListener("touchstart", changeLabelColor);
                        departmentBadge.addEventListener("touchend", changeLabelColor);
                        departmentBadge.addEventListener("click", departmentSelected);
                        departmentBadge.addEventListener("doubletap", emptyFn);
                        _parent.add(departmentBadge);
                        departmentBadge = null;
                    }
                    _departmentsSelection = null;
                    $.activityIndicator.hide();
                }
                function reduceDepartments(e) {
                    $.activityIndicator.show();
                    var pinPadEntry = e.value;
                    var departments = "0" !== USEDEPTCODE ? Alloy.Collections.departments.filter(function(department) {
                        var code = department.get("departmentCode").toString();
                        if (DEPTCODELEN > code.length) {
                            var diffInLength = DEPTCODELEN.length - code.length;
                            for (var j = 0; diffInLength > j; j++) code = "0" + code;
                        }
                        return -1 !== code.indexOf(pinPadEntry);
                    }) : Alloy.Collections.departments.filter(function(department) {
                        var num = department.get("departmentNum").toString();
                        if (DEPTNUMLEN > num.length) {
                            var diffInLength = DEPTNUMLEN - num.length;
                            for (var j = 0; diffInLength > j; j++) num = "0" + num;
                        }
                        return -1 !== num.indexOf(pinPadEntry);
                    });
                    departments = departments.slice(0, 9);
                    $.sideBarBadgeHolder.removeAllChildren();
                    createDeptBadge($.sideBarBadgeHolder, departments.length, departments);
                }
                var USEDEPTCODE = Ti.App.Properties.getString("USEDEPTCODE");
                var DEPTCODELEN = Ti.App.Properties.getString("DEPTCODELEN");
                var DEPTNUMLEN = 3;
                var OPENDEPT = Ti.App.Properties.getString("OPENDEPT");
                $.header.helpButton.show();
                department.length > 0 && departmentsSelection.push(department);
                _.each(employeeDepartments, function(department) {
                    var temp = Alloy.Collections.departments.where({
                        departmentNum: department.get("departmentNum")
                    });
                    temp.length > 0 && departmentsSelection.push(temp);
                });
                var departmentsSelectionLength = departmentsSelection.length;
                var departmentBadgeProps = {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#e4e4e4",
                    font: {
                        fontSize: "22dp",
                        fontWeight: "bold"
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                    color: "#333"
                };
                if ("1" === OPENDEPT || "1" === sessionObj.employee.get("allowOpenDept") || 1 === sessionObj.employee.get("allowOpenDept")) {
                    Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1401";
                    $.content.remove($.departments);
                    $.pinPad.changeMode({
                        mode: "openDepartment",
                        reduceDepartments: reduceDepartments
                    });
                    $.pinPad.pinPadTxtField.addEventListener("change", restartTimeout);
                    $.openDepts.setVisible(true);
                    $.sidebarHeader.setText(CloudClock.customL.strings("openDept_sidebarHeader"));
                    $.contentHeader.setText(CloudClock.customL.strings("openDept_contentHeader"));
                    $.header.helpButton.applyProperties({
                        employeeLang: Ti.App.Properties.getString("CURRLANGUAGETYPE"),
                        viewNo: "1801"
                    });
                    _.extend(departmentBadgeProps, {
                        top: 10,
                        left: "5%",
                        height: "70dp",
                        width: "90%",
                        borderRadius: 10,
                        borderColor: "#34aadc",
                        font: {
                            fontSize: "16dp",
                            fontWeight: "bold"
                        }
                    });
                    if (0 === lastUsedDept.length) {
                        $.badgeWrap.remove($.lastUsedLbl);
                        $.badgeWrap.remove($.lastUsed);
                    } else createDeptBadge($.lastUsed, lastUsedDept.length, lastUsedDept);
                    if (0 === mostUsedDept.length) {
                        $.badgeWrap.remove($.mostUsedLbl);
                        $.badgeWrap.remove($.mostUsed);
                    } else createDeptBadge($.mostUsed, mostUsedDept.length, mostUsedDept);
                } else {
                    Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1400";
                    if (0 === departmentsSelectionLength) {
                        $.openDepartmentAlert2 = CloudClock.customAlert.create({
                            type: "alert",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("alert"),
                            message: CloudClock.customL.strings("openDept_alert"),
                            callback: {
                                eType: "click",
                                action: function(_e) {
                                    if (_e.source.id === this.cancel) {
                                        $.openDepartmentAlert2.hide.apply($);
                                        CloudClock.clock.showEmployeeFlowDialog = false;
                                        CloudClock.sessionObj.clearSession();
                                        Alloy.createController("index", {
                                            doNotSetParams: true
                                        });
                                        $.departmentSelection.close();
                                    }
                                }
                            }
                        });
                        $.openDepartmentAlert2.show.apply($);
                        return false;
                    }
                    $.content.remove($.openDepts);
                    $.departments.setVisible(true);
                    $.header.helpButton.applyProperties({
                        employeeLang: Ti.App.Properties.getString("CURRLANGUAGETYPE"),
                        viewNo: "1802"
                    });
                    $.chooseDepartmentInstructions.setText(CloudClock.customL.strings("dept_instructions"));
                    if (6 > departmentsSelectionLength) {
                        $.deptBadgeWrap.contentWidth = "100%";
                        $.badgeHolder.layout = "vertical";
                        $.badgeHolder.width = "100%";
                        _.extend(departmentBadgeProps, {
                            top: "20dp",
                            left: "25%",
                            height: "90dp",
                            width: "50%",
                            borderRadius: 5
                        });
                    } else {
                        $.deptBadgeWrap.contentWidth = 470 * Math.ceil(departmentsSelectionLength / 5) + "dp";
                        $.badgeHolder.width = $.deptBadgeWrap.contentWidth;
                        _.extend(departmentBadgeProps, {
                            top: "20dp",
                            left: "20dp",
                            height: "90dp",
                            width: "450dp",
                            borderRadius: 5
                        });
                    }
                    createDeptBadge($.badgeHolder, departmentsSelectionLength, departmentsSelection);
                }
            }
            var softScheduling = require("softScheduling");
            var sessionObj = CloudClock.sessionObj;
            var department = Alloy.Collections.departments.where({
                departmentNum: sessionObj.employee.get("primaryDeptNum")
            });
            var employeeDepartments = Alloy.Collections.employeeDepartments.where({
                badge: sessionObj.employee.get("badge")
            });
            var previousClockIns = Alloy.Collections.clockHistory.getPreviousClockIns(sessionObj.employee.get("alloy_id"));
            var departmentsSelection = [];
            var lastUsedDept = Alloy.Collections.departments.where({
                departmentNum: sessionObj.last_inPunch.departmentNum
            });
            0 === lastUsedDept.length && console.log("We have a problem");
            var mostUsedDept = Alloy.Collections.departments.where({
                departmentNum: sessionObj.employee.get("mostUsedDeptNum")
            });
            0 === mostUsedDept.length && console.log("No most used dept..");
            addEvents();
            updateUI();
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;