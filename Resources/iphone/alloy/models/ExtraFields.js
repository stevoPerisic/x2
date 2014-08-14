var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            name: "text",
            desc: "text",
            value: "text",
            type: "text",
            decimals: "integer",
            maxLength: "integer",
            required: "integer",
            sortOrder: "integer",
            listCount: "integer",
            list: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "extraFields"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            initialize: function(attrs) {
                _.each(attrs, function(attr, i) {
                    if (_.isArray(attr)) {
                        console.log("we have an array..");
                        console.log(attr);
                        var newList = JSON.stringify(attr);
                        attrs[i] = newList;
                    }
                    console.log(attrs);
                });
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nExtra fields initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("extraFields", exports.definition, [ function(migration) {
    migration.name = "extraFields";
    migration.id = "201405121348702";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                name: "text",
                desc: "text",
                value: "text",
                type: "text",
                decimals: "integer",
                maxLength: "integer",
                required: "integer",
                sortOrder: "integer",
                listCount: "integer",
                list: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("extraFields", exports.definition, model);

exports.Model = model;

exports.Collection = collection;