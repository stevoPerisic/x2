migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			"deptShiftID": "integer",
			"displayName": "text",
			"departmentNum": "integer",
			"shiftNum": "integer",
			"applyDay1": "text",
			"applyDay2": "text",
			"applyDay3": "text",
			"applyDay4": "text",
			"applyDay5": "text",
			"applyDay6": "text",
			"applyDay7": "text",
			"shiftStart": "text",
			"shiftEnd": "text",
			"applyBreak": "text",
			"workSpan1": "text",
			"breakLength1": "text",
			"workSpan2": "text",
			"breakLength2": "text",
			"inGraceMinutes": "integer",
			"earlyIn": "text",
			"veryEarlyIn": "text",
			"lateIn": "text",
			"lateOut": "text",
			"veryLateOut": "text",
			"earlyOut": "text",
			"lateInMins": "integer",
			"earlyOutMins": "integer",
			"earlyBreakIn": "text",
			"autoBreak": "text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
