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
    this.__controllerPath = "employeeFlow_timecardDetailRow";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        borderColor: "red",
        borderWidth: 1,
        backgroundColor: "#fcfcfc",
        height: "44dp",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.day = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "10dp",
        id: "day"
    });
    $.__views.row.add($.__views.day);
    $.__views.date = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        left: "80dp",
        id: "date"
    });
    $.__views.row.add($.__views.date);
    $.__views.hours = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333",
        right: "15dp",
        id: "hours"
    });
    $.__views.row.add($.__views.hours);
    exports.destroy = function() {};
    _.extend($, $.__views);
    console.log("Timecard Detail Row for Daily Summary being read....");
    var args = arguments[0] || {};
    var weekEnding = args.weekEnding;
    var dayNumber = args.dayNumber;
    var hours = args.hours;
    var day;
    var date;
    if ("N/A" !== args.weekEnding) {
        day = moment(weekEnding, "MM-DD-YYYY").subtract("days", 6 - dayNumber).format("ddd");
        date = moment(weekEnding, "MM-DD-YYYY").subtract("days", 6 - dayNumber).format("MM[/]DD");
        $.day.setText(day);
        $.date.setText(date);
        $.hours.setText(hours);
        if (args.hrsVerif_dayNumber) {
            $.row.hrsVerif_dayNumber = args.hrsVerif_dayNumber;
            $.row.hrsVerif_date = moment(weekEnding, "MM-DD-YYYY").subtract("days", 6 - dayNumber).format("MM[/]DD[/]YYYY");
            $.row.hrsVerif_unix = moment($.row.hrsVerif_date).unix();
        }
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;