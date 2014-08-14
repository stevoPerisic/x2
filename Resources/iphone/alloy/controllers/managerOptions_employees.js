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
    this.__controllerPath = "managerOptions_employees";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.managerOptionsEmployees = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "managerOptionsEmployees"
    });
    $.__views.managerOptionsEmployees && $.addTopLevelView($.__views.managerOptionsEmployees);
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
    $.__views.managerOptionsEmployees.add($.__views.contentHeader);
    $.__views.managerEmployeesHeaderTxt = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "managerEmployeesHeaderTxt",
        text: "Employees"
    });
    $.__views.contentHeader.add($.__views.managerEmployeesHeaderTxt);
    $.__views.employeesWebViewWrap = Ti.UI.createView({
        top: "80dp",
        width: "100%",
        height: "90%",
        id: "employeesWebViewWrap"
    });
    $.__views.managerOptionsEmployees.add($.__views.employeesWebViewWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info("Args Data: " + JSON.stringify(args.data));
    (function() {
        try {
            var url = Ti.App.Properties.getString("MANAGEEMPLS");
            if (true === Ti.Network.online) {
                var webView = Ti.UI.createWebView({
                    url: url,
                    ignoreSslError: true,
                    height: "100%",
                    width: "100%"
                });
                webView.evalJS('document.getElementsByClassName("ListTable").style.fontSize = "10em"');
                $.employeesWebViewWrap.add(webView);
            } else {
                var noNetwork = Ti.UI.createLabel({
                    text: CloudClock.customL.strings("noNetworkToSendLogs")
                });
                $.employeesWebViewWrap.add(noNetwork);
            }
            CloudClock.managerOptions.restartTimeout();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;