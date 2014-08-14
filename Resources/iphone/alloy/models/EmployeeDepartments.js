var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            recId: "text",
            badge: "integer",
            departmentNum: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "employeeDepartments"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nEmployee departments initialize...");
            },
            getByEmployeeBadge: function(_employeeBadge) {
                var arr = [];
                var l = this.models.length;
                for (var i = 0; l > i; i++) this.models[i].get("badge") === _employeeBadge && arr.push(this.models[i]);
                return arr;
            }
        });
        return Collection;
    }
};

model = Alloy.M("employeeDepartments", exports.definition, [ function(migration) {
    migration.name = "employeeDepartments";
    migration.id = "201405121347820";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                recId: "text",
                badge: "integer",
                departmentNum: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
} ]);

collection = Alloy.C("employeeDepartments", exports.definition, model);

exports.Model = model;

exports.Collection = collection;