/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
#import "TiUIView.h"
#import "AVCamViewController.h"
#import "PPNVideoSampleOutput.h"
#import <UIKit/UIKit.h>
#import "PPNExposurePointOfInterest.h"

@interface ComPeoplenetFacedetectView : TiUIView<PPNFacesDetectedDelegate> {
    int instanceId;
}

@property (nonatomic, retain) PPNVideoSampleOutput *videoSampleOutput;
@property (nonatomic, retain) AVCaptureVideoPreviewLayer *captureVideoPreviewLayer;
@property (nonatomic, retain) AVCaptureSession *captureSession;
@property (nonatomic, assign) AVCaptureDevice * device;
@property (nonatomic, retain) AVCaptureDeviceInput * input;
@property (nonatomic, retain) AVCaptureVideoDataOutput * output;
@property (nonatomic, retain) AVCaptureStillImageOutput *stillImageOutput;
@property (nonatomic, retain) UIView *overlayView;
@property (nonatomic, readwrite, assign) int faceDetectionFrameRate;

-(void)cleanup;
-(void)setupCamera;
-(void)takePicture;

@end
