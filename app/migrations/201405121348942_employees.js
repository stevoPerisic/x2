migration.up = function(migrator) {
	migrator.createTable({columns: {
			badge: "integer",
			pin: "integer",
			name: "text",
			primaryDeptNum: "integer",
			// mostUsedDeptNum: "integer",
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
};

migration.down = function(migrator) {
	migrator.dropTable();
};
