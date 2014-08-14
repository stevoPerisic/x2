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
    this.__controllerPath = "employeeFlow_newEmployee";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.newEmployee = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "newEmployee"
    });
    $.__views.newEmployee && $.addTopLevelView($.__views.newEmployee);
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
    $.__views.newEmployee.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.newEmployee
    });
    $.__views.header.setParent($.__views.newEmployee);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.newEmployee.add($.__views.content);
    $.__views.__alloyId18 = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        layout: "vertical",
        id: "__alloyId18"
    });
    $.__views.content.add($.__views.__alloyId18);
    $.__views.instructions = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "26dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        top: "40dp",
        width: Ti.UI.Fill,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "instructions",
        text: "Please enter your initials:"
    });
    $.__views.__alloyId18.add($.__views.instructions);
    $.__views.txtFieldBtnWrap = Ti.UI.createView({
        top: "20dp",
        height: "60dp",
        width: "60%",
        layout: "horizontal",
        id: "txtFieldBtnWrap"
    });
    $.__views.__alloyId18.add($.__views.txtFieldBtnWrap);
    $.__views.newEmployeeTxtField = Ti.UI.createTextField({
        top: 0,
        left: 0,
        height: "60dp",
        width: "60%",
        color: "#333",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "30dp"
        },
        keyboardType: Ti.UI.KEYBOARD_DEFAULT,
        clearOnEdit: true,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_ALL,
        id: "newEmployeeTxtField",
        hintText: "Enter your initials"
    });
    $.__views.txtFieldBtnWrap.add($.__views.newEmployeeTxtField);
    $.__views.submitNewEmployee = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#fff",
        borderColor: "#62bb47",
        backgroundImage: "none",
        width: "35%",
        left: "5%",
        backgroundColor: "#62bb47",
        borderRadius: 10,
        title: "",
        id: "submitNewEmployee"
    });
    $.__views.txtFieldBtnWrap.add($.__views.submitNewEmployee);
    $.__views.submitNewEmployeeTxt = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#fff",
        width: Ti.UI.SIZE,
        id: "submitNewEmployeeTxt"
    });
    $.__views.submitNewEmployee.add($.__views.submitNewEmployeeTxt);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    try {
        (function() {
            function newEmployeeTxtFieldChange() {
                try {
                    restartTimeout();
                    $.newEmployeeTxtField.removeEventListener("change", newEmployeeTxtFieldChange);
                    initialsChecker = $.newEmployeeTxtField.getValue();
                    if (initialsChecker.length > 4) {
                        $.tooManyChars = CloudClock.customAlert.create({
                            type: "alert",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("alert"),
                            message: CloudClock.customL.strings("newEmp_tooManyChars"),
                            callback: {
                                eType: "click",
                                action: function(_e) {
                                    if (_e.source.id === this.cancel) {
                                        $.newEmployeeTxtField.value = "";
                                        $.newEmployeeTxtField.addEventListener("change", newEmployeeTxtFieldChange);
                                        $.tooManyChars.hide.apply($);
                                        $.newEmployeeTxtField.focus();
                                    }
                                }
                            }
                        });
                        $.newEmployeeTxtField.blur();
                        $.tooManyChars.show.apply($);
                    }
                    $.newEmployeeTxtField.addEventListener("change", newEmployeeTxtFieldChange);
                } catch (error) {
                    CloudClock.error(error);
                }
            }
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "newEmployee", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function updateUI() {
                $.instructions.setText(CloudClock.customL.strings("newEmp_instructions"));
                $.submitNewEmployeeTxt.setText("Submit");
                $.submitNewEmployee.enabled = true;
            }
            function updateHelp() {
                $.header.exit.windowId = "newEmployee";
                $.header.helpButton.employeeLang = "en-US";
                $.header.helpButton.viewNo = "1300";
            }
            function getInitials() {
                function addTheEventBack() {
                    $.submitNewEmployee.addEventListener("click", getInitials);
                    $.submitNewEmployee.enabled = true;
                    $.newEmployeeTxtField.addEventListener("return", getInitials);
                }
                var newEmployeeInitials = "";
                try {
                    $.submitNewEmployee.removeEventListener("click", getInitials);
                    $.submitNewEmployee.enabled = false;
                    $.newEmployeeTxtField.removeEventListener("return", getInitials);
                    newEmployeeInitials = $.newEmployeeTxtField.getValue();
                    var n = newEmployeeInitials.match(/^[A-Za-z]+$/);
                    if (n) if (newEmployeeInitials) {
                        var newEmployee = Alloy.createModel("employees", {
                            badge: 0,
                            pin: newEmployeePin,
                            name: newEmployeeInitials,
                            primaryDeptNum: Ti.App.Properties.getString("DEFAULTDEPTNO"),
                            allowOpenDept: Ti.App.Properties.getString("OPENDEPT") && "1" === Ti.App.Properties.getString("OPENDEPT") ? 1 : 0,
                            byPassBio: 0,
                            requestPTO: 0,
                            scheduleReport: "",
                            replyTo: "0",
                            lang: "en_us",
                            fixPunch: 0,
                            cellPhone: "",
                            cellCarrier: "",
                            email: "",
                            isBioRegistered: 0,
                            type1: "0",
                            type2: "0",
                            photoFileName: "",
                            photoData: ""
                        });
                        $.newEmployeeTxtField.blur();
                        newEmployee.save();
                        $.activityIndicator.setMessage("Saving new employee...");
                        $.activityIndicator.show();
                        Alloy.Collections.employees.fetch({
                            success: function() {
                                $.activityIndicator.hide();
                                $.activityIndicator.setMessage("Loading...");
                            },
                            error: function(collection, response) {
                                CloudClock.log("Error", JSON.stringify(response));
                            }
                        });
                        Alloy.createController("employeeFlow_clockInOut", {
                            employees: [ newEmployee ]
                        });
                        $.newEmployee.close();
                    } else {
                        $.newEmp_alert = CloudClock.customAlert.create({
                            type: "alert",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("alert"),
                            message: CloudClock.customL.strings("newEmp_alert"),
                            callback: {
                                eType: "click",
                                action: function(_e) {
                                    if (_e.source.id === this.cancel) {
                                        $.newEmp_alert.hide.apply($);
                                        addTheEventBack();
                                        $.newEmployeeTxtField.focus();
                                    }
                                }
                            }
                        });
                        $.newEmp_alert.show.apply($);
                    } else {
                        $.invalidChars = CloudClock.customAlert.create({
                            type: "alert",
                            cancel: 0,
                            buttonNames: [ CloudClock.customL.strings("ok") ],
                            title: CloudClock.customL.strings("alert"),
                            message: CloudClock.customL.strings("newEmp_invalidChars"),
                            callback: {
                                eType: "click",
                                action: function(_e) {
                                    if (_e.source.id === this.cancel) {
                                        $.invalidChars.hide.apply($);
                                        addTheEventBack();
                                        $.newEmployeeTxtField.focus();
                                    }
                                }
                            }
                        });
                        $.newEmployeeTxtField.blur();
                        $.invalidChars.show.apply($);
                    }
                } catch (error) {
                    CloudClock.error(error);
                }
            }
            function changeColor(e) {
                e.source.setBackgroundColor("#34aadc");
                e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#62bb47";
            }
            function destroy() {
                $.newEmployee.removeEventListener("touchstart", restartTimeout);
                $.newEmployee.removeEventListener("close", destroy);
                $.submitNewEmployee.removeEventListener("touchstart", changeColor);
                $.submitNewEmployee.removeEventListener("touchend", changeColor);
                $.submitNewEmployee.removeEventListener("click", getInitials);
                $.newEmployeeTxtField.removeEventListener("return", getInitials);
                $.newEmployeeTxtField.removeEventListener("change", newEmployeeTxtFieldChange);
                $.destroy();
                $.newEmployee.removeAllChildren();
                $.destroy();
                $ = null;
            }
            function addListeners() {
                $.newEmployee.addEventListener("open", function() {
                    restartTimeout();
                    $.newEmployeeTxtField.focus();
                    Alloy.Collections.deviceHelp.audioPlayer.play();
                });
                $.newEmployee.addEventListener("close", destroy);
                $.newEmployee.addEventListener("touchstart", restartTimeout);
                $.submitNewEmployee.addEventListener("touchstart", changeColor);
                $.submitNewEmployee.addEventListener("touchend", changeColor);
                $.submitNewEmployee.addEventListener("click", getInitials);
                $.newEmployeeTxtField.addEventListener("return", getInitials);
                $.newEmployeeTxtField.addEventListener("change", newEmployeeTxtFieldChange);
            }
            var newEmployeePin = args.newEmployeePin;
            var initialsChecker = "";
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1202";
            addListeners();
            updateUI();
            updateHelp();
            CloudClock.screenTimeout._context = $;
            $.newEmployee.open();
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;