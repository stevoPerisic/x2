migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			departmentNum: "integer",
			abbrev: "text",
			name: "text",
			departmentCode: "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
