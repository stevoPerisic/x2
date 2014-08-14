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
    this.__controllerPath = "managerOptions_people";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.managerOptionsPeople = Ti.UI.createView({
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL,
        id: "managerOptionsPeople"
    });
    $.__views.managerOptionsPeople && $.addTopLevelView($.__views.managerOptionsPeople);
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
    $.__views.managerOptionsPeople.add($.__views.contentHeader);
    $.__views.managerPeopleHeaderTxt = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "24dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#AEAEAE",
        id: "managerPeopleHeaderTxt",
        text: "People"
    });
    $.__views.contentHeader.add($.__views.managerPeopleHeaderTxt);
    $.__views.peopleWebViewWrap = Ti.UI.createView({
        top: "80dp",
        width: "100%",
        id: "peopleWebViewWrap"
    });
    $.__views.managerOptionsPeople.add($.__views.peopleWebViewWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info("Args Data: " + JSON.stringify(args.data));
    (function() {
        try {
            var url = Ti.App.Properties.getString("MANAGEUSERS");
            var webView = Ti.UI.createWebView({
                url: url,
                ignoreSslError: true,
                height: "100%",
                width: "100%"
            });
            CloudClock.managerOptions.restartTimeout();
            $.peopleWebViewWrap.add(webView);
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;