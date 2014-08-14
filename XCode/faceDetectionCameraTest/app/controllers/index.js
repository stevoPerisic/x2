var faceDetection = require('com.peoplenet.facedetect');
$.index.open();

var cameraControl = undefined;
var croppedImages = [];

faceDetection.addEventListener('trace', onTrace);
faceDetection.addEventListener('error', onError);

function onStartCapture() {
	if (cameraControl) {
		onStopCapture();
	} else {
		cameraControl = faceDetection.createView({
			backgroundColor : 'red',
			faceDetectionFrameRate : 20
		});
		cameraControl.addEventListener('pictureCaptured', onPictureCaptured);
		cameraControl.addEventListener('facesDetected', onFacesDetected);
		$.cameraView.add(cameraControl);
		cameraControl.setupCamera();

/*
		setTimeout(function() {
		}, 200);
		*/
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

function onPictureCaptured(e) {
//	log(e.image.length);
	if (e && e.image) {
		// e.image is a blob so this just works
		$.pictureView.height = Ti.UI.SIZE;	// auto size the height so the image is not skewed.
		$.pictureView.image = e.image;

			var encodedImage = Ti.Utils.base64encode(e.image);
			if (encodedImage) {
				log(encodedImage.getText().substring(0,50));
			} else {
				log("No image available???");
			}
		
		if (e.faceImages && e.faceImages.length > 0) {
			var croppedFace = e.faceImages[0];
			log (" !! PICTURE CAPTURED");
			
			var croppedImage = Ti.UI.createImageView({
				//height : 200,
				image : croppedFace
			});
			$.croppedImagesView.add(croppedImage);
			
			var encodedFaceImage = Ti.Utils.base64encode(croppedFace);
			if (encodedFaceImage) {
				log(encodedFaceImage.getText().substring(0,50));
			} else {
				log("No face image available???");
			}
			
		}
	}
}

function onTakePicture() {
	if (cameraControl) {
		cameraControl.takePicture();
	}
}

function onFacesDetected(e) {
	if (e.image) {
		//log("Titanium got a face detected event with a image!");
		// $.pictureView.height = Ti.UI.SIZE;	// auto size the height so the image is not skewed.
		// $.pictureView.image = e.fullImage;
	} else {
		log("Titanium got a face detected event with no image!");
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
	
	_.each(croppedImages, function(croppedImage) {
		$.croppedImagesView.remove(croppedImage);
	});
	
	croppedImages = [];
	
	if (e.faceImages) {
		_.each(e.faceImages, function(croppedFace) {
			
			var croppedImage = Ti.UI.createImageView({
				//height : 200,
				image : croppedFace
			});
			croppedImages.push(croppedImage);
			$.croppedImagesView.add(croppedImage);
			
		});
	}
}

function onTrace(e) {
	log(e.name + " : " + e.value);
}

function onError(e) {
	log('ERROR ' + e.name + " : " + e.value);
}

function log(msg) {
	Ti.API.info(msg);
}
