migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"name": "text",
			"desc": "text",
			"value": "text",
			"type": "text",
			"decimals": "integer",
			"maxLength": "integer",
			"required": "integer",
			"sortOrder": "integer",
			"listCount": "integer",
			"list": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
