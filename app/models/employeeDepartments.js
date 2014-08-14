exports.definition = {
	config: {
		columns: {
			recId: "text",
			badge: "integer",
			departmentNum: "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "employeeDepartments"
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
				console.log('\n\n\nEmployee departments initialize...');
			},
			getByEmployeeBadge: function(_employeeBadge){
				var arr = [];
				var l = this.models.length;
				for(var i = 0; i < l; i++ ){
					if(this.models[i].get('badge') === _employeeBadge){
						arr.push(this.models[i]);
					}
				}
				return arr;
			}
		});

		return Collection;
	}
};