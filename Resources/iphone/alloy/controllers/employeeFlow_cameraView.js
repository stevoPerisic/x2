function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "employeeFlow_cameraView";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.cameraWindow = Ti.UI.createWindow({
        backgroundColor: "#fcfcfc",
        fullscreen: true,
        navBarHidden: true,
        id: "cameraWindow"
    });
    $.__views.cameraWindow && $.addTopLevelView($.__views.cameraWindow);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        top: "640dp",
        left: "10%",
        height: "80dp",
        width: "80%",
        zIndex: 1,
        backgroundColor: "#000",
        color: "#fff",
        opacity: "0.7",
        borderRadius: 20,
        font: {
            fontSize: "28dp"
        },
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
        id: "activityIndicator"
    });
    $.__views.cameraWindow.add($.__views.activityIndicator);
    $.__views.header = Alloy.createController("header", {
        id: "header",
        __parentSymbol: $.__views.cameraWindow
    });
    $.__views.header.setParent($.__views.cameraWindow);
    $.__views.instructions = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica",
            fontSize: "28dp",
            fontStyle: "normal",
            fontWeight: "bold"
        },
        color: "#333",
        height: "60dp",
        top: "65dp",
        backgroundColor: "#fcfcfc",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "instructions"
    });
    $.__views.cameraWindow.add($.__views.instructions);
    $.__views.cameraView = Ti.UI.createView({
        top: "140dp",
        width: "500",
        height: "500",
        backgroundColor: "#fcfcfc",
        id: "cameraView"
    });
    $.__views.cameraWindow.add($.__views.cameraView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var faceDetection = require("com.peoplenet.facedetect");
    (function() {
        function onTrace(e) {
            log(e.name + " : " + e.value);
        }
        function onError(e) {
            log("ERROR " + e.name + " : " + e.value);
        }
        function log(msg) {
            Ti.API.info(msg);
        }
        function onStartCapture() {
            if (cameraControl) onStopCapture(); else {
                cameraControl = faceDetection.createView({
                    backgroundColor: "#fcfcfc",
                    faceDetectionFrameRate: 20
                });
                cameraControl.addEventListener("pictureCaptured", onPictureCaptured);
                cameraControl.addEventListener("facesDetected", onFacesDetected);
                $.cameraView.add(cameraControl);
                cameraControl.setupCamera();
            }
        }
        function onStopCapture() {
            if (cameraControl) {
                cameraControl.removeEventListener("pictureCaptured", onPictureCaptured);
                cameraControl.removeEventListener("facesDetected", onFacesDetected);
                cameraControl.cleanup();
                $.cameraView.remove(cameraControl);
                cameraControl = void 0;
            }
        }
        function onPictureCaptured(e) {
            if (e && e.image) try {
                isPhotoAvailable = false;
                log(e.faceImages[0]);
                log(e.image);
                var encodedFace = Ti.Utils.base64encode(e.image).toString();
                sessionObj.currentPunch.photoData = encodedFace;
                sessionObj.currentPunch.photoTime = CloudClock.sessionObj.currentPunch.transTime;
                if ("/images/icons/no-photo-256-gray.png" === CloudClock.sessionObj.employee.get("photoFileName")) {
                    console.log("Saving master photo.....");
                    Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "MasterPhoto");
                    var masterFilePath = CloudClock.sessionObj.employee.get("badge") + ".jpg";
                    var masterPicture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, masterFilePath);
                    masterPicture.write(encodedFace);
                    masterPicture.move("MasterPhoto/" + masterFilePath);
                    masterPicture.deleteFile();
                    CloudClock.sessionObj.employee.save({
                        photoFileName: "MasterPhoto/" + masterFilePath
                    });
                }
                onStopCapture();
                CloudClock.dispatcher.nextWindow({
                    context: $
                });
            } catch (error) {
                CloudClock.error(error);
            }
        }
        function onTakePicture() {
            if (cameraControl && isPhotoAvailable) {
                isPhotoAvailable = false;
                cameraControl.takePicture();
            }
        }
        function onFacesDetected(e) {
            if (e.fullImage) log("Titanium got a face detected event with a image!"); else {
                log("Titanium got a face detected event with no image!");
                $.activityIndicator.hide();
                onTakePicture();
            }
            e.faceRects && _.each(e.faces, function(face) {
                log(JSON.stringify({
                    width: face.width,
                    height: face.height,
                    x: face.x,
                    y: face.y
                }));
            });
        }
        function updateUI() {
            $.header.helpButton.hide();
            $.header.exit.hide();
            $.instructions.setText(CloudClock.customL.strings("center_face"));
            $.activityIndicator.setMessage(CloudClock.customL.strings("locating_face"));
            $.takePictureTimeoutId = setTimeout(onTakePicture, 4e3);
        }
        function restartTimeout() {
            CloudClock.screenTimeout.restartTimeout("employeeFlow", "cameraView", $.header.exit);
            CloudClock.clock.showEmployeeFlowDialog = true;
        }
        function destroy() {
            $.cameraWindow.removeEventListener("close", destroy);
            faceDetection.removeEventListener("trace", onTrace);
            faceDetection.removeEventListener("error", onError);
            if ($.takePictureTimeoutId) {
                clearTimeout($.takePictureTimeoutId);
                delete $.takePictureTimeoutId;
            }
            $.destroy();
            $ = null;
        }
        function addEventListeners() {
            faceDetection.addEventListener("trace", onTrace);
            faceDetection.addEventListener("error", onError);
            $.cameraWindow.addEventListener("close", destroy);
            $.cameraWindow.addEventListener("open", function() {
                $.activityIndicator.show();
                onStartCapture();
                restartTimeout();
                Alloy.Collections.deviceHelp.audioPlayer.play();
            });
        }
        try {
            CloudClock.stopCapture = onStopCapture;
            var cameraControl = void 0;
            var sessionObj = CloudClock.sessionObj;
            $.takePictureTimeoutId = 0;
            var isPhotoAvailable = true;
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1300";
            addEventListeners();
            updateUI();
        } catch (error) {
            CloudClock.error(error);
        }
    })();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;