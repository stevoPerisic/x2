exports.definition = {
	config: {
		columns: {
			id: "text",
			value: "text",
			sortOrder: "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "parameters"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			initialize: function(attrs){
				//CAN NOT HAVE A COLUMN NAMED ORDER IN SQL :) SO WE CHANGE IT TO sortOrder
				attrs.sortOrder = attrs.order;
				delete attrs.order;

				//SET Ti.App.Properties
				if(this.get('id').indexOf('CELLCARR') === -1){
					//console.log(JSON.stringify(this));
					var currentParam = Ti.App.Properties.getString(this.get('id'));
					if(currentParam && currentParam !== this.get('value').toString()){
						console.log('Changing the value of ' + this.get('id') + ' parameter!!!');
						if(CloudClock.log){
							CloudClock.log('Info', 'The value of the ' + this.get('id') + ' parameter has changed from: ' + currentParam + ' to ' + this.get('value').toString());
							//HANDLE THIS DOWN THE ROAD
							//Ti.App.fireEvent(this.get('id')+'Changed');
						}
					}
					Ti.App.Properties.setString(this.get('id'), this.get('value').toString());
					//THERE WAS AN ISSUE WITH THE LOG ON THIS IT WOULD CRASH, HOPE THIS DOES NOT AFFECT THE APP DOWN THE ROAD :(
					//console.log('Changed local App.Properties');
				}
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			initialize: function(){
				console.log('Parameters innitialized....');
			},
			getCellCarriersNames: function(){
				var arr = [];
				var l = this.models.length;

				for(var i = 0; i < l; i++ ){
					if(this.models[i].get('id').indexOf('CELLCARR') !== -1){
						//console.log(this.models[i].get('id'));
						//var temp = {};
						//temp[i] = this.models[i].get('value');
						arr.push(this.models[i].get('value'));
					}
				}

				return arr;
			}
		});

		return Collection;
	}
};