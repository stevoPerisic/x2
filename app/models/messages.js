exports.definition = {
	config: {
		columns: {
			"messageId": "text",
			"language": "text",
			"value": "text",
			"required": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "messages"
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
				console.log('\n\n\nMessages initialize...');
			}
		});

		return Collection;
	}
};