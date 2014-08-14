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
    this.__controllerPath = "employeeFlow_selectEmployee";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.selectEmployeeWin = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "selectEmployeeWin"
    });
    $.__views.selectEmployeeWin && $.addTopLevelView($.__views.selectEmployeeWin);
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
    $.__views.selectEmployeeWin.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.selectEmployeeWin
    });
    $.__views.header.setParent($.__views.selectEmployeeWin);
    $.__views.content = Ti.UI.createView({
        top: "8%",
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "content"
    });
    $.__views.selectEmployeeWin.add($.__views.content);
    $.__views.selectEmployeeWrap = Ti.UI.createView({
        width: "100%",
        layout: "horizontal",
        id: "selectEmployeeWrap"
    });
    $.__views.content.add($.__views.selectEmployeeWrap);
    $.__views.notListedSidebar = Ti.UI.createView({
        width: "33%",
        height: "100%",
        backgroundColor: "#e4e4e4",
        id: "notListedSidebar"
    });
    $.__views.selectEmployeeWrap.add($.__views.notListedSidebar);
    $.__views.notListed = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#fff",
        borderColor: "#ccc",
        backgroundImage: "none",
        top: "40dp",
        width: "80%",
        borderRadius: 10,
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
            colors: [ "#fff", "#e4e4e4" ],
            backFillStart: false
        },
        title: "",
        id: "notListed"
    });
    $.__views.notListedSidebar.add($.__views.notListed);
    $.__views.notListedLabel = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "notListedLabel"
    });
    $.__views.notListed.add($.__views.notListedLabel);
    $.__views.selectEmployee = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: "66%",
        layout: "vertical",
        id: "selectEmployee"
    });
    $.__views.selectEmployeeWrap.add($.__views.selectEmployee);
    $.__views.confirmIdentity = Ti.UI.createLabel({
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
        id: "confirmIdentity"
    });
    $.__views.selectEmployee.add($.__views.confirmIdentity);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    try {
        (function() {
            function emptyFn() {
                return false;
            }
            function notListedClick() {
                if ("0" === Ti.App.Properties.getString("ALLOWCROSSPUNCH")) {
                    $.contactManagerDialog = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("contact_manager"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.header.exit.fireEvent("click");
                                    $.contactManagerDialog.hide.apply($);
                                }
                            }
                        }
                    });
                    $.contactManagerDialog.show.apply($);
                } else {
                    Alloy.createController("employeeFlow_newEmployee", {
                        newEmployeePin: employees[0].get("pin")
                    });
                    $.selectEmployeeWin.close();
                }
            }
            function changeColor(e) {
                e.source.setBackgroundColor("#34aadc");
            }
            function restartTimeout() {
                CloudClock.screenTimeout.restartTimeout("employeeFlow", "selectEmployeeWin", $.header.exit);
                CloudClock.clock.showEmployeeFlowDialog = true;
            }
            function updateHelp() {
                $.header.helpButton.show();
                $.header.helpButton.employeeLang = "en-US";
                $.header.helpButton.viewNo = "1200";
            }
            function updateUI() {
                $.notListedLabel.setText(CloudClock.customL.strings("not_listed"));
                $.confirmIdentity.setText(CloudClock.customL.strings("confirm_id"));
            }
            function destroy() {
                $.selectEmployeeWin.removeEventListener("touchstart", restartTimeout);
                $.selectEmployeeWin.removeEventListener("close", destroy);
                $.notListed.removeEventListener("click", notListedClick);
                $.notListed.removeEventListener("touchstart", changeColor);
                $.notListed.removeEventListener("touchend", changeColor);
                $.destroy();
                $.selectEmployeeWin.removeAllChildren();
                $ = null;
            }
            function addListeners() {
                $.selectEmployeeWin.addEventListener("open", Alloy.Collections.deviceHelp.audioPlayer.play);
                $.selectEmployeeWin.addEventListener("touchstart", restartTimeout);
                $.selectEmployeeWin.addEventListener("close", destroy);
                $.notListed.addEventListener("click", notListedClick);
                $.notListed.addEventListener("touchstart", changeColor);
                $.notListed.addEventListener("touchend", changeColor);
            }
            function selectEmployeeClick(e) {
                try {
                    e.source.removeEventListener("click", selectEmployeeClick);
                    Ti.App.Properties.setString("CURRLANGUAGETYPE", e.source.language);
                    var employeeToPass = Alloy.Collections.employees.get(e.source.employee);
                    Alloy.createController("employeeFlow_clockInOut", {
                        employees: [ employeeToPass ]
                    });
                    $.selectEmployeeWin.close();
                } catch (error) {
                    console.log("\n\n\nError in select employee badge evt: " + error);
                    CloudClock.error(error);
                }
            }
            function employeeBadgeChangeColor(e) {
                var badge = e.source.getParent();
                var children = badge.getChildren();
                if ("touchstart" === e.type) {
                    badge.setBackgroundColor("#e4e4e4");
                    children[1].setBackgroundColor("#fff");
                    children[2].setColor("#fff");
                } else {
                    badge.setBackgroundColor("#fff");
                    children[1].setBackgroundColor("#e4e4e4");
                    children[2].setColor("#333");
                }
                badge = null;
                children = null;
            }
            function createBadges() {
                _.each(employees, function(employee) {
                    var selectEmployeeBadge = Ti.UI.createView({
                        top: "20dp",
                        width: "80%",
                        height: "100dp",
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        borderWidth: "1dp",
                        borderColor: "#e4e4e4"
                    });
                    var overlayForClick = Ti.UI.createLabel({
                        top: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                        zIndex: 2,
                        language: employee.get("lang"),
                        employee: employee.id
                    });
                    var localPhotoFileName = employee.get("photoFileName");
                    var selectEmployeeBadgeImg = Ti.UI.createImageView({
                        height: "80dp",
                        width: "80dp",
                        left: "10dp",
                        top: "10dp",
                        bubbleParent: false
                    });
                    0 === localPhotoFileName.indexOf("/images/icons/") ? selectEmployeeBadgeImg.setImage(localPhotoFileName) : CloudClock.getLocalPhoto(selectEmployeeBadgeImg, localPhotoFileName);
                    var selectEmployeeBadgeDivider = Ti.UI.createView({
                        width: "1dp",
                        height: "80dp",
                        top: "10dp",
                        left: "100dp",
                        backgroundColor: "#e4e4e4",
                        bubbleParent: false
                    });
                    var selectEmployeeBadgeLabel = Ti.UI.createLabel({
                        left: "120dp",
                        font: {
                            fontSize: "22dp",
                            fontWeight: "bold"
                        },
                        text: employee.get("name") + " (" + employee.get("badge") + ")",
                        color: "#333",
                        bubbleParent: false
                    });
                    selectEmployeeBadge.add(selectEmployeeBadgeImg);
                    selectEmployeeBadge.add(selectEmployeeBadgeDivider);
                    selectEmployeeBadge.add(selectEmployeeBadgeLabel);
                    selectEmployeeBadge.add(overlayForClick);
                    overlayForClick.addEventListener("doubletap", emptyFn);
                    overlayForClick.addEventListener("click", selectEmployeeClick);
                    overlayForClick.addEventListener("touchstart", employeeBadgeChangeColor);
                    overlayForClick.addEventListener("touchend", employeeBadgeChangeColor);
                    $.selectEmployee.add(selectEmployeeBadge);
                    selectEmployeeBadgeLabel = null;
                    selectEmployeeBadgeDivider = null;
                    selectEmployeeBadgeImg = null;
                    selectEmployeeBadge = null;
                });
            }
            var employees = args.employees;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1201";
            addListeners();
            updateHelp();
            updateUI();
            createBadges();
            CloudClock.screenTimeout._context = $;
            restartTimeout();
            $.selectEmployeeWin.open();
        })();
    } catch (error) {
        CloudClock.error(error);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;