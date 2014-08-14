/*
 * Face Detection Module
 * Author : Jacob Clark
 * 
 * Purpose:
 * Face detection module designed to provide a camera view with face detection capabilities
 * 
 * module : com.peoplenet.facedetect
 * view : a single default view. created using <module>.createView(args);
 * 
 * module methods:
 *   -- none to speak of
 * 
 * module events:
 * 	 -- trace -> get trace calls. debugging purposes only
 *   -- error -> get error calls. should hopefully never get called!
 * 
 * view methods:
 * 	 -- setupCamera() -> call after the view has been added to whatever parent. (after all UI updates. )
 *   -- takePicture() -> call to take the current picture. Will trigger 'pictureCaptured' event
 *   -- cleanup()
 * 
 * view properties:
 *   -- faceDetectionFrameRate -> how ofter to perform face detection. default is 25
 * 
 * view events:
 * 	 -- pictureCaptured -> 
 * 			Parameters (e.xxxxx)
 * 		-- image -> the overall picture captured
 * 		-- faceRects -> location of each face detected in the picture
 * 		-- faceImages -> image blobs of each face detected in the picture
 * 
 *   -- facesDetected ->
 * 			Parameters (e.xxxxx)
 * 		-- image -> the overall picture captured
 * 		-- faceRects -> location of each face detected in the picture
 * 		-- faceImages -> image blobs of each face detected in the picture
 */

// Example Usage:
var faceDetection = require('com.peoplenet.facedetect');

faceDetection.addEventListener('trace', onTrace);
faceDetection.addEventListener('error', onError);

var cameraControl;
function run() {
	// the view is a standard view will all of the normal properties.
	cameraControl = faceDetection.createView({
		backgroundColor : 'red',		// not recommended since red is a bit 'in your face'
		faceDetectionFrameRate : 20		// can set the one additional property in the constructor or seperately
	});
	
	
	cameraControl.addEventListener('pictureCaptured', onPictureCaptured);
	cameraControl.addEventListener('facesDetected', onFacesDetected);
	$.cameraView.add(cameraControl);
	cameraControl.setupCamera();
}

// cleanup MUST be called!
function onClose() {
	if (cameraControl) {
		cameraControl.removeEventListener('pictureCaptured', onPictureCaptured);
		cameraControl.removeEventListener('facesDetected', onFacesDetected);
		cameraControl.cleanup();
		$.cameraView.remove(cameraControl);
		cameraControl = undefined;
	}
}

// called as result of "take picture" method
function onPictureCaptured(e) {
	if (e && e.image) {
		// e.image is a blob so this just works
		// $.pictureView is an ImageView
		$.pictureView.height = Ti.UI.SIZE;	// auto size the height so the image is not skewed.
		$.pictureView.image = e.image;
		
		if (e.faceImages && e.faceImages.length > 0) {
			var croppedFace = e.faceImages[0];
			var croppedImage = Ti.UI.createImageView({
				//height : 200,
				image : croppedFace
			});
			$.croppedImagesView.add(croppedImage);
		}
	}
}

function onTakePicture() {
	if (cameraControl) {
		cameraControl.takePicture();
	}
}

function onFacesDetected(e) {
	if (e.fullImage) {
		// $.pictureView.height = Ti.UI.SIZE;	// auto size the height so the image is not skewed.
		// $.pictureView.image = e.fullImage;
	}
	
	// each rect in e.faceRects is a TiRect object.
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
	
	if (e.faceImages) {
		_.each(e.faceImages, function(croppedFace) {
			
			var croppedImage = Ti.UI.createImageView({
				//height : 200,
				image : croppedFace
			});

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

