exports.definition = {
	config: {
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
		},
		adapter: {
			type: "sql",
			collection_name: "extraFields"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(attrs){
				// in case one of the attributes is an array of objects we stringify it and save
				// in this case it is the 'list' attribute
				_.each(attrs, function(attr, i){
					if(_.isArray(attr)){
						console.log('we have an array..');
						console.log(attr);

						var newList = JSON.stringify(attr);
						attrs[i] = newList;
					}

					console.log(attrs);
				});
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			initialize: function(){
				console.log('\n\n\nExtra fields initialize...');
			}
		});

		return Collection;
	}
};