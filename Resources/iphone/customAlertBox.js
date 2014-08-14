exports.create = function(_params) {
    var alertBox = {};
    alertBox.forceClose = function() {
        if (!alertBox || _params.stayOpen) return false;
        var children = alertBox.alertBox.getChildren();
        _.each(children, function(child) {
            if (!_.isUndefined(child.id) && child.id === alertBox.alertBox.cancel) {
                console.log(child);
                child.fireEvent("click");
            }
        });
    };
    alertBox.cleanUp = function() {
        if ("number" == typeof alertBox.timeout) {
            clearTimeout(alertBox.timeout);
            delete alertBox.timeout;
        }
        alertBox.context = null;
        alertBox.overlay = null;
        alertBox.alertBox = null;
        alertBoxText = null;
        alertBox = null;
    };
    alertBox.show = function() {
        try {
            alertBox.context = this;
            var topLevel = _.isFunction(this.getTopLevelViews) ? this.getTopLevelViews() : _.isFunction(alertBox.context.getTopLevelViews) ? alertBox.context.getTopLevelViews() : false;
            if (!topLevel) return false;
            topLevel[0].add(CloudClock.alertBox.overlay);
            topLevel[0].add(CloudClock.alertBox.alertBox);
            alertBox.timeout = setTimeout(alertBox.forceClose, 6e3);
        } catch (error) {
            CloudClock.error(error);
        }
    };
    alertBox.hide = function() {
        try {
            if (_.isNull(this) || _.isNull(alertBox.context)) return false;
            var topLevel = _.isFunction(this.getTopLevelViews) ? this.getTopLevelViews() : _.isFunction(alertBox.context.getTopLevelViews) ? alertBox.context.getTopLevelViews() : false;
            if (topLevel) {
                topLevel[0].remove(CloudClock.alertBox.overlay);
                topLevel[0].remove(CloudClock.alertBox.alertBox);
            }
            alertBox.cleanUp();
        } catch (error) {
            CloudClock.error(error);
        }
    };
    alertBox.changeColor = function(e) {
        e.source.removeEventListener(e.type, alertBox.changeColor);
        e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
        e.source.color = "touchstart" === e.type ? "#fff" : "#000";
    };
    alertBox.hide;
    alertBox.context = {};
    alertBox.overlay = Ti.UI.createView({
        id: "alertBoxOverlay",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: "0.7"
    });
    alertBox.alertBox = Ti.UI.createView({
        id: "customAlert",
        cancel: _params.cancel,
        width: "60%",
        height: "60%",
        top: "20%",
        left: "20%",
        borderColor: "alert" === _params.type ? "#ff2d55" : "warning" === _params.type ? "#e2f25c" : "success" === _params.type ? "#62bb47" : "#000",
        borderRadius: 20,
        zindex: 2,
        backgroundColor: "#fff"
    });
    alertBox.alertBox.addEventListener(_params.callback.eType, _params.callback.action);
    var alertBoxTitle = Ti.UI.createLabel({
        top: 0,
        height: "15%",
        width: "100%",
        borderWidth: 1,
        borderColor: "alert" === _params.type ? "#ff2d55" : "warning" === _params.type ? "#e2f25c" : "success" === _params.type ? "#62bb47" : "#000",
        backgroundColor: "alert" === _params.type ? "#ff2d55" : "warning" === _params.type ? "#e2f25c" : "success" === _params.type ? "#62bb47" : "#000",
        font: {
            fontSize: "30dp",
            fontWeight: "bold"
        },
        text: _params.title,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "ALERT!" === _params.title ? "#fff" : "#000"
    });
    var alertBoxText = Ti.UI.createLabel({
        top: "15%",
        left: "5%",
        width: "90%",
        height: "75%",
        font: {
            fontSize: "28dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#000",
        text: _params.message
    });
    alertBox.alertBox.add(alertBoxTitle);
    alertBox.alertBox.add(alertBoxText);
    _.each(_params.buttonNames, function(button, i) {
        var btn = Ti.UI.createLabel({
            id: i,
            bottom: 0,
            width: 1 === _params.buttonNames.length ? "100%" : 2 === _params.buttonNames.length ? "50%" : "33.4%",
            height: "20%",
            left: 1 === _params.buttonNames.length ? 0 : 2 === _params.buttonNames.length ? 0 === i ? 0 : "50%" : 0 === i ? 0 : 1 === i ? "33.35%" : "66.7%",
            text: button,
            font: {
                fontSize: "24dp",
                fontWeight: "bold"
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            color: "#000",
            borderColor: "#000"
        });
        btn.addEventListener("touchstart", alertBox.changeColor);
        btn.addEventListener("touchend", alertBox.changeColor);
        alertBox.alertBox.add(btn);
        btn = null;
    });
    CloudClock.alertBox = alertBox;
    return alertBox;
};