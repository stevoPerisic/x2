migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"idType": "text",
			"employeeBadge": "text",
			"transType": "text",
			"transTime": "text",
			"parameters": "text",
			"state": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
