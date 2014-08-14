exports.definition = {
	config: {
		columns: {
			departmentNum: "integer",
			abbrev: "text",
			name: "text",
			departmentCode: "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "departments"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			initialize: function(){
				console.log('\n\n\nDepartments initialize...');
			}
		});

		return Collection;
	}
};