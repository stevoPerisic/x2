migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"messageId": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
