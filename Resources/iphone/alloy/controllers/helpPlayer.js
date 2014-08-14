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
    this.__controllerPath = "helpPlayer";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.helpPlayer = Ti.UI.createView({
        top: "80dp",
        right: -400,
        width: "300dp",
        height: "200dp",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        layout: "vertical",
        id: "helpPlayer"
    });
    $.__views.helpPlayer && $.addTopLevelView($.__views.helpPlayer);
    $.__views.helpText = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        top: "10dp",
        width: "90%",
        height: "100dp",
        id: "helpText",
        text: "Sample help text label"
    });
    $.__views.helpPlayer.add($.__views.helpText);
    $.__views.buttonWrap = Ti.UI.createView({
        top: "20dp",
        width: "90%",
        layout: "horizontal",
        id: "buttonWrap"
    });
    $.__views.helpPlayer.add($.__views.buttonWrap);
    $.__views.stopBtn = Ti.UI.createButton({
        height: "44dp",
        font: {
            fontSize: "20dp"
        },
        color: "#333",
        left: 10,
        right: 5,
        width: "44dp",
        borderColor: "#e4e4e4",
        borderRadius: "22%",
        backgroundImage: "none",
        title: "",
        id: "stopBtn"
    });
    $.__views.buttonWrap.add($.__views.stopBtn);
    $.__views.__alloyId43 = Ti.UI.createImageView({
        width: "28dp",
        image: "/images/icons/9_av_stop.png",
        id: "__alloyId43"
    });
    $.__views.stopBtn.add($.__views.__alloyId43);
    $.__views.playBtn = Ti.UI.createButton({
        height: "44dp",
        font: {
            fontSize: "20dp"
        },
        color: "#333",
        left: 10,
        right: 5,
        width: "44dp",
        borderColor: "#e4e4e4",
        borderRadius: "22%",
        backgroundImage: "none",
        title: "",
        id: "playBtn"
    });
    $.__views.buttonWrap.add($.__views.playBtn);
    $.__views.__alloyId44 = Ti.UI.createImageView({
        width: "28dp",
        image: "/images/icons/9_av_play.png",
        id: "__alloyId44"
    });
    $.__views.playBtn.add($.__views.__alloyId44);
    $.__views.closeHelp = Ti.UI.createButton({
        height: "44dp",
        font: {
            fontSize: "20dp"
        },
        color: "#333",
        left: 10,
        right: 5,
        width: "100dp",
        borderColor: "#e4e4e4",
        borderRadius: "22%",
        backgroundImage: "none",
        borderWidth: 0,
        backgroundColor: "transparent",
        title: "",
        id: "closeHelp"
    });
    $.__views.buttonWrap.add($.__views.closeHelp);
    $.__views.closeHelpLbl = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        id: "closeHelpLbl",
        text: "Close"
    });
    $.__views.closeHelp.add($.__views.closeHelpLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    (function() {
        function formatLang(language) {
            return "EN" === language || "en-us" === language || "en_us" === language || "en-US" === language ? "en-US" : "es" === language ? "es-US" : "fr" === language ? "fr-US" : "en-US";
        }
        function formatLangForSound(language) {
            return "EN" === language || "en-us" === language || "en_us" === language || "en-US" === language ? "EN" : "es" === language ? "ES" : "fr" === language ? "FR" : "EN";
        }
        function play_click() {
            $.playBtn.removeEventListener("click", play_click);
            1 !== $.helpPlayer.noAudio && sound.play();
            $.playBtn.addEventListener("click", play_click);
        }
        function stop_click() {
            $.stopBtn.removeEventListener("click", stop_click);
            1 !== $.helpPlayer.noAudio && sound.stop();
            $.stopBtn.addEventListener("click", stop_click);
        }
        function changeColor(e) {
            e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
        }
        function closeHelpPlayer() {
            $.helpPlayer.animate({
                right: -400,
                duration: 500
            }, function() {
                1 !== $.helpPlayer.noAudio && sound.stop();
                $.helpPlayer.hide();
                $.destroy();
                CloudClock.helpPlayer = null;
            });
        }
        function setLanguage() {
            $.closeHelpLbl.setText(CloudClock.customL.strings("close"));
        }
        function addEventListeners() {
            $.stopBtn.addEventListener("click", stop_click);
            $.stopBtn.addEventListener("touchstart", changeColor);
            $.stopBtn.addEventListener("touchend", changeColor);
            $.playBtn.addEventListener("click", play_click);
            $.playBtn.addEventListener("touchstart", changeColor);
            $.playBtn.addEventListener("touchend", changeColor);
            $.closeHelp.addEventListener("click", closeHelpPlayer);
        }
        try {
            exports.play = function(language, viewNo) {
                try {
                    setLanguage();
                    var helpMessageLang = formatLang(language);
                    var soundLang = formatLangForSound(language);
                    var helpMessage = Alloy.Collections.deviceHelp.where({
                        id: parseInt(viewNo, 10),
                        language: helpMessageLang
                    });
                    var helpfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "helpFiles/" + soundLang + "_" + viewNo + ".mp3");
                    if (helpfile.exists()) {
                        $.helpText.setText(helpMessage[0].get("helpText"));
                        helpMessage = null;
                        sound = Titanium.Media.createSound({
                            url: docsDir + "helpFiles/" + soundLang + "_" + viewNo + ".mp3"
                        });
                        sound.play();
                    } else {
                        $.helpPlayer.noAudio = 1;
                        $.helpText.setText(helpMessage[0].get("helpText") + "\nAudio Not Available.");
                    }
                } catch (error) {
                    console.log("Help player play fn: " + error);
                    CloudClock.error(error);
                }
            };
            CloudClock.helpPlayer = $;
            var docsDir = Ti.Filesystem.getApplicationDataDirectory();
            var sound;
            addEventListeners();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;