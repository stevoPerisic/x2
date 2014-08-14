function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "pinPad/" + s : s.substring(0, index) + "/pinPad/" + s.substring(index + 1);
    return path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function emptyFn() {}
    function addBtnEvents() {
        $.deleteBtn.addEventListener("touchstart", changeColor);
        $.deleteBtn.addEventListener("touchend", deleteBtn);
        $.deleteBtn.removeEventListener("doubletap", emptyFn);
        _.each($.__views, function(el) {
            if (0 === el.id.indexOf("__alloy") && "disabledButton" !== el.id) {
                el.enabled = true;
                el.addEventListener("touchstart", changeColor);
                el.addEventListener("touchend", pinPadGetVal);
                el.addEventListener("doubletap", emptyFn);
            }
        });
        console.log("\n\n\n\nPin pad events added!!!");
    }
    function removeBtnEvents() {
        $.deleteBtn.removeEventListener("touchstart", changeColor);
        $.deleteBtn.removeEventListener("touchend", deleteBtn);
        $.deleteBtn.removeEventListener("doubletap", emptyFn);
        _.each($.__views, function(el) {
            if (0 === el.id.indexOf("__alloy") && "disabledButton" !== el.id) {
                el.enabled = false;
                el.removeEventListener("touchstart", changeColor);
                el.removeEventListener("touchend", pinPadGetVal);
                el.removeEventListener("doubletap", emptyFn);
            }
        });
        console.log("\n\n\n\nPin pad events removed!!!");
    }
    function changeColor(e) {
        var button = e.source;
        button.backgroundGradient = {};
        button.backgroundColor = "#34aadc";
        $.changeBackgroundTimeout = setTimeout(function() {
            if ("number" == typeof $.changeBackgroundTimeout) {
                clearTimeout($.changeBackgroundTimeout);
                delete $.changeBackgroundTimeout;
            }
            button.backgroundGradient = buttonGradient;
            button.backgroundColor = "transparent";
        }, 100);
    }
    function pinPadGetVal(e) {
        buttonValue = e.source.title.match(/[0-9]/);
        txtFieldValue = $.pinPadTxtField.getValue();
        if ("openDepartment" === args.mode && "0" !== USEDEPTCODE && txtFieldValue.length === DEPTCODELEN) {
            console.log("remove the events");
            return false;
        }
        if ("openDepartment" === args.mode && "0" === USEDEPTCODE && txtFieldValue.length === DEPTNUMLEN) {
            console.log("remove the events");
            return false;
        }
        null !== buttonValue && (txtFieldValue += buttonValue);
        $.pinPadTxtField.setValue(txtFieldValue);
        removeBtnEvents();
        if ("terminalID" === args.mode && 10 === txtFieldValue.length) {
            CloudClock.log("Info", "Terminal ID: " + txtFieldValue + " was entered to initialize the Cloud Clock.");
            sendTerminalID(txtFieldValue);
        } else if ("enterPin" === args.mode && txtFieldValue.length === PINLENGTH) sendEmployeePin(txtFieldValue); else if ("openDepartment" === args.mode) args.reduceDepartments($.pinPadTxtField); else if ("manager" === args.mode && (txtFieldValue.length === MGRPIN.length || txtFieldValue.length === MGR2PIN.length)) {
            CloudClock.log("Info", "Manager PIN: " + txtFieldValue + " was entered to start Manager Flow.");
            CloudClock.parent.manager_login({
                managerPin: txtFieldValue
            });
        }
        addBtnEvents();
    }
    function deleteBtn() {
        txtFieldValue = $.pinPadTxtField.getValue();
        txtFieldValue = txtFieldValue.slice(0, -1);
        $.pinPadTxtField.setValue(txtFieldValue);
        removeBtnEvents();
        "openDepartment" === args.mode && args.reduceDepartments($.pinPadTxtField);
        addBtnEvents();
    }
    function sendTerminalID(terminalID) {
        $.pinPadTxtField.setValue("");
        CloudClock.parent.activityIndicator.setMessage("Starting initialization...");
        CloudClock.parent.activityIndicator.show();
        CloudClock.parent.initialize({
            terminalID: terminalID
        });
        addBtnEvents();
        $.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_pin"));
        args.mode = "enterPin";
    }
    function getPinSettings() {
        PINLENGTH = parseInt(Ti.App.Properties.getString("PINLENGTH"), 10);
        MGRPIN = Ti.App.Properties.getString("MGRPIN");
        MGR2PIN = Ti.App.Properties.getString("MGR2PIN");
    }
    function sendEmployeePin(employeePin) {
        Ti.App.Properties.setString("PINFORSHOW", employeePin);
        employeePin = parseInt(employeePin, 10);
        CloudClock.parent.activityIndicator.setMessage("Searching Employees...");
        CloudClock.parent.activityIndicator.show();
        CloudClock.parent.employee_login({
            employeePin: employeePin
        });
    }
    new (require("alloy/widget"))("pinPad");
    this.__widgetId = "pinPad";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.pinPad = Ti.UI.createView({
        top: "12%",
        width: "60%",
        height: "75%",
        id: "pinPad"
    });
    $.__views.pinPad && $.addTopLevelView($.__views.pinPad);
    $.__views.pinPadTxtField = Ti.UI.createTextField({
        left: 0,
        width: "100%",
        height: "17%",
        top: 0,
        bubbleParent: false,
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        color: "#333",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "40dp"
        },
        id: "pinPadTxtField",
        editable: "false"
    });
    $.__views.pinPad.add($.__views.pinPadTxtField);
    $.__views.__alloyId0 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "21%",
        left: 0,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "1",
        id: "__alloyId0"
    });
    $.__views.pinPad.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "21%",
        left: "35%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "2",
        id: "__alloyId1"
    });
    $.__views.pinPad.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "21%",
        left: "69%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "3",
        id: "__alloyId2"
    });
    $.__views.pinPad.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "41%",
        left: 0,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "4",
        id: "__alloyId3"
    });
    $.__views.pinPad.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "41%",
        left: "35%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "5",
        id: "__alloyId4"
    });
    $.__views.pinPad.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "41%",
        left: "69%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "6",
        id: "__alloyId5"
    });
    $.__views.pinPad.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "61%",
        left: 0,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "7",
        id: "__alloyId6"
    });
    $.__views.pinPad.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "61%",
        left: "35%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "8",
        id: "__alloyId7"
    });
    $.__views.pinPad.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "61%",
        left: "69%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "9",
        id: "__alloyId8"
    });
    $.__views.pinPad.add($.__views.__alloyId8);
    $.__views.deleteBtn = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "81%",
        left: 0,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "",
        id: "deleteBtn"
    });
    $.__views.pinPad.add($.__views.deleteBtn);
    $.__views.__alloyId9 = Ti.UI.createImageView({
        image: "/images/icons/backspace-48-blk.png",
        id: "__alloyId9"
    });
    $.__views.deleteBtn.add($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "81%",
        left: "35%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        title: "0",
        id: "__alloyId10"
    });
    $.__views.pinPad.add($.__views.__alloyId10);
    $.__views.disabledButton = Ti.UI.createButton({
        height: "17%",
        font: {
            fontSize: "40dp"
        },
        color: "#000",
        borderColor: "#e6e6e6",
        backgroundImage: "none",
        width: "30%",
        borderRadius: 10,
        borderWidth: 1,
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
        top: "81%",
        left: "69%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "disabledButton",
        enabled: "false"
    });
    $.__views.pinPad.add($.__views.disabledButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var buttonGradient = {
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
    };
    console.log("PIN PAD being read....");
    _.isEmpty(CloudClock.sessionObj.employee) && Ti.App.Properties.setString("CURRLANGUAGETYPE", Ti.App.Properties.getString("LANGUAGETYPE"));
    var args = arguments[0] || {};
    var buttonValue;
    var txtFieldValue;
    var PINLENGTH;
    var MGRPIN;
    var MGR2PIN;
    var USEDEPTCODE = Ti.App.Properties.getString("USEDEPTCODE");
    var DEPTCODELEN = Ti.App.Properties.getString("DEPTCODELEN");
    var DEPTNUMLEN = 3;
    $.pinPadTxtField.setValue("");
    $.pinPadTxtField.blur();
    addBtnEvents();
    getPinSettings();
    if (Ti.App.Properties.hasProperty("seeded")) {
        $.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_pin"));
        args.mode = "enterPin";
    } else {
        $.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_terminal"));
        args.mode = "terminalID";
    }
    exports.changeMode = function(e) {
        console.log("Changing pin pad mode to: " + e.mode);
        args.mode = e.mode;
        if ("terminalID" === args.mode) $.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_terminal")); else if ("enterPin" === args.mode) $.pinPadTxtField.setHintText(CloudClock.customL.strings("enter_pin")); else if ("openDepartment" === args.mode) {
            $.pinPadTxtField.setHintText(Ti.App.Properties.getString("DEPTCODELEN"));
            args.reduceDepartments = e.reduceDepartments;
        } else if ("enterBreakAmount" === args.mode) {
            $.pinPadTxtField.setHintText(e.hintText);
            $.pinPadTxtField.itemID = e.itemID;
            $.pinPadTxtField.itemType = e.itemType;
        }
    };
    exports.clearPinPadTxtField = function() {
        $.pinPadTxtField.setValue("");
    };
    exports.addBtnEvents = function() {
        addBtnEvents();
    };
    exports.removeBtnEvents = function() {
        removeBtnEvents();
    };
    exports.getPinSettings = function() {
        getPinSettings();
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;