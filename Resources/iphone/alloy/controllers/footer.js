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
    this.__controllerPath = "footer";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.footer = Ti.UI.createView({
        bottom: 0,
        width: Ti.UI.Fill,
        height: "8%",
        backgroundColor: "#333",
        borderWidth: 1,
        borderColor: "#dadada",
        id: "footer"
    });
    $.__views.footer && $.addTopLevelView($.__views.footer);
    $.__views.employeeOptions = Ti.UI.createButton({
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#dadada",
        borderColor: "#666",
        backgroundImage: "none",
        width: "300dp",
        backgroundColor: "#333",
        title: "",
        id: "employeeOptions"
    });
    $.__views.footer.add($.__views.employeeOptions);
    $.__views.__alloyId40 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/more-options-32-white.png",
        id: "__alloyId40"
    });
    $.__views.employeeOptions.add($.__views.__alloyId40);
    $.__views.more_options = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#dadada",
        left: 60,
        width: "65%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        zIndex: 2,
        id: "more_options"
    });
    $.__views.employeeOptions.add($.__views.more_options);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function changeColor(e) {
            if ("touchstart" === e.type) {
                e.source.setBackgroundColor("#34aadc");
                children[1].setColor("#fff");
            } else {
                e.source.setBackgroundColor("#333");
                children[1].setColor("#dadada");
            }
        }
        function setLanguage() {
            $.more_options.setText(CloudClock.customL.strings("more_options"));
        }
        function addEventListeners() {
            $.employeeOptions.addEventListener("touchstart", changeColor);
            $.employeeOptions.addEventListener("touchend", changeColor);
        }
        try {
            exports.hide = function() {
                $.footer.hide();
            };
            addEventListeners();
            var children = $.employeeOptions.getChildren();
            setLanguage();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;