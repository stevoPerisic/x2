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
    this.__controllerPath = "employeeOptions_generalSettings";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.generalSettings = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "generalSettings"
    });
    $.__views.generalSettings && $.addTopLevelView($.__views.generalSettings);
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
    $.__views.generalSettings.add($.__views.contentHeader);
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
    $.__views.__alloyId26 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/back-32-blue.png",
        id: "__alloyId26"
    });
    $.__views.back.add($.__views.__alloyId26);
    $.__views.backLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#34AADC",
        left: 60,
        id: "backLbl"
    });
    $.__views.back.add($.__views.backLbl);
    $.__views.emplSettingsHeader = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "emplSettingsHeader"
    });
    $.__views.contentHeader.add($.__views.emplSettingsHeader);
    $.__views.settingsTableWrap = Ti.UI.createView({
        top: "80dp",
        width: "90%",
        layout: "vertical",
        left: "5%",
        id: "settingsTableWrap"
    });
    $.__views.generalSettings.add($.__views.settingsTableWrap);
    $.__views.personalPrefLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "10dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "personalPrefLbl"
    });
    $.__views.settingsTableWrap.add($.__views.personalPrefLbl);
    var __alloyId27 = [];
    $.__views.badgeId = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#fff",
        height: "44dp",
        selectedColor: "#000",
        id: "badgeId"
    });
    __alloyId27.push($.__views.badgeId);
    $.__views.badgeId_text = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "badgeId_text"
    });
    $.__views.badgeId.add($.__views.badgeId_text);
    $.__views.badgeIdLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#666",
        right: "40dp",
        id: "badgeIdLbl"
    });
    $.__views.badgeId.add($.__views.badgeIdLbl);
    $.__views.email = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "email"
    });
    __alloyId27.push($.__views.email);
    $.__views.email_text = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "email_text"
    });
    $.__views.email.add($.__views.email_text);
    $.__views.emailLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#00a6d5",
        right: "40dp",
        id: "emailLbl"
    });
    $.__views.email.add($.__views.emailLbl);
    $.__views.emailArrow = Ti.UI.createImageView({
        right: "5dp",
        id: "emailArrow",
        image: "images/icons/1_navigation_next_item.png"
    });
    $.__views.email.add($.__views.emailArrow);
    $.__views.emailTxtField = Ti.UI.createTextField({
        right: "5%",
        height: "44dp",
        width: "60%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        keyboardType: Ti.UI.KEYBOARD_EMAIL,
        id: "emailTxtField",
        hintText: "john.doe@company.com"
    });
    $.__views.email.add($.__views.emailTxtField);
    $.__views.cellPhoneNum = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "cellPhoneNum"
    });
    __alloyId27.push($.__views.cellPhoneNum);
    $.__views.cellPhoneNum_text = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "cellPhoneNum_text"
    });
    $.__views.cellPhoneNum.add($.__views.cellPhoneNum_text);
    $.__views.cellPhoneLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#00a6d5",
        right: "40dp",
        id: "cellPhoneLbl"
    });
    $.__views.cellPhoneNum.add($.__views.cellPhoneLbl);
    $.__views.cellPhoneArrow = Ti.UI.createImageView({
        right: "5dp",
        id: "cellPhoneArrow",
        image: "images/icons/1_navigation_next_item.png"
    });
    $.__views.cellPhoneNum.add($.__views.cellPhoneArrow);
    $.__views.cellPhoneNumTxtField = Ti.UI.createTextField({
        right: "5%",
        height: "44dp",
        width: "60%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD,
        id: "cellPhoneNumTxtField",
        hintText: "000-000-0000"
    });
    $.__views.cellPhoneNum.add($.__views.cellPhoneNumTxtField);
    $.__views.mobileCarrier = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "mobileCarrier"
    });
    __alloyId27.push($.__views.mobileCarrier);
    $.__views.mobileCarrier_text = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "mobileCarrier_text"
    });
    $.__views.mobileCarrier.add($.__views.mobileCarrier_text);
    $.__views.mobileCarrierLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#00a6d5",
        right: "40dp",
        id: "mobileCarrierLbl",
        order: ""
    });
    $.__views.mobileCarrier.add($.__views.mobileCarrierLbl);
    $.__views.__alloyId28 = Ti.UI.createImageView({
        right: "5dp",
        image: "images/icons/1_navigation_next_item.png",
        id: "__alloyId28"
    });
    $.__views.mobileCarrier.add($.__views.__alloyId28);
    $.__views.employeeSettings = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "190dp",
        data: __alloyId27,
        id: "employeeSettings"
    });
    $.__views.settingsTableWrap.add($.__views.employeeSettings);
    $.__views.langPrefLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "20dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        left: "10dp",
        width: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "langPrefLbl"
    });
    $.__views.settingsTableWrap.add($.__views.langPrefLbl);
    var __alloyId29 = [];
    $.__views.en_us = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "en_us"
    });
    __alloyId29.push($.__views.en_us);
    $.__views.en_usLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "en_usLbl"
    });
    $.__views.en_us.add($.__views.en_usLbl);
    $.__views.en_usCheck = Ti.UI.createImageView({
        right: 15,
        id: "en_usCheck",
        image: "/images/icons/1_navigation_accept_blk.png"
    });
    $.__views.en_us.add($.__views.en_usCheck);
    $.__views.es = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "es"
    });
    __alloyId29.push($.__views.es);
    $.__views.esLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "esLbl"
    });
    $.__views.es.add($.__views.esLbl);
    $.__views.esCheck = Ti.UI.createImageView({
        right: 15,
        id: "esCheck",
        image: "/images/icons/1_navigation_accept_blk.png"
    });
    $.__views.es.add($.__views.esCheck);
    $.__views.fr = Ti.UI.createTableViewRow({
        selectedBackgroundColor: "#34AADC",
        height: "44dp",
        id: "fr"
    });
    __alloyId29.push($.__views.fr);
    $.__views.frLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 10,
        id: "frLbl"
    });
    $.__views.fr.add($.__views.frLbl);
    $.__views.frCheck = Ti.UI.createImageView({
        right: 15,
        id: "frCheck",
        image: "/images/icons/1_navigation_accept_blk.png"
    });
    $.__views.fr.add($.__views.frCheck);
    $.__views.languagePrefs = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: false,
        separatorColor: "#e4e4e4",
        height: "140",
        data: __alloyId29,
        id: "languagePrefs"
    });
    $.__views.settingsTableWrap.add($.__views.languagePrefs);
    $.__views.cellCarriersTableWrap = Ti.UI.createView({
        top: "80dp",
        height: "100%",
        width: "90%",
        layout: "vertical",
        left: "100%",
        id: "cellCarriersTableWrap"
    });
    $.__views.generalSettings.add($.__views.cellCarriersTableWrap);
    $.__views.cellCarriers = Ti.UI.createTableView({
        top: "10dp",
        bottom: "30dp",
        width: "100%",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        rowHeight: "48dp",
        scrollable: true,
        separatorColor: "#e4e4e4",
        id: "cellCarriers"
    });
    $.__views.cellCarriersTableWrap.add($.__views.cellCarriers);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function languageChange_click(e) {
            restartTimeout();
            hideLangChcks();
            $[e.source.id].applyProperties({
                font: {
                    fontSize: "18dp",
                    fontWeight: "bold"
                }
            });
            $[e.source.id].children[1].setVisible(true);
            employee.save({
                lang: e.source.id
            });
            Ti.App.Properties.setString("CURRLANGUAGETYPE", e.source.id);
            setLanguage();
            CloudClock.employeeOptions.setLanguage();
            CloudClock.employeeOptions.header.setLanguage();
            payload.parm1 = e.source.id;
            payload.parm2 = 0;
            payload.itemID = "Language";
            var setLanguage_cfg = {
                endpoint: "employeeProfile",
                params: {
                    badge: CloudClock.sessionObj.employee.get("badge")
                },
                payload: payload,
                onSuccess: function(response) {
                    CloudClock.log("Info", "Employee language pref. updated: " + JSON.stringify(response));
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error updating empl. language pref.: " + JSON.stringify(response));
                }
            };
            setLanguage_cfg.params.termID = Ti.App.Properties.getString("TERMID");
            CloudClock.api.request(setLanguage_cfg);
        }
        function hideLangChcks() {
            $.en_usCheck.setVisible(false);
            $.esCheck.setVisible(false);
            $.frCheck.setVisible(false);
        }
        function setLanguage() {
            $.backLbl.setText(CloudClock.customL.strings("back_btn"));
            $.emplSettingsHeader.setText(CloudClock.customL.strings("genSettings"));
            $.personalPrefLbl.setText(CloudClock.customL.strings("personal_pref"));
            $.badgeId_text.setText(CloudClock.customL.strings("sett_name_badge"));
            $.email_text.setText(CloudClock.customL.strings("sett_name_email"));
            $.cellPhoneNum_text.setText(CloudClock.customL.strings("sett_name_cell"));
            $.mobileCarrier_text.setText(CloudClock.customL.strings("sett_name_carr"));
            $.mobileCarrierLbl.setText(CloudClock.customL.strings("mobileCarr"));
            $.langPrefLbl.setText(CloudClock.customL.strings("lang_pref"));
            $.en_usLbl.setText(CloudClock.customL.strings("english"));
            $.esLbl.setText(CloudClock.customL.strings("espanol"));
            $.frLbl.setText(CloudClock.customL.strings("french"));
        }
        function email_click() {
            restartTimeout();
            var previousValue = $.emailLbl.getText();
            $.emailLbl.setVisible(false);
            $.emailArrow.setVisible(false);
            previousValue ? $.emailTxtField.setHintText(previousValue) : $.emailTxtField.setHintText("john.doe@company.com");
            $.emailTxtField.setVisible(true);
            $.emailTxtField.focus();
        }
        function emailTxtField_change() {
            restartTimeout();
        }
        function emailtxtField_return() {
            restartTimeout();
            var email = $.emailTxtField.getValue();
            var n = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
            if (n && email !== employee.get("email")) {
                $.emailLbl.setText(email);
                $.emailTxtField.hide();
                $.settingsTableWrap.fireEvent("email_set", {
                    parm1: email,
                    parm2: 0,
                    itemId: "Email"
                });
                employee.save({
                    email: email
                });
            } else if (n && email === employee.get("email")) {
                $.email_txt_alert = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("email_txt_alert"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.email_txt_alert.hide.apply($);
                                showPrevEmailValue();
                            }
                        }
                    }
                });
                $.email_txt_alert.show.apply($);
            } else {
                $.enter_valid_email = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("enter_valid_email"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.enter_valid_email.hide.apply($);
                                showPrevEmailValue();
                            }
                        }
                    }
                });
                $.enter_valid_email.show.apply($);
            }
        }
        function cellPhoneNum_click() {
            restartTimeout();
            var previuosValue = $.cellPhoneLbl.getText();
            $.cellPhoneLbl.setVisible(false);
            $.cellPhoneArrow.setVisible(false);
            previuosValue ? $.cellPhoneNumTxtField.setHintText(previuosValue) : $.cellPhoneNumTxtField.setHintText("000-000-0000");
            $.cellPhoneNumTxtField.setVisible(true);
            $.cellPhoneNumTxtField.focus();
        }
        function cellPhoneNumTxtField_change() {
            restartTimeout();
        }
        function cellPhoneNumTxtField_return() {
            restartTimeout();
            var carrier = $.mobileCarrierLbl.text;
            var cellPhone = $.cellPhoneNumTxtField.getValue();
            cellPhone = cellPhone.replace(/\D/g, "");
            if (0 === cellPhone.length) {
                $.cellPhoneNumTxtField.blur();
                $.cellPhoneNumTxtField.hide();
                $.cellPhoneArrow.show();
                $.cellPhoneLbl.show();
                return false;
            }
            if (10 !== cellPhone.length) {
                $.enter_valid_cellNum = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("enter_valid_cellNum"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.enter_valid_cellNum.hide.apply($);
                                $.cellPhoneNumTxtField.blur();
                                $.cellPhoneNumTxtField.setHintText("000-000-0000");
                                $.cellPhoneNumTxtField.value = "";
                                $.cellPhoneArrow.show();
                            }
                        }
                    }
                });
                $.enter_valid_cellNum.show.apply($);
                return false;
            }
            if (carrier && carrier.length > 0) {
                var order = $.mobileCarrierLbl.order;
                $.mobileCarrierLbl.setText(carrier);
                cellPhone !== employee.get("cellPhone") && $.settingsTableWrap.fireEvent("cellPhone_set", {
                    parm1: cellPhone,
                    parm2: order,
                    itemId: "Mobile"
                });
                employee.save({
                    cellCarrier: order,
                    cellPhone: cellPhone
                });
            } else {
                $.select_carr_alert = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("select_carr_alert"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.select_carr_alert.hide.apply($);
                                $.cellPhoneNumTxtField.blur();
                            }
                        }
                    }
                });
                $.select_carr_alert.show.apply($);
            }
        }
        function mobileCarrier_click() {
            restartTimeout();
            $.mobileCarrier.removeEventListener("click", mobileCarrier_click);
            makeCellCarriersTbl(cellCarriers);
            $.back.setVisible(true);
            $.settingsTableWrap.animate({
                left: "-100%",
                duration: 480
            });
            $.cellCarriersTableWrap.animate({
                left: "5%",
                duration: 500
            });
            $.mobileCarrier.addEventListener("click", mobileCarrier_click);
        }
        function backBtn_click() {
            restartTimeout();
            $.cellCarriersTableWrap.animate({
                left: "100%",
                duration: 480
            });
            $.settingsTableWrap.animate({
                left: "5%",
                duration: 500
            });
            $.back.setVisible(false);
            var cellPhone = $.cellPhoneNumTxtField.getValue() ? $.cellPhoneNumTxtField.getValue() : $.cellPhoneLbl.getText();
            var carrier = $.mobileCarrierLbl.text;
            if (!cellPhone) return false;
            if (cellPhone.length > 0) {
                var order = $.mobileCarrierLbl.order;
                $.mobileCarrierLbl.setText(carrier);
                order !== employee.get("cellCarrier") && $.settingsTableWrap.fireEvent("cellPhone_set", {
                    parm1: cellPhone,
                    parm2: order,
                    itemId: "Mobile"
                });
                employee.save({
                    cellCarrier: order,
                    cellPhone: cellPhone
                });
            } else {
                $.cell_txt_alert = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("cell_txt_alert"),
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id === this.cancel) {
                                $.cell_txt_alert.hide.apply($);
                                $.cellPhoneNumTxtField.focus();
                            }
                        }
                    }
                });
                $.cell_txt_alert.show.apply($);
            }
        }
        function carrier_selected(e) {
            $.mobileCarrierLbl.text = e.carrier;
            $.mobileCarrierLbl.order = e.order;
        }
        function setParms(_e, type) {
            if ("Email_cfg" === type) {
                setEmail_cfg.payload.parm1 = _e.parm1;
                setEmail_cfg.payload.parm2 = _e.parm2;
                setEmail_cfg.payload.itemID = _e.itemId;
                employee.save({
                    email: _e.parm1
                });
                setEmail_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                CloudClock.api.request(setEmail_cfg);
            } else if ("Text_cfg" === type) {
                setText_cfg.payload.parm1 = _e.parm1;
                setText_cfg.payload.parm2 = _e.parm2;
                setText_cfg.payload.itemID = _e.itemId;
                employee.save({
                    cellPhone: _e.parm1
                });
                setText_cfg.params.termID = Ti.App.Properties.getString("TERMID");
                CloudClock.api.request(setText_cfg);
            }
        }
        function carriersRowClick(e) {
            _.each(e.section.rows, function(row) {
                "checkedRow" === row.id && row.remove(cellcarrierChckMark);
            });
            e.source.add(cellcarrierChckMark);
            e.source.applyProperties({
                id: "checked",
                font: {
                    fontSize: "18dp",
                    fontWeight: "bold"
                }
            });
            desiredCarrier = e.source.carrier;
            $.back.fireEvent("carrier_selected", {
                carrier: desiredCarrier,
                order: e.source.number
            });
        }
        function makeCellCarriersTbl(rowData) {
            var rows = [];
            _.each(rowData, function(carrier, i) {
                var row = Ti.UI.createTableViewRow({
                    id: "",
                    checked: false,
                    carrier: carrier,
                    number: i + 1,
                    height: 44,
                    backgroundFocusedColor: "#fff",
                    backgroundImage: "none",
                    bacgroundSelectedColor: "#fff",
                    focusedBackgroundColor: "#34AADC"
                });
                var label = Ti.UI.createLabel({
                    text: carrier,
                    left: 10,
                    color: "#333",
                    font: {
                        fontSize: "18dp"
                    }
                });
                row.add(label);
                if (row.number === desiredCarrier + 1 || row.carrier === desiredCarrier) {
                    row.id = "checkedRow";
                    row.checked = true;
                    row.children[0].font.fontWeight = "bold";
                    row.add(cellcarrierChckMark);
                }
                row.addEventListener("click", carriersRowClick);
                rows.push(row);
                row = null;
                label = null;
            });
            $.cellCarriers.setData(rows);
            rows = null;
        }
        function showPrevEmailValue() {
            $.emailTxtField.blur();
            $.emailTxtField.hide();
            $.emailArrow.show();
            $.emailLbl.show();
        }
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeOptions", "employeeOptions", CloudClock.employeeOptions.header.exit);
            CloudClock.clock.showEmployeeOptionsDialog = true;
        }
        function updateUI() {
            hideLangChcks();
            setLanguage();
            $.back.setVisible(false);
            $.badgeIdLbl.setText(employee.get("badge"));
            if (employee.get("email")) {
                $.emailLbl.setText(employee.get("email"));
                $.emailTxtField.setVisible(false);
            } else {
                $.emailLbl.setVisible(false);
                $.emailTxtField.setVisible(true);
            }
            if (employee.get("cellPhone")) {
                $.cellPhoneLbl.setText(employee.get("cellPhone"));
                $.cellPhoneNumTxtField.setVisible(false);
            } else {
                $.cellPhoneLbl.setVisible(false);
                $.cellPhoneNumTxtField.setVisible(true);
            }
            if (null !== desiredCarrier && 0 !== desiredCarrier.length) for (var i = 0; ccl > i; i++) {
                desiredCarrier = parseInt(employee.get("cellCarrier"), 10) - 1;
                if (i === desiredCarrier) {
                    $.mobileCarrierLbl.setText(cellCarriers[i]);
                    $.mobileCarrier.applyProperties({
                        carrierNum: desiredCarrier
                    });
                }
            } else {
                desiredCarrier = 0;
                $.mobileCarrierLbl.setText("Please set up your mobile carrier.");
                $.mobileCarrier.applyProperties({
                    carrierNum: desiredCarrier
                });
            }
            "en_us" === employee.get("lang") || "en-us" === employee.get("lang") || "en-US" === employee.get("lang") ? $.en_usCheck.setVisible(true) : "es" === employee.get("lang") ? $.esCheck.setVisible(true) : "fr" === employee.get("lang") && $.frCheck.setVisible(true);
        }
        function addEventListeners() {
            $.en_us.addEventListener("click", languageChange_click);
            $.es.addEventListener("click", languageChange_click);
            $.fr.addEventListener("click", languageChange_click);
            $.settingsTableWrap.addEventListener("email_set", function(e) {
                setParms(e, "Email_cfg");
            });
            $.settingsTableWrap.addEventListener("cellPhone_set", function(e) {
                setParms(e, "Text_cfg");
            });
            $.email.addEventListener("click", email_click);
            $.emailTxtField.addEventListener("change", emailTxtField_change);
            $.emailTxtField.addEventListener("return", emailtxtField_return);
            $.cellPhoneNum.addEventListener("click", cellPhoneNum_click);
            $.cellPhoneNumTxtField.addEventListener("change", cellPhoneNumTxtField_change);
            $.cellPhoneNumTxtField.addEventListener("return", cellPhoneNumTxtField_return);
            $.mobileCarrier.addEventListener("click", mobileCarrier_click);
            $.back.addEventListener("click", backBtn_click);
            $.back.addEventListener("carrier_selected", carrier_selected);
        }
        try {
            var employee = CloudClock.sessionObj.employee;
            var cellCarriers = Alloy.Collections.parameters.getCellCarriersNames();
            var ccl = cellCarriers.length;
            var desiredCarrier = employee.get("cellCarrier");
            var cellcarrierChckMark = Ti.UI.createImageView({
                id: "checkmarkImg",
                image: "/images/icons/1_navigation_accept_blk.png",
                right: "15dp"
            });
            var params = {
                badge: employee.get("badge")
            };
            var payload = {
                parm1: "",
                parm2: "",
                itemID: ""
            };
            var setText_cfg = {
                endpoint: "employeeProfile",
                params: params,
                payload: payload,
                onSuccess: function() {
                    $.cellPhoneNumTxtField.blur();
                    $.cellPhoneNumTxtField.hide();
                    $.cellPhoneArrow.show();
                    $.cellPhoneLbl.setText(employee.get("cellPhone"));
                    $.cellPhoneLbl.show();
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error updating employee profile: " + JSON.stringify(response));
                }
            };
            var setEmail_cfg = {
                endpoint: "employeeProfile",
                params: params,
                payload: payload,
                onSuccess: function() {
                    $.emailTxtField.blur();
                    $.emailLbl.setText(employee.get("email"));
                    $.emailTxtField.hide();
                    $.emailArrow.show();
                    $.emailLbl.show();
                },
                onError: function(response) {
                    CloudClock.log("Error", "Error updating employee profile: " + JSON.stringify(response));
                }
            };
            updateUI();
            addEventListeners();
            restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;