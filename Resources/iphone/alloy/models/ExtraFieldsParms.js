var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            templateId: "integer",
            promptPoint: "text",
            allowcancel: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "extraFieldsParms"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nExtra fields parms initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("extraFieldsParms", exports.definition, [ function(migration) {
    migration.name = "extraFieldsParms";
    migration.id = "201405121348140";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                templateId: "integer",
                promptPoint: "text",
                allowcancel: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("extraFieldsParms", exports.definition, model);

exports.Model = model;

exports.Collection = collection;