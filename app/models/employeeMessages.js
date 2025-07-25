exports.definition = {
	config: {
		columns: {
			"messageId": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "employeeMessages"
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
				console.log('\n\n\nEmployee messages initialize...');
			}
		});

		return Collection;
	}
};