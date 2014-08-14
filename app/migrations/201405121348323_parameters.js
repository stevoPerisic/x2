migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			id: "text",
			value: "text",
			sortOrder: "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
