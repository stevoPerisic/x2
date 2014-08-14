//**************************************************
//*******	HELP PLAYER CONTROLLER	****************
//**************************************************
(function(){
	try{
		//private fn's
		exports.play = function(language, viewNo){
			try
			{
				setLanguage();

				var helpMessageLang = formatLang(language);
				var soundLang = formatLangForSound(language);
				var helpMessage = Alloy.Collections.deviceHelp.where({
					id: parseInt(viewNo, 10),
					language: helpMessageLang
				});

				// check if the help audio file exists
				var helpfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'helpFiles/' + soundLang + '_' + viewNo + '.mp3');

				if(helpfile.exists()){
					//alert(helpfile.exists());
					//alert(JSON.stringify(helpfile));
					$.helpText.setText(helpMessage[0].get('helpText'));

					helpMessage = null;

					sound = Titanium.Media.createSound({
						url:docsDir + 'helpFiles/' + soundLang + '_' + viewNo + '.mp3' // could be http url too!
					});

					sound.play();
				}else{
					$.helpPlayer.noAudio = 1;
					$.helpText.setText(helpMessage[0].get('helpText') + '\nAudio Not Available.');
				}
			}
			catch(error)
			{
				console.log('Help player play fn: '+error);
				CloudClock.error(error);
			}
		};

		function formatLang(language){
			if(language === 'EN' || language === 'en-us' || language === 'en_us' || language === 'en-US'){
				//console.log('English');
				return 'en-US';
			}else if(language === 'es'){
				//console.log('Spanish');
				return 'es-US';
			}else if(language === 'fr'){
				//console.log('French');
				return 'fr-US';
			}else{
				//console.log('English');
				return 'en-US';
			}
		}

		function formatLangForSound(language){
			if(language === 'EN' || language === 'en-us' || language === 'en_us' || language === 'en-US'){
				//console.log('English');
				return 'EN';
			}else if(language === 'es'){
				//console.log('Spanish');
				return 'ES';
			}else if(language === 'fr'){
				//console.log('French');
				return 'FR';
			}else{
				//console.log('English');
				return 'EN';
			}
		}

		function play_click(e){
			$.playBtn.removeEventListener('click', play_click);

			if($.helpPlayer.noAudio !== 1){
				sound.play();
			}

			$.playBtn.addEventListener('click', play_click);
		}

		function stop_click(e){
			$.stopBtn.removeEventListener('click', stop_click);

			if($.helpPlayer.noAudio !== 1){
				sound.stop();
			}

			if (Ti.Platform.name === 'android'){sound.release();}

			$.stopBtn.addEventListener('click', stop_click);
		}

		function changeColor(e){
			e.source.backgroundColor = (e.type === 'touchstart') ? '#34aadc' : '#fff';
		}

		function closeHelpPlayer(e){
			//$.closeHelp.removeEventListener('click', closeHelpPlayer);
			
			if(OS_IOS){
				$.helpPlayer.animate({
					right: -400,
					duration: 500
				}, function(){
					if($.helpPlayer.noAudio !== 1){
						sound.stop();
					}
					$.helpPlayer.hide();
					$.destroy();
					CloudClock.helpPlayer = null;
				});
			}else{
				if($.helpPlayer.noAudio !== 1){
					sound.stop();
				}
				$.helpPlayer.hide();
				$.destroy();
				CloudClock.helpPlayer = null;
			}
		}

		function setLanguage(){
			if(OS_IOS){
				$.closeHelpLbl.setText(CloudClock.customL.strings('close'));
			}
			else{
				$.closeHelp.setTitle(CloudClock.customL.strings('close'));
			}
		}

		function addEventListeners(){
			$.stopBtn.addEventListener('click', stop_click);
			$.stopBtn.addEventListener('touchstart', changeColor);
			$.stopBtn.addEventListener('touchend', changeColor);
			$.playBtn.addEventListener('click', play_click);
			$.playBtn.addEventListener('touchstart', changeColor);
			$.playBtn.addEventListener('touchend', changeColor);
			$.closeHelp.addEventListener('click', closeHelpPlayer);
		}

		CloudClock.helpPlayer = $;
		var docsDir = Ti.Filesystem.getApplicationDataDirectory();
		var sound;

		addEventListeners();

	}catch(error){
		CloudClock.error(error);
	}
}());







