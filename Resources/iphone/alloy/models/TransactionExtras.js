var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            idType: "text",
            employeeBadge: "text",
            transType: "text",
            transTime: "text",
            parameters: "text",
            state: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "transactionExtras"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nTransaction extras initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("transactionExtras", exports.definition, [ function(migration) {
    migration.name = "transactionExtras";
    migration.id = "201405121349170";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                idType: "text",
                employeeBadge: "text",
                transType: "text",
                transTime: "text",
                parameters: "text",
                state: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("transactionExtras", exports.definition, model);

exports.Model = model;

exports.Collection = collection;