migration.up = function(migrator) {
	try{
		var sentCol = migrator.db.execute('SELECT sent FROM '+migrator.table+';');
	}catch(error){
		migrator.db.execute('ALTER TABLE '+migrator.table+' ADD COLUMN sent INT');
		CloudClock.migratedUp = true;
	}
};

migration.down = function(migrator) {
	var db = migrator.db;
	var table = migrator.table;
	db.execute('CREATE TEMPORARY TABLE logging_backup(severity, message, time, readableTime, alloy_id);');
	db.execute('INSERT INTO logging_backup SELECT severity, message, time, readableTime, alloy_id FROM '+table+';');
	db.dropTable();
	db.createTable({
		columns: {
			"severity": "text",
			"message": "text",
			"time": "integer",
			"readableTime": "text",
		}
	});
	db.execute('INSERT INTO '+table+' SELECT severity, message, time, readableTime, alloy_id FROM logging_backup;');
	db.execute('DROP TABLE logging_backup');
};
