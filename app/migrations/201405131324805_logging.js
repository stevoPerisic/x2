migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"severity": "text",
			"message": "text",
			"time": "integer",
			"readableTime": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.droptTable();
};
