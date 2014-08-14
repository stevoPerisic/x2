//**************************************************
//*******	HEADER CONTROLLER	****************
//**************************************************
(function(){
	try{
		// private fns
		function helpButton_click(e){
			// basically just set the flag for help ON/OFF
			CloudClock.playHelp = (CloudClock.playHelp) ? false : true;
			e.source.setBackgroundColor( (CloudClock.playHelp) ? '#62bb47' : '#FFF');

			if(CloudClock.playHelp){
				Alloy.Collections.deviceHelp.audioPlayer.play();
			}else{
				if(CloudClock.sound)
					CloudClock.sound.stop();
			}
				
			// OLD STUFF 
			// try
			// {
			// 	var viewNo = $.helpButton.viewNo;
			// 	var language = $.helpButton.employeeLang;
			// 	var typeOfHelpFile = $.helpButton.typeOfHelpfile;
			// 	var url = docsDir + 'helpFiles/' + language + '_' + viewNo + '.mp3';

			// 	function startHelpPlayer(){
			// 		Alloy.createController('helpPlayer');
			// 		$.parent.add(CloudClock.helpPlayer.helpPlayer);
			// 		CloudClock.helpPlayer.helpPlayer.show();
			// 		if(OS_IOS){
			// 			CloudClock.helpPlayer.helpPlayer.animate({
			// 				right: '20dp',
			// 				duration: 500
			// 			});
			// 		}
					
			// 		CloudClock.helpPlayer.play(language, viewNo);
			// 	}
				
			// 	if(CloudClock.helpPlayer === null || _.isUndefined(CloudClock.helpPlayer)){
			// 		console.log('Help player IS null or undefined!');
			// 		startHelpPlayer();
			// 	}else{
			// 		console.log('Help player is not null or undefined!');
			// 		$.parent.remove(CloudClock.helpPlayer.helpPlayer);
			// 		CloudClock.helpPlayer = null;
			// 		startHelpPlayer();
			// 	}
			// }
			// catch(error)
			// {
			// 	console.log(error);
			// 	CloudClock.error(error);
			// }
		}

		function exit_click(e){
			try{
				// no action taken if an API call is in progress
				if(CloudClock.APIcallInProgress)
					return false;

				// stop the audio help
				if(CloudClock.sound)
					CloudClock.sound.stop();

				$.exit.removeEventListener('click', exit_click);
				if(e.screenTimedOut){
					$.parent.screenTimedOut = e.screenTimedOut;
				}

				$.exit.enabled = false;

				console.log('\n\n\nParent win: '+JSON.stringify($.parent));

				if($.parent.id === 'cameraWindow')
					CloudClock.stopCapture();

				$.parent.close();
			}catch(error){
				CloudClock.error(error);
			}

			CloudClock.clock.showEmployeeFlowDialog = false;
			CloudClock.clock.showEmployeeOptionsDialog = false;
			CloudClock.clock.showManagerOptionsDialog = false;

			CloudClock.sessionObj.clearSession();

			Alloy.createController('index', {doNotSetParams: true});
		}

		function setLanguage(){
			if(OS_IOS){
				$.exitLbl.setText(CloudClock.customL.strings('start_over'));
				$.helpBtnLbl.setText(CloudClock.customL.strings('help'));
			}else{
				$.exit.setTitle(CloudClock.customL.strings('start_over'));
				$.helpButton.setTitle(CloudClock.customL.strings('help'));
			}
		}

		exports.setLanguage = function(){
			setLanguage();
		};

		function addEventListeners(){
			$.helpButton.addEventListener('click', helpButton_click);

			$.exit.addEventListener('click', function(e){
				try{
					_.debounce(exit_click(e), 0, true);
				}catch(error){

					console.log('Trying to bind the exit button event in the header.'+error);
					CloudClock.error(error);
					Alloy.createController('index', {doNotSetParams: true});
				}
			});

			// NOTE: 
			// CAN NOT SUM THIS UP IN A SINGLE FN BECAUSE THE BUTTONS ARE COMPLETELY DIOFFERENTLY CONSTRUCTED IN ANDROID AND IOS
			// PERHAPS DOWN THE ROAD (as a refactor task) STOP USING BUTTONS AND USE LABELS OR VIEWS INSTEAD

			$.exit.addEventListener('touchstart', function(e){
				e.source.backgroundColor = '#34aadc';

				if(OS_IOS){
					var children = $.exit.getChildren();
					children[0].setImage('/images/icons/start-over-32-white.png');
					children[1].color = '#fff';
				}
				else
				{
					e.source.color = '#fff';
					e.source.image = '/images/icons/start-over-32-white.png';
				}
			});

			$.exit.addEventListener('touchend', function(e){
				e.source.backgroundColor = '#FFF';

				if(OS_IOS){
					var children = $.exit.getChildren();
					children[0].setImage('/images/icons/start-over-32-blk.png');
					children[1].color = '#333';
				}
				else
				{
					e.source.color = '#333';
					e.source.image = '/images/icons/start-over-32-blk.png';
				}
			});

			$.helpButton.addEventListener('touchstart', function(e){
				e.source.setBackgroundColor('#34aadc');

				if(OS_IOS){
					var children = $.helpButton.getChildren();
					children[0].setImage('/images/icons/help-32-white.png');
					children[1].setColor('#fff');
				}else{
					e.source.color = '#fff';
					e.source.image = '/images/icons/help-32-white.png';
				}
			});

			$.helpButton.addEventListener('touchend', function(e){
				// e.source.setBackgroundColor( (CloudClock.playHelp) ? '#62bb47' : '#FFF');

				if(OS_IOS){
					var children = $.helpButton.getChildren();
					children[0].setImage('/images/icons/help-32-blk.png');
					children[1].setColor('#333');
				}else{
					e.source.color = '#333';
					e.source.image = '/images/icons/help-32-blk.png';
				}
			});
		}

		addEventListeners();
		//set language
		setLanguage();
		//

		$.helpButton.setBackgroundColor( (CloudClock.playHelp) ? '#62bb47' : '#FFFF16');
		
	}catch(error){
		CloudClock.error(error);
	}
}());





