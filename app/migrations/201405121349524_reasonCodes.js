migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"reasonCodeID": "integer",
			"reasonCodeType": "integer",
			"reasonCodeName": "text",
			"reasonLabel": "text",
			"recordStatus": "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
