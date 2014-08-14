migration.up = function(migrator) {
	migrator.db.execute('ALTER TABLE '+migrator.table+' ADD COLUMN mostUsedDeptNum INT;');

	// set the flag to go get new data from the host
	CloudClock.migratedUp = true;
};

migration.down = function(migrator) {
	var db = migrator.db;
	var table = migrator.table;
	db.execute('CREATE TEMPORARY TABLE employees_backup(badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id);');
	db.execute('INSERT INTO employees_backup SELECT badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id FROM '+table+';');
	db.dropTable();
	db.createTable({
		columns: {
			badge: "integer",
			pin: "integer",
			name: "text",
			primaryDeptNum: "integer",
			allowOpenDept: "numeric",
			byPassBio: "numeric",
			requestPTO: "numeric",
			scheduleReport: "text",
			replyTo: "text",
			lang: "text",
			fixPunch: "numeric",
			cellPhone: "text",
			cellCarrier: "text",
			email: "text",
			isBioRegistered: "numeric",
			type1: "text",
			type2: "text",
			photoFileName: "text",
			photoData: "text"
		}
	});
	db.execute('INSERT INTO '+table+' SELECT badge, pin, name, primaryDeptNum, allowOpenDept, byPassBio, requestPTO, scheduleReport, replyTo, lang, fixPunch, cellPhone, cellCarrier, email, isBioRegistered, type1, type2, photoFileName, photoData, alloy_id FROM employees_backup;');
	db.execute('DROP TABLE employees_backup');
};
