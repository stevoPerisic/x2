migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			recId: "text",
			badge: "integer",
			departmentNum: "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
