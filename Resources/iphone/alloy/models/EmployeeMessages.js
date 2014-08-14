var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            messageId: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "employeeMessages"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nEmployee messages initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("employeeMessages", exports.definition, [ function(migration) {
    migration.name = "employeeMessages";
    migration.id = "201405121348855";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                messageId: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("employeeMessages", exports.definition, model);

exports.Model = model;

exports.Collection = collection;