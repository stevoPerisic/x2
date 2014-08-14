migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"templateId": "integer",
			"promptPoint": "text",
			"allowcancel": "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
