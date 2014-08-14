var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "text",
            value: "text",
            sortOrder: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "parameters"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function(attrs) {
                attrs.sortOrder = attrs.order;
                delete attrs.order;
                if (-1 === this.get("id").indexOf("CELLCARR")) {
                    var currentParam = Ti.App.Properties.getString(this.get("id"));
                    if (currentParam && currentParam !== this.get("value").toString()) {
                        console.log("Changing the value of " + this.get("id") + " parameter!!!");
                        CloudClock.log && CloudClock.log("Info", "The value of the " + this.get("id") + " parameter has changed from: " + currentParam + " to " + this.get("value").toString());
                    }
                    Ti.App.Properties.setString(this.get("id"), this.get("value").toString());
                }
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("Parameters innitialized....");
            },
            getCellCarriersNames: function() {
                var arr = [];
                var l = this.models.length;
                for (var i = 0; l > i; i++) -1 !== this.models[i].get("id").indexOf("CELLCARR") && arr.push(this.models[i].get("value"));
                return arr;
            }
        });
        return Collection;
    }
};

model = Alloy.M("parameters", exports.definition, [ function(migration) {
    migration.name = "parameters";
    migration.id = "201405121348323";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                id: "text",
                value: "text",
                sortOrder: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("parameters", exports.definition, model);

exports.Model = model;

exports.Collection = collection;