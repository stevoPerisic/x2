module.exports = {

	context: {},

	changeActualTimeDialog: Ti.UI.createAlertDialog({
		title: 'ENTER THE ACTUAL TIME, FORMAT: YYYY-MM-DD HH:MM',
		androidView: Ti.UI.createTextField({
			backgroundColor: '#fff',
			keyboardType: Ti.UI.KEYBOARD_NAMEPHONE_PAD,
			color: "#333"
		}),
		buttonNames: ['OK']
	}),

	newTime: {},

	init: function(_context){
		var that = this;

		that.context = _context;

		that.changeActualTimeDialog.androidView.addEventListener('change', that.context.restartTimeout);

		that.changeActualTimeDialog.addEventListener('click', function(that){
			var newActualTime = '';
			var newActualTimeSeconds = 0;
			var date = this.androidView.value.slice(0, 10);
			var time = this.androidView.value.slice(11, 16);

			newActualTime = date+"T"+time+":11-05:00";

			console.log(newActualTime);

			newActualTimeSeconds = Math.round((new Date(newActualTime)).getTime() / 1000);

			console.log(newActualTimeSeconds);

			that.newTime = {newActualTime: newActualTime, newActualTimeSeconds: newActualTimeSeconds};
		});

		that.changeActualTimeDialog.show();
	}
};