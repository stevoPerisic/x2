var args = arguments[0] || {};
var faceDetection = require('com.peoplenet.facedetect');

(function(){
	try{

		function onTrace(e) {
			log(e.name + " : " + e.value);
		}

		function onError(e) {
			log('ERROR ' + e.name + " : " + e.value);
		}

		function log(msg) {
			Ti.API.info(msg);
		}

		function emptyFn(e){
			if(OS_IOS)
			{
				$[e.source.id].removeEventListener('doubletap', emptyFn);
			}
			else
			{
				e.source.removeEventListener('doubletap', emptyFn);
			}
			return false;
		}

		function onStartCapture() {
			if (cameraControl) {
				onStopCapture();
			} else {
				cameraControl = faceDetection.createView({
					backgroundColor : '#fcfcfc',
					faceDetectionFrameRate : 20
				});
				cameraControl.addEventListener('pictureCaptured', onPictureCaptured);
				cameraControl.addEventListener('facesDetected', onFacesDetected);
				$.cameraView.add(cameraControl);
				cameraControl.setupCamera();
			}
		}

		function onStopCapture() {
			if (cameraControl) {
				cameraControl.removeEventListener('pictureCaptured', onPictureCaptured);
				cameraControl.removeEventListener('facesDetected', onFacesDetected);
				cameraControl.cleanup();
				$.cameraView.remove(cameraControl);
				cameraControl = undefined;
			}
		}

		CloudClock.stopCapture = onStopCapture;

		function onPictureCaptured(e) {
			if (e && e.image) {

				try{
					isPhotoAvailable = false;
					log(e.faceImages[0]); // just the face
					log(e.image); // the whole image

					var encodedFace = Ti.Utils.base64encode(e.image).toString();
					
					sessionObj.currentPunch.photoData = encodedFace;

					sessionObj.currentPunch.photoTime = CloudClock.sessionObj.currentPunch.transTime;

					// let's save the pic to master photos if the employee does not have a master photo set
					if(CloudClock.sessionObj.employee.get('photoFileName') === '/images/icons/no-photo-256-gray.png'){
						console.log('Saving master photo.....');
						//alert(CloudClock.sessionObj.employee.get('badge'));
						var masterPicsDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'MasterPhoto');
						var masterFilePath = (OS_IOS) ? CloudClock.sessionObj.employee.get('badge') + '.jpg' : CloudClock.sessionObj.employee.get('badge');
						var masterPicture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, masterFilePath);
						masterPicture.write(encodedFace);
						masterPicture.move('MasterPhoto/' + masterFilePath);
						masterPicture.deleteFile();
						CloudClock.sessionObj.employee.save({photoFileName: 'MasterPhoto/' + masterFilePath});
					}
					
					onStopCapture();

					// now dispatch to next window
					CloudClock.dispatcher.nextWindow({
						context: $
					});

					//$.cameraWindow.close();
				}catch(error){
					CloudClock.error(error);
				}
			}
		}

		function onTakePicture() {
			if (cameraControl && isPhotoAvailable) {
				isPhotoAvailable = false;
				cameraControl.takePicture();
			}
		}

		function onFacesDetected(e) {
			if (e.fullImage) {
				log("Titanium got a face detected event with a image!");
				// $.pictureView.height = Ti.UI.SIZE;	// auto size the height so the image is not skewed.
				// $.pictureView.image = e.fullImage;
			} else {
				log("Titanium got a face detected event with no image!");

				$.activityIndicator.hide();

				onTakePicture();
			}
			if (e.faceRects) {
				_.each(e.faces, function(face) {
					log(JSON.stringify({
						width : face.width,
						height : face.height,
						x : face.x,
						y : face.y
					}));
				});
			}
		}

		function updateUI(){
			// we'll turn off the start over and the help buttons on this screen bcs. the camera is automatic
			$.header.helpButton.hide();
			$.header.exit.hide();

			// we could auto play the help message? is this a good idea?


			$.instructions.setText(CloudClock.customL.strings('center_face'));
			$.activityIndicator.setMessage(CloudClock.customL.strings('locating_face'));

			// $.takePictureBtn.setTitle(CloudClock.customL.strings('take_photo'));
			// $.takePictureBtn.hide();

			$.takePictureTimeoutId = setTimeout(onTakePicture, 4000);

			// if(OS_IOS){
			// 	$.header.helpButton.applyProperties({
			// 		employeeLang: Ti.App.Properties.getString('CURRLANGUAGETYPE'),
			// 		viewNo: '1600'
			// 	});
			// }else{
			// 	$.header.helpButton.employeeLang = Ti.App.Properties.getString('CURRLANGUAGETYPE');
			// 	$.header.helpButton.viewNo = '1600';
			// }

			// $.header.helpButton.show();
		}

		function restartTimeout(){
			//restart timeout
			CloudClock.screenTimeout.restartTimeout('employeeFlow', 'cameraView', $.header.exit);
			//show dialog if timeout expires
			CloudClock.clock.showEmployeeFlowDialog = true;
		}

		function destroy(){
			$.cameraWindow.removeEventListener('close', destroy);
			faceDetection.removeEventListener('trace', onTrace);
			faceDetection.removeEventListener('error', onError);
			// $.takePictureBtn.removeEventListener('click', onTakePicture);
			// $.takePictureBtn.removeEventListener('doubletap', emptyFn);
			if($.takePictureTimeoutId) {
				clearTimeout($.takePictureTimeoutId);
				delete $.takePictureTimeoutId;
			}
			$.destroy();
			$ = null;
		}

		function addEventListeners(){
			faceDetection.addEventListener('trace', onTrace);
			faceDetection.addEventListener('error', onError);
			$.cameraWindow.addEventListener('close', destroy);
			$.cameraWindow.addEventListener('open', function(){
				$.activityIndicator.show();
				onStartCapture();
				restartTimeout();
				Alloy.Collections.deviceHelp.audioPlayer.play();
			});
		}

		var cameraControl = undefined;
		var croppedImages = [];
		var sessionObj = CloudClock.sessionObj;
		$.takePictureTimeoutId = 0;
		var isPhotoAvailable = true;

		// adding view number for the help audio files
		Alloy.Collections.deviceHelp.audioPlayer.viewNo = '1300';
		
		addEventListeners();
		
		updateUI();

	}
	catch(error){
		CloudClock.error(error);
	}
}());



