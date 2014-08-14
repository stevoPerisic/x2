migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"id": "integer",
			"language": "text",
			"helpText": "text",
			"helpAudioFile": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
