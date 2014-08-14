exports.definition = {
	config: {
		columns: {
			"idType": "text",
			"employeeBadge": "text",
			"transType": "text",
			"transTime": "text",
			"parameters": "text",
			"state": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "transactionExtras"
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
				console.log('\n\n\nTransaction extras initialize...');
			}
		});

		return Collection;
	}
};