migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			idType: "text", //P or U depending on if new employee or not
			employeeBadge: "integer", // if P than this is PIN number else this is badge number
			transType: "text", // punch-In or punch-Out I or U
			departmentNum: "integer", // department under which the clock in occured 
			transTime: "integer", // time seconds past 1970 use var d = new Date(); var n = d.getTime(); instead of moment.js
			transDateTime: "text", // Readable time stamp. will convert the transTime into readable time using moment.js
			initials: "text", // in case of new employee the initials entered,
			photoFileName: "text",
			photoTime: "integer",
			photoData: "text",
			shiftID: "integer",
			overrideFlag: "integer",
			sent: "integer", // 0 - unsent, 1 - sent, 2 - toBeSent
			reasonCodeID: "integer",
			reasonCodeType: "integer",
			amount: "integer"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable();
};
