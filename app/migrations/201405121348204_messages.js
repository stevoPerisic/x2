migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"messageId": "text",
			"language": "text",
			"value": "text",
			"required": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
