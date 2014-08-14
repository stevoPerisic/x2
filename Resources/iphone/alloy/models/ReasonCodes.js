var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            reasonCodeID: "integer",
            reasonCodeType: "integer",
            reasonCodeName: "text",
            reasonLabel: "text",
            seq: "integer",
            recordStatus: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "reasonCodes"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            initialize: function() {
                console.log("\n\n\nReason codes initialize...");
            },
            reasonCodeTypes: {
                1: "Very Early In",
                2: "Early In",
                3: "Repunch",
                4: "Normal In",
                5: "Early Break In",
                6: "Break In",
                7: "Normal Out",
                8: "Out No Break",
                9: "Late Out",
                10: "Time Correction",
                11: "AutoBreak",
                12: "Short Break",
                13: "Long Break",
                14: "Late IN",
                15: "Early Out",
                16: "Very Late Out",
                17: "Start Over-Leaving For day?",
                18: "Timed out-Leaving For day?",
                19: "Start Over-Did you take Break?",
                20: "Timed Out-Did you take Break?",
                21: "Start Over-Enter Break Amount",
                22: "Timed Out-Enter Break Amount",
                23: "NO to Leaving for day?",
                24: "Start Over-Confirm Break Amount",
                25: "Timed Out-Confirm Break Amount"
            }
        });
        return Collection;
    }
};

model = Alloy.M("reasonCodes", exports.definition, [ function(migration) {
    migration.name = "reasonCodes";
    migration.id = "201405121349524";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                reasonCodeID: "integer",
                reasonCodeType: "integer",
                reasonCodeName: "text",
                reasonLabel: "text",
                recordStatus: "integer"
            }
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable();
    };
}, function(migration) {
    migration.name = "reasonCodes";
    migration.id = "201405131434665";
    migration.up = function(migrator) {
        try {
            migrator.db.execute("SELECT seq FROM " + migrator.table + ";");
        } catch (error) {
            migrator.db.execute("ALTER TABLE " + migrator.table + " ADD COLUMN seq INT");
            CloudClock.migratedUp = true;
        }
    };
    migration.down = function(migrator) {
        var db = migrator.db;
        var table = migrator.table;
        db.execute("CREATE TEMPORARY TABLE reasonCodes_backup(reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id);");
        db.execute("INSERT INTO reasonCodes_backup SELECT reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id FROM " + table + ";");
        db.dropTable();
        db.createTable({
            columns: {
                reasonCodeID: "integer",
                reasonCodeType: "integer",
                reasonCodeName: "text",
                reasonLabel: "text",
                recordStatus: "integer"
            }
        });
        db.execute("INSERT INTO " + table + " SELECT reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id FROM reasonCodes_backup;");
        db.execute("DROP TABLE reasonCodes_backup");
    };
} ]);

collection = Alloy.C("reasonCodes", exports.definition, model);

exports.Model = model;

exports.Collection = collection;