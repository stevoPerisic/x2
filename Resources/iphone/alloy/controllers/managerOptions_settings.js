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
    this.__controllerPath = "managerOptions_settings";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.managerOptionsSettings = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "managerOptionsSettings"
    });
    $.__views.managerOptionsSettings && $.addTopLevelView($.__views.managerOptionsSettings);
    $.__views.contentHeader = Ti.UI.createView({
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
        borderWidth: 1,
        borderColor: "#e4e4e4",
        id: "contentHeader"
    });
    $.__views.managerOptionsSettings.add($.__views.contentHeader);
    $.__views.back = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#ffffff",
        borderColor: "#1c1d1c",
        backgroundImage: "none",
        borderWidth: 0,
        width: "160dp",
        left: 0,
        title: "",
        id: "back"
    });
    $.__views.contentHeader.add($.__views.back);
    $.__views.__alloyId56 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/1_navigation_previous_item.png",
        id: "__alloyId56"
    });
    $.__views.back.add($.__views.__alloyId56);
    $.__views.backLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: 18,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Back",
        id: "backLbl"
    });
    $.__views.back.add($.__views.backLbl);
    $.__views.managerSettingsHeaderTxt = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "managerSettingsHeaderTxt",
        text: "Clock Settings"
    });
    $.__views.contentHeader.add($.__views.managerSettingsHeaderTxt);
    $.__views.sendLogs = Ti.UI.createButton({
        height: "44dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        borderWidth: 1,
        right: "10dp",
        width: "120dp",
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
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "",
        id: "sendLogs"
    });
    $.__views.contentHeader.add($.__views.sendLogs);
    $.__views.sendLogsLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "16dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: "10dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Send Logs",
        id: "sendLogsLbl"
    });
    $.__views.sendLogs.add($.__views.sendLogsLbl);
    $.__views.clockSettingsTableWrap = Ti.UI.createView({
        top: "80dp",
        width: "90%",
        layout: "vertical",
        id: "clockSettingsTableWrap"
    });
    $.__views.managerOptionsSettings.add($.__views.clockSettingsTableWrap);
    var __alloyId57 = [];
    $.__views.hostURL = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        selectedColor: "#000",
        height: "44dp",
        id: "hostURL"
    });
    __alloyId57.push($.__views.hostURL);
    $.__views.hostURL_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "hostURL_title",
        text: "Host URL"
    });
    $.__views.hostURL.add($.__views.hostURL_title);
    $.__views.hostURLLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "hostURLLbl"
    });
    $.__views.hostURL.add($.__views.hostURLLbl);
    $.__views.terminalId = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        selectedColor: "#000",
        height: "44dp",
        id: "terminalId"
    });
    __alloyId57.push($.__views.terminalId);
    $.__views.terminalId_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "terminalId_title",
        text: "Terminal ID"
    });
    $.__views.terminalId.add($.__views.terminalId_title);
    $.__views.terminalIdLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#00a6d5",
        right: "40dp",
        id: "terminalIdLbl"
    });
    $.__views.terminalId.add($.__views.terminalIdLbl);
    $.__views.terminalIdArrow = Ti.UI.createImageView({
        right: "5dp",
        id: "terminalIdArrow",
        image: "images/icons/1_navigation_next_item.png"
    });
    $.__views.terminalId.add($.__views.terminalIdArrow);
    $.__views.terminalIdTxtField = Ti.UI.createTextField({
        right: "5%",
        height: "44dp",
        width: "60%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
        color: "#333",
        id: "terminalIdTxtField",
        hintText: "Enter New Terminal ID"
    });
    $.__views.terminalId.add($.__views.terminalIdTxtField);
    $.__views.version = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        selectedColor: "#000",
        height: "44dp",
        id: "version"
    });
    __alloyId57.push($.__views.version);
    $.__views.version_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "version_title",
        text: "Version"
    });
    $.__views.version.add($.__views.version_title);
    $.__views.versionLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "versionLbl"
    });
    $.__views.version.add($.__views.versionLbl);
    $.__views.device = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        selectedColor: "#000",
        height: "44dp",
        id: "device"
    });
    __alloyId57.push($.__views.device);
    $.__views.device_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "device_title",
        text: "Device"
    });
    $.__views.device.add($.__views.device_title);
    $.__views.deviceLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "deviceLbl"
    });
    $.__views.device.add($.__views.deviceLbl);
    $.__views.timezone = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        selectedColor: "#000",
        height: "44dp",
        id: "timezone"
    });
    __alloyId57.push($.__views.timezone);
    $.__views.timezone_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "timezone_title",
        text: "Timezone"
    });
    $.__views.timezone.add($.__views.timezone_title);
    $.__views.timezoneLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "timezoneLbl"
    });
    $.__views.timezone.add($.__views.timezoneLbl);
    $.__views.lastConnect = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        selectedColor: "#000",
        height: "44dp",
        id: "lastConnect"
    });
    __alloyId57.push($.__views.lastConnect);
    $.__views.lastConnect_title = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "lastConnect_title",
        text: "Last Connect"
    });
    $.__views.lastConnect.add($.__views.lastConnect_title);
    $.__views.lastConnectLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "lastConnectLbl"
    });
    $.__views.lastConnect.add($.__views.lastConnectLbl);
    $.__views.clockSettings = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "288dp",
        data: __alloyId57,
        id: "clockSettings"
    });
    $.__views.clockSettingsTableWrap.add($.__views.clockSettings);
    $.__views.__alloyId58 = Ti.UI.createView({
        width: "100%",
        height: "186dp",
        layout: "horizontal",
        id: "__alloyId58"
    });
    $.__views.clockSettingsTableWrap.add($.__views.__alloyId58);
    $.__views.quickUpdate = Ti.UI.createButton({
        height: "88dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        borderWidth: 1,
        right: "2%",
        width: "32%",
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
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "",
        id: "quickUpdate"
    });
    $.__views.__alloyId58.add($.__views.quickUpdate);
    $.__views.__alloyId59 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "16dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: "30dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Quick Update",
        id: "__alloyId59"
    });
    $.__views.quickUpdate.add($.__views.__alloyId59);
    $.__views.lastQUPDATE = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        id: "lastQUPDATE"
    });
    $.__views.quickUpdate.add($.__views.lastQUPDATE);
    $.__views.longUpdate = Ti.UI.createButton({
        height: "88dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        borderWidth: 1,
        right: "2%",
        width: "32%",
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
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "",
        id: "longUpdate"
    });
    $.__views.__alloyId58.add($.__views.longUpdate);
    $.__views.__alloyId60 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "16dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: "30dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Long Update",
        id: "__alloyId60"
    });
    $.__views.longUpdate.add($.__views.__alloyId60);
    $.__views.lastLUPDATE = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        id: "lastLUPDATE"
    });
    $.__views.longUpdate.add($.__views.lastLUPDATE);
    $.__views.viewLogs = Ti.UI.createButton({
        height: "88dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        borderWidth: 1,
        right: 0,
        width: "32%",
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
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "",
        id: "viewLogs"
    });
    $.__views.__alloyId58.add($.__views.viewLogs);
    $.__views.__alloyId61 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "16dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: "30dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "View Logs",
        id: "__alloyId61"
    });
    $.__views.viewLogs.add($.__views.__alloyId61);
    $.__views.send_CSV = Ti.UI.createButton({
        height: "88dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        borderWidth: 1,
        right: "2%",
        width: "32%",
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
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        top: "10dp",
        title: "",
        id: "send_CSV"
    });
    $.__views.__alloyId58.add($.__views.send_CSV);
    $.__views.__alloyId62 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "16dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#000",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        top: "30dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Send CSV",
        id: "__alloyId62"
    });
    $.__views.send_CSV.add($.__views.__alloyId62);
    $.__views.logsTableViewWrap = Ti.UI.createView({
        top: "80dp",
        width: 0,
        id: "logsTableViewWrap"
    });
    $.__views.managerOptionsSettings.add($.__views.logsTableViewWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info("Args Data: " + JSON.stringify(args.data));
    (function() {
        function showTextBox() {
            if (true === Ti.Network.online) {
                $.terminalIdLbl.hide();
                $.terminalIdArrow.hide();
                $.terminalIdTxtField.show();
                $.terminalIdTxtField.focus();
            } else alertNoNetwork();
        }
        function resetTextField() {
            $.terminalIdTxtField.value = "";
            $.terminalIdTxtField.blur();
            $.terminalIdTxtField.hide();
            $.terminalIdLbl.show();
            $.terminalIdArrow.show();
        }
        function changeTerminal() {
            newTerminalID = $.terminalIdTxtField.getValue();
            if (newTerminalID.length > 0) {
                newTerminalID = newTerminalID.replace(/\D/g, "");
                if (newTerminalID.length > 10 || 10 > newTerminalID.length) {
                    $.notEnoughDigits = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("notEnoughDigits"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    $.notEnoughDigits.hide.apply(CloudClock.managerOptions);
                                    resetTextField();
                                }
                            }
                        }
                    });
                    $.notEnoughDigits.show.apply(CloudClock.managerOptions);
                } else {
                    $.changeTerminalDialog = CloudClock.customAlert.create({
                        type: "warning",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("no"), CloudClock.customL.strings("yes") ],
                        title: CloudClock.customL.strings("warning"),
                        message: CloudClock.customL.strings("terminalId_warning"),
                        callback: {
                            eType: "click",
                            action: changeTerminalDialog_click
                        }
                    });
                    $.changeTerminalDialog.show.apply(CloudClock.managerOptions);
                }
            } else resetTextField();
        }
        function clearFlowTimeout() {
            $.terminalIdTxtField.removeEventListener("change", clearFlowTimeout);
            CloudClock.screenTimeout.restartTimeout("managerOptions", "managerOptions", CloudClock.managerOptions.header.exit);
            CloudClock.clock.showManagerOptionsDialog = true;
            $.terminalIdTxtField.addEventListener("change", clearFlowTimeout);
        }
        function changeTerminalDialog_click(e) {
            if (e.source.id === this.cancel) {
                resetTextField();
                $.changeTerminalDialog.hide.apply(CloudClock.managerOptions);
            } else {
                $.changeTerminalDialog.hide.apply(CloudClock.managerOptions);
                CloudClock.screenTimeout.restartTimeout("managerOptions", "managerOptions", CloudClock.managerOptions.header.exit);
                CloudClock.clock.showManagerOptionsDialog = false;
                $.destroy();
                CloudClock.managerOptions.reIntialize = {
                    reInit: true,
                    terminalID: parseInt(newTerminalID, 10)
                };
                CloudClock.managerOptions.managerOptions.close();
            }
        }
        function longUpdate() {
            if (true === Ti.Network.online) {
                $.longUpdate.removeEventListener("click", longUpdate);
                CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.show();
                CloudClock.maintenace_cfg.params.messageType = "INIT";
                CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                CloudClock.api.request(CloudClock.maintenace_cfg);
                $.longUpdate.addEventListener("click", longUpdate);
            } else alertNoNetwork();
        }
        function runTransactions() {
            if (true === Ti.Network.online) {
                $.quickUpdate.removeEventListener("click", runTransactions);
                CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.show();
                Alloy.Collections.transactions.sendTransactions();
                console.log("REQUEST MAINTENACE");
                CloudClock.maintenace_cfg.params.messageType = "MAINT";
                CloudClock.maintenace_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                CloudClock.api.request(CloudClock.maintenace_cfg);
                $.quickUpdate.addEventListener("click", runTransactions);
            } else alertNoNetwork();
        }
        function goback() {
            $.back.removeEventListener("click", goback);
            $.logsTableViewWrap.removeAllChildren();
            $.logsTableViewWrap.hide();
            logsTable.tableWrap.children[1].data = null;
            logsTable = null;
            $.clockSettingsTableWrap.show();
            $.managerSettingsHeaderTxt.setText("Clock Settings");
            $.back.hide();
            $.back.addEventListener("click", goback);
        }
        function changeColor(e) {
            "touchstart" === e.type ? e.source.setBackgroundColor("#34aadc") : e.source.setBackgroundColor("transparent");
        }
        function alertNoNetwork() {
            $.noNetworkToSendLogs = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("ok") ],
                title: CloudClock.customL.strings("alert"),
                message: CloudClock.customL.strings("noNetworkToSendLogs"),
                callback: {
                    eType: "click",
                    action: function() {
                        $.noNetworkToSendLogs.hide.apply(CloudClock.managerOptions);
                    }
                }
            });
            $.noNetworkToSendLogs.show.apply(CloudClock.managerOptions);
        }
        function sendLogs() {
            if (true === Ti.Network.online) {
                $.sendLogs.removeEventListener("click", sendLogs);
                $.logsTableViewWrap.removeAllChildren();
                $.destroy();
                CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.show();
                Alloy.Collections.logging.saveToCSVandRemove();
                $.sendLogs.addEventListener("click", sendLogs);
            } else alertNoNetwork();
        }
        function viewLogs() {
            $.viewLogs.removeEventListener("click", viewLogs);
            Alloy.Collections.logging.fetch({
                success: function() {
                    console.log("Logs successfuly retrieved from local DB.");
                },
                error: function(collection, response) {
                    CloudClock.log("Error", JSON.stringify(response));
                }
            });
            $.back.show();
            $.sendLogs.show();
            $.clockSettingsTableWrap.hide();
            $.managerSettingsHeaderTxt.setText("Cloud Clock Logs");
            logsTable = Alloy.createController("managerOptions_viewLogs", {
                data: "test view logs"
            });
            $.logsTableViewWrap.applyProperties({
                width: "90%"
            });
            $.logsTableViewWrap.add(logsTable.tableWrap);
            $.logsTableViewWrap.show();
            $.viewLogs.addEventListener("click", viewLogs);
        }
        function setLanguage() {
            $.hostURLLbl.setText(Ti.App.Properties.getString("PNET"));
            $.terminalIdLbl.setText(Ti.App.Properties.getString("TERMID"));
            $.terminalIdTxtField.setVisible(false);
            $.versionLbl.setText(Titanium.App.version);
            $.deviceLbl.setText(Ti.Platform.osname + " iOS V." + Ti.Platform.version);
            $.timezoneLbl.setText("GMT " + -currentTime.getTimezoneOffset() / 60);
            $.lastConnectLbl.setText(Ti.App.Properties.getString("LAST_CONNECT"));
        }
        function updateUI() {
            setLanguage();
            $.back.setVisible(false);
            $.sendLogs.setVisible(false);
            $.logsTableViewWrap.hide();
            $.lastQUPDATE.applyProperties({
                text: Ti.App.Properties.getString("LAST_QUPDATE"),
                bottom: "10dp",
                color: "#000"
            });
            $.lastLUPDATE.applyProperties({
                text: Ti.App.Properties.getString("LAST_LUPDATE"),
                bottom: "10dp",
                color: "#000"
            });
            0 === Ti.App.Properties.getString("MANAGEREPORTS").length;
            0 === Ti.App.Properties.getString("MANAGEUSERS").length && CloudClock.managerOptions.sideBarMenu.remove(CloudClock.managerOptions.people);
            0 === Ti.App.Properties.getString("MANAGEDEPTS").length && CloudClock.managerOptions.sideBarMenu.remove(CloudClock.managerOptions.departments);
        }
        function addEventListeners() {
            $.terminalId.addEventListener("click", showTextBox);
            $.terminalIdTxtField.addEventListener("return", changeTerminal);
            $.terminalIdTxtField.addEventListener("change", clearFlowTimeout);
            $.longUpdate.addEventListener("touchstart", changeColor);
            $.longUpdate.addEventListener("touchend", changeColor);
            $.longUpdate.addEventListener("click", longUpdate);
            $.quickUpdate.addEventListener("touchstart", changeColor);
            $.quickUpdate.addEventListener("touchend", changeColor);
            $.quickUpdate.addEventListener("click", runTransactions);
            $.back.addEventListener("click", goback);
            $.sendLogs.addEventListener("touchstart", changeColor);
            $.sendLogs.addEventListener("click", sendLogs);
            $.sendLogs.addEventListener("touchend", changeColor);
            $.viewLogs.addEventListener("touchstart", changeColor);
            $.viewLogs.addEventListener("touchend", changeColor);
            $.viewLogs.addEventListener("click", viewLogs);
            $.send_CSV.addEventListener("touchstart", changeColor);
            $.send_CSV.addEventListener("touchend", changeColor);
            $.send_CSV.addEventListener("click", function() {
                true === Ti.Network.online ? Alloy.Collections.logging.sendTransactionsCSV() : alertNoNetwork();
            });
        }
        try {
            var logsTable;
            var newTerminalID;
            var currentTime = new Date();
            CloudClock.managerOptions.viewLogs = viewLogs;
            CloudClock.managerOptions.setLastConnectText = function() {
                $.lastConnectLbl.setText(Ti.App.Properties.getString("LAST_CONNECT"));
            };
            CloudClock.managerOptions.setQUpdateText = function() {
                $.lastQUPDATE.applyProperties({
                    text: Ti.App.Properties.getString("LAST_QUPDATE")
                });
            };
            CloudClock.managerOptions.setLUpdateText = function() {
                $.lastLUPDATE.applyProperties({
                    text: Ti.App.Properties.getString("LAST_LUPDATE")
                });
            };
            updateUI();
            addEventListeners();
            CloudClock.managerOptions.restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;