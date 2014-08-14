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
    this.__controllerPath = "header";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.header = Ti.UI.createView({
        top: 0,
        width: Ti.UI.Fill,
        height: "8%",
        backgroundColor: "#f2f2f2",
        borderWidth: 1,
        borderColor: "#dadada",
        layout: "composite",
        horizontalWrap: false,
        id: "header"
    });
    $.__views.header && $.addTopLevelView($.__views.header);
    $.__views.headerLogo = Ti.UI.createImageView({
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        width: "200dp",
        id: "headerLogo",
        image: "/images/powered_by@2x.png"
    });
    $.__views.header.add($.__views.headerLogo);
    $.__views.btnWrap = Ti.UI.createView({
        right: 0,
        width: Ti.UI.SIZE,
        layout: "horizontal",
        id: "btnWrap"
    });
    $.__views.header.add($.__views.btnWrap);
    $.__views.helpButton = Ti.UI.createButton({
        height: "90%",
        font: {
            fontSize: "20dp"
        },
        color: "#333",
        top: "5%",
        right: 5,
        borderWidth: 1,
        width: Ti.UI.SIZE,
        backgroundColor: "#FFF985",
        borderColor: "#34aadc",
        borderRadius: 10,
        backgroundImage: "none",
        title: "",
        id: "helpButton"
    });
    $.__views.btnWrap.add($.__views.helpButton);
    $.__views.__alloyId41 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/help-32-blk.png",
        id: "__alloyId41"
    });
    $.__views.helpButton.add($.__views.__alloyId41);
    $.__views.helpBtnLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 60,
        right: "16dp",
        width: Ti.UI.SIZE,
        text: "Help",
        id: "helpBtnLbl"
    });
    $.__views.helpButton.add($.__views.helpBtnLbl);
    $.__views.exit = Ti.UI.createButton({
        height: "90%",
        font: {
            fontSize: "20dp"
        },
        color: "#333",
        top: "5%",
        right: 5,
        borderWidth: 1,
        width: Ti.UI.SIZE,
        backgroundColor: "#fff",
        borderColor: "#34aadc",
        borderRadius: 10,
        backgroundImage: "none",
        title: "",
        id: "exit"
    });
    $.__views.btnWrap.add($.__views.exit);
    $.__views.__alloyId42 = Ti.UI.createImageView({
        left: 10,
        image: "/images/icons/start-over-32-blk.png",
        id: "__alloyId42"
    });
    $.__views.exit.add($.__views.__alloyId42);
    $.__views.exitLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: 60,
        right: "16dp",
        width: Ti.UI.SIZE,
        id: "exitLbl"
    });
    $.__views.exit.add($.__views.exitLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function helpButton_click(e) {
            CloudClock.playHelp = CloudClock.playHelp ? false : true;
            e.source.setBackgroundColor(CloudClock.playHelp ? "#62bb47" : "#FFF");
            CloudClock.playHelp ? Alloy.Collections.deviceHelp.audioPlayer.play() : CloudClock.sound && CloudClock.sound.stop();
        }
        function exit_click(e) {
            try {
                if (CloudClock.APIcallInProgress) return false;
                CloudClock.sound && CloudClock.sound.stop();
                $.exit.removeEventListener("click", exit_click);
                e.screenTimedOut && ($.parent.screenTimedOut = e.screenTimedOut);
                $.exit.enabled = false;
                console.log("\n\n\nParent win: " + JSON.stringify($.parent));
                "cameraWindow" === $.parent.id && CloudClock.stopCapture();
                $.parent.close();
            } catch (error) {
                CloudClock.error(error);
            }
            CloudClock.clock.showEmployeeFlowDialog = false;
            CloudClock.clock.showEmployeeOptionsDialog = false;
            CloudClock.clock.showManagerOptionsDialog = false;
            CloudClock.sessionObj.clearSession();
            Alloy.createController("index", {
                doNotSetParams: true
            });
        }
        function setLanguage() {
            $.exitLbl.setText(CloudClock.customL.strings("start_over"));
            $.helpBtnLbl.setText(CloudClock.customL.strings("help"));
        }
        function addEventListeners() {
            $.helpButton.addEventListener("click", helpButton_click);
            $.exit.addEventListener("click", function(e) {
                try {
                    _.debounce(exit_click(e), 0, true);
                } catch (error) {
                    console.log("Trying to bind the exit button event in the header." + error);
                    CloudClock.error(error);
                    Alloy.createController("index", {
                        doNotSetParams: true
                    });
                }
            });
            $.exit.addEventListener("touchstart", function(e) {
                e.source.backgroundColor = "#34aadc";
                var children = $.exit.getChildren();
                children[0].setImage("/images/icons/start-over-32-white.png");
                children[1].color = "#fff";
            });
            $.exit.addEventListener("touchend", function(e) {
                e.source.backgroundColor = "#FFF";
                var children = $.exit.getChildren();
                children[0].setImage("/images/icons/start-over-32-blk.png");
                children[1].color = "#333";
            });
            $.helpButton.addEventListener("touchstart", function(e) {
                e.source.setBackgroundColor("#34aadc");
                var children = $.helpButton.getChildren();
                children[0].setImage("/images/icons/help-32-white.png");
                children[1].setColor("#fff");
            });
            $.helpButton.addEventListener("touchend", function(e) {
                var children = $.helpButton.getChildren();
                children[0].setImage("/images/icons/help-32-blk.png");
                children[1].setColor("#333");
            });
        }
        try {
            exports.setLanguage = function() {
                setLanguage();
            };
            addEventListeners();
            setLanguage();
            $.helpButton.setBackgroundColor(CloudClock.playHelp ? "#62bb47" : "#FFFF16");
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;