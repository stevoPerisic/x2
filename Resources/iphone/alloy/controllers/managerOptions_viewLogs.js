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
    this.__controllerPath = "managerOptions_viewLogs";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.tableWrap = Ti.UI.createView({
        width: "100%",
        layout: "vertical",
        borderWidth: 1,
        borderColor: "#e4e4e4",
        id: "tableWrap"
    });
    $.__views.tableWrap && $.addTopLevelView($.__views.tableWrap);
    $.__views.tableHeader = Ti.UI.createView({
        top: 0,
        height: "44dp",
        layout: "horizontal",
        backgroundColor: "#f2f2f2",
        id: "tableHeader"
    });
    $.__views.tableWrap.add($.__views.tableHeader);
    $.__views.time = Ti.UI.createView({
        width: "17%",
        height: "100%",
        id: "time",
        order: "desc"
    });
    $.__views.tableHeader.add($.__views.time);
    $.__views.__alloyId63 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "14dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "14dp",
        width: "78%",
        height: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Time",
        id: "__alloyId63"
    });
    $.__views.time.add($.__views.__alloyId63);
    $.__views.timeArrow = Ti.UI.createImageView({
        left: 4,
        id: "timeArrow",
        image: "/images/icons/1_navigation_expand.png",
        width: "20%"
    });
    $.__views.time.add($.__views.timeArrow);
    $.__views.__alloyId64 = Ti.UI.createView({
        width: "1dp",
        backgroundColor: "#fff",
        height: "100%",
        id: "__alloyId64"
    });
    $.__views.tableHeader.add($.__views.__alloyId64);
    $.__views.severity = Ti.UI.createView({
        width: "17%",
        height: "100%",
        id: "severity",
        order: "asc"
    });
    $.__views.tableHeader.add($.__views.severity);
    $.__views.__alloyId65 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "14dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "14dp",
        width: "78%",
        height: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Severity",
        id: "__alloyId65"
    });
    $.__views.severity.add($.__views.__alloyId65);
    $.__views.severityArrow = Ti.UI.createImageView({
        left: 4,
        id: "severityArrow",
        image: "/images/icons/1_navigation_expand.png",
        width: "20%"
    });
    $.__views.severity.add($.__views.severityArrow);
    $.__views.__alloyId66 = Ti.UI.createView({
        width: "1dp",
        backgroundColor: "#fff",
        height: "100%",
        id: "__alloyId66"
    });
    $.__views.tableHeader.add($.__views.__alloyId66);
    $.__views.message = Ti.UI.createView({
        height: "100%",
        width: "63%",
        id: "message"
    });
    $.__views.tableHeader.add($.__views.message);
    $.__views.__alloyId67 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "14dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "14dp",
        width: "78%",
        height: "100%",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Message",
        id: "__alloyId67"
    });
    $.__views.message.add($.__views.__alloyId67);
    $.__views.logs = Ti.UI.createTableView({
        width: "100%",
        minRowHeight: 44,
        maxRowHeight: 100,
        height: "83%",
        separatorColor: "#e4e4e4",
        id: "logs"
    });
    $.__views.tableWrap.add($.__views.logs);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info("Args Data: " + JSON.stringify(args.data));
    (function() {
        function makeLogstable() {
            try {
                var logsTableData = [];
                var logsTableViewRowProps = {
                    className: "logsTableEntry",
                    height: Ti.UI.FILL,
                    width: "100%"
                };
                var timeLblProps = {
                    width: "17%",
                    left: "1%",
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                    font: {
                        fontSize: "12dp"
                    },
                    color: "#333"
                };
                var severityLblProps = {
                    width: "17%",
                    left: "17%",
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                    font: {
                        fontSize: "14dp"
                    },
                    color: "#333"
                };
                var messageLblProps = {
                    width: "63%",
                    left: "34%",
                    font: {
                        fontSize: "14dp"
                    },
                    color: "#333"
                };
                _.each(Alloy.Collections.logging.models, function(log) {
                    var row = Ti.UI.createTableViewRow(logsTableViewRowProps);
                    var lbl_time = Ti.UI.createLabel(timeLblProps);
                    lbl_time.text = log.get("readableTime");
                    var lbl_severity = Ti.UI.createLabel(severityLblProps);
                    lbl_severity.text = log.get("severity");
                    var lbl_message = Ti.UI.createLabel(messageLblProps);
                    lbl_message.text = log.get("message");
                    row.add(lbl_time);
                    row.add(lbl_severity);
                    row.add(lbl_message);
                    row.addEventListener("click", function(e) {
                        CloudClock.managerOptions.restartTimeout();
                        var children = e.row.getChildren();
                        var messageLbl = Ti.UI.createLabel({
                            top: 30,
                            width: "90%",
                            text: children[2].text.length > 1e3 ? children[2].text.substring(0, 1e3) : children[2].text,
                            font: {
                                fontSize: "28dp"
                            },
                            color: "#333",
                            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                        });
                        var msgView = Ti.UI.createScrollView({
                            contentWidth: "auto",
                            contentHeight: "auto",
                            showVerticalScrollIndicator: true,
                            showHorizontalScrollIndicator: true,
                            top: "25%",
                            left: "25%",
                            height: "50%",
                            width: "50%",
                            zIndex: 1,
                            backgroundColor: "#fff",
                            borderRadius: 20,
                            borderColor: "#000"
                        });
                        var closeLbl = Ti.UI.createLabel({
                            top: 10,
                            right: 10,
                            text: "X Close"
                        });
                        closeLbl.addEventListener("click", function() {
                            CloudClock.managerOptions.restartTimeout();
                            CloudClock.managerOptions.managerOptions.remove(msgView);
                            msgView = null;
                        });
                        msgView.add(messageLbl);
                        msgView.add(closeLbl);
                        CloudClock.managerOptions.managerOptions.add(msgView);
                    });
                    logsTableData.push(row);
                    row = null;
                    lbl_time = null;
                    lbl_severity = null;
                    lbl_message = null;
                });
                $.logs.setData(logsTableData);
                logsTableData = null;
                CloudClock.managerOptions.activityIndicator.hide();
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function updateUI() {
            CloudClock.managerOptions && CloudClock.managerOptions.activityIndicator.show();
            Alloy.Collections.logging.sortByTimeDesc();
            makeLogstable();
            $.timeArrow.setTransform(down);
            $.severityArrow.setTransform(up);
        }
        function addEventListeners() {
            $.time.addEventListener("click", function() {
                CloudClock.managerOptions.activityIndicator.show();
                CloudClock.managerOptions.restartTimeout();
                if ("desc" === this.order) {
                    Alloy.Collections.logging.sortByTimeAsc();
                    $.timeArrow.setTransform(up);
                    this.order = "asc";
                    makeLogstable();
                } else {
                    Alloy.Collections.logging.sortByTimeDesc();
                    $.timeArrow.setTransform(down);
                    this.order = "desc";
                    makeLogstable();
                }
            });
            $.severity.addEventListener("click", function() {
                CloudClock.managerOptions.activityIndicator.show();
                CloudClock.managerOptions.restartTimeout();
                if ("desc" === this.order) {
                    Alloy.Collections.logging.sortBySeverityAsc();
                    $.severityArrow.setTransform(up);
                    this.order = "asc";
                    makeLogstable();
                } else {
                    Alloy.Collections.logging.sortBySeverityDesc();
                    $.severityArrow.setTransform(down);
                    this.order = "desc";
                    makeLogstable();
                }
            });
        }
        try {
            require("api");
            var matrix = Ti.UI.create2DMatrix();
            var up = matrix.rotate(180);
            var down = matrix.rotate(360);
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