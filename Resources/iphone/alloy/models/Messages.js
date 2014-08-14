var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            messageId: "text",
            language: "text",
            value: "text",
            required: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "messages"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nMessages initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("messages", exports.definition, [ function(migration) {
    migration.name = "messages";
    migration.id = "201405121348204";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                messageId: "text",
                language: "text",
                value: "text",
                required: "text"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("messages", exports.definition, model);

exports.Model = model;

exports.Collection = collection;