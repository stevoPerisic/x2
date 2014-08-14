// REASON CODES


// 1              Very Early In
// 2              Early In
// 3              Repunch
// 4              Normal In
// 5              Early Break In
// 6              Break In
// 7              Normal Out
// 8              Out No Break
// 9              Late Out
// 10           Time Correction
// 11           AutoBreak
// 12           Short Break
// 13           Long Break
// 14           Late IN
// 15           Early Out
// 16           Very Late Out
// 17           Start Over-Leaving For day?
// 18           Timed out-Leaving For day?
// 19           Start Over-Did you take Break?
// 20           Timed Out-Did you take Break?
// 21           Start Over-Enter Break Amount
// 22           Timed Out-Enter Break Amount
// 23           NO to Leaving for day?
// 24           Start Over-Confirm Break Amount
// 25           Timed Out-Confirm Break Amount


exports.definition = {
	config: {
		columns: {
			"reasonCodeID": "integer",
			"reasonCodeType": "integer",
			"reasonCodeName": "text",
			"reasonLabel": "text",
			"seq": "integer",
			"recordStatus": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "reasonCodes"
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
				console.log('\n\n\nReason codes initialize...');
			},
			reasonCodeTypes: {
				1: 'Very Early In',
				2: 'Early In',
				3: 'Repunch',
				4: 'Normal In',
				5: 'Early Break In',
				6: 'Break In',
				7: 'Normal Out',
				8: 'Out No Break',
				9: 'Late Out',
				10: 'Time Correction',
				11: 'AutoBreak',
				12: 'Short Break',
				13: 'Long Break',
				14: 'Late IN',
				15: 'Early Out',
				16: 'Very Late Out',
				17: 'Start Over-Leaving For day?',
				18: 'Timed out-Leaving For day?',
				19: 'Start Over-Did you take Break?',
				20: 'Timed Out-Did you take Break?',
				21: 'Start Over-Enter Break Amount',
				22: 'Timed Out-Enter Break Amount',
				23: 'NO to Leaving for day?',
				24: 'Start Over-Confirm Break Amount',
				25: 'Timed Out-Confirm Break Amount'
			}
		});

		return Collection;
	}
};