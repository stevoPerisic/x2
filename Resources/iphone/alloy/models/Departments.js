var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            departmentNum: "integer",
            abbrev: "text",
            name: "text",
            departmentCode: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "departments"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nDepartments initialize...");
            }
        });
        return Collection;
    }
};

model = Alloy.M("departments", exports.definition, [ function(migration) {
    migration.name = "departments";
    migration.id = "201405121347464";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                departmentNum: "integer",
                abbrev: "text",
                name: "text",
                departmentCode: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("departments", exports.definition, model);

exports.Model = model;

exports.Collection = collection;