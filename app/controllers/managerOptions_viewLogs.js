

//**************************************************
//*******	MANAGER OPTIONS LOGS CONTROLLER	****************
//*************************************************
var args = arguments[0] || {};
Ti.API.info('Args Data: ' + JSON.stringify(args.data));
(function(){
	try{

		function makeLogstable(){
			try
			{
				var logsTableData = [];

				var logsTableViewRowProps = {
					className: 'logsTableEntry',
					height: Ti.UI.FILL,
					width: '100%'
				};

				var timeLblProps = {
					width: '17%',
					left: '1%',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					font: {
						fontSize: '12dp'
					},
					color: '#333'
				};

				var severityLblProps = {
					width: '17%',
					left: '17%',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					font: {
						fontSize: '14dp'
					},
					color: '#333'
				};

				var messageLblProps = {
					width: '63%',
					left: '34%',
					font: {
						fontSize: '14dp'
					},
					color: '#333'
				};

				_.each(Alloy.Collections.logging.models, function(log, i){
				
					var row = Ti.UI.createTableViewRow(logsTableViewRowProps);
					var lbl_time = Ti.UI.createLabel(timeLblProps);
					lbl_time.text = log.get('readableTime');
					var lbl_severity = Ti.UI.createLabel(severityLblProps);
					lbl_severity.text = log.get('severity');
					var lbl_message = Ti.UI.createLabel(messageLblProps);
					lbl_message.text = log.get('message');

					row.add(lbl_time);
					row.add(lbl_severity);
					row.add(lbl_message);

					// this added to be able to see the full error messages
					row.addEventListener('click', function(e){
						CloudClock.managerOptions.restartTimeout();
						var children = e.row.getChildren();
						var messageLbl = Ti.UI.createLabel({
							top: 30,
							width: '90%',
							text: (children[2].text.length > 1000) ? children[2].text.substring(0, 1000) : children[2].text,
							font: {
								fontSize: '28dp'
							},
							color: '#333',
							textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
						});
						var msgView = Ti.UI.createScrollView({
							contentWidth: 'auto',
							contentHeight: 'auto',
							showVerticalScrollIndicator: true,
							showHorizontalScrollIndicator: true,
							top: '25%',
							left: '25%',
							height: '50%',
							width: '50%',
							zIndex: 1,
							backgroundColor: '#fff',
							borderRadius: 20,
							borderColor: '#000'
						});
						var closeLbl = Ti.UI.createLabel({
							top: 10,
							right: 10,
							text: 'X Close'
						});
						closeLbl.addEventListener('click', function(){
							CloudClock.managerOptions.restartTimeout();
							CloudClock.managerOptions.managerOptions.remove(msgView);
							msgView = null;
						});
						msgView.add(messageLbl);
						msgView.add(closeLbl);
						CloudClock.managerOptions.managerOptions.add(msgView);
					});

					logsTableData.push(row);

					row = null;
					lbl_time = null;
					lbl_severity = null;
					lbl_message = null;
				});

				$.logs.setData(logsTableData);
				logsTableData = null;

				CloudClock.managerOptions.activityIndicator.hide();
			}
			catch(error)
			{
				CloudClock.error(error);
			}
		}

		function updateUI(){
			if(CloudClock.managerOptions){CloudClock.managerOptions.activityIndicator.show();}

			Alloy.Collections.logging.sortByTimeDesc();

			makeLogstable();

			$.timeArrow.setTransform(down);

			$.severityArrow.setTransform(up);
		}

		function addEventListeners(){
			$.time.addEventListener('click', function(e){
				CloudClock.managerOptions.activityIndicator.show();

				CloudClock.managerOptions.restartTimeout();

				if(this.order === 'desc'){
					Alloy.Collections.logging.sortByTimeAsc();

					$.timeArrow.setTransform(up);

					this.order = 'asc';
					makeLogstable();
				}else{
					Alloy.Collections.logging.sortByTimeDesc();

					$.timeArrow.setTransform(down);

					this.order = 'desc';
					makeLogstable();
				}
			});

			$.severity.addEventListener('click', function(e){
				CloudClock.managerOptions.activityIndicator.show();

				CloudClock.managerOptions.restartTimeout();

				if(this.order === 'desc'){
					Alloy.Collections.logging.sortBySeverityAsc();

					$.severityArrow.setTransform(up);

					this.order = 'asc';
					makeLogstable();
				}else{
					Alloy.Collections.logging.sortBySeverityDesc();

					$.severityArrow.setTransform(down);

					this.order = 'desc';
					makeLogstable();
				}
			});
		}

		var api = require('api');
		var matrix = Ti.UI.create2DMatrix();
		var up = matrix.rotate(180);
		var down = matrix.rotate(360);

		updateUI();

		addEventListeners();

		CloudClock.managerOptions.restartTimeout();

	}catch(error){
		CloudClock.error(error);
	}
}());





// moved to the event that triggers this controller
// Alloy.Collections.logging.fetch();






