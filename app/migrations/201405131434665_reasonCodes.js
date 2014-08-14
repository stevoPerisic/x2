migration.up = function(migrator) {
	try{
		var seqCol = migrator.db.execute('SELECT seq FROM '+migrator.table+';');
	}catch(error){
		migrator.db.execute('ALTER TABLE '+migrator.table+' ADD COLUMN seq INT');
		// set the flag to go get new data from the host
		CloudClock.migratedUp = true;
	}
};

migration.down = function(migrator) {
	var db = migrator.db;
	var table = migrator.table;
	db.execute('CREATE TEMPORARY TABLE reasonCodes_backup(reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id);');
	db.execute('INSERT INTO reasonCodes_backup SELECT reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id FROM '+table+';');
	db.dropTable();
	db.createTable({
		columns: {
			"reasonCodeID": "integer",
			"reasonCodeType": "integer",
			"reasonCodeName": "text",
			"reasonLabel": "text",
			"recordStatus": "integer"
		}
	});
	db.execute('INSERT INTO '+table+' SELECT reasonCodeID, reasonCodeType, reasonCodeName, reasonLabel, recordStatus, alloy_id FROM reasonCodes_backup;');
	db.execute('DROP TABLE reasonCodes_backup');
};
