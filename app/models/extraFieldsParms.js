exports.definition = {
	config: {
		columns: {
			"templateId": "integer",
			"promptPoint": "text",
			"allowcancel": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "extraFieldsParms"
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
				console.log('\n\n\nExtra fields parms initialize...');
			}
		});

		return Collection;
	}
};