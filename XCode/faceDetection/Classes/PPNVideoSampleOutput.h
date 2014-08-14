//
//  PPNVideoSampleOutput.h
//  AVCam
//
//  Created by Jacob Clark on 3/12/14.
//  Copyright (c) 2014 Apple Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import "PPNFaceDetectionResults.h"
#import "PPNFacesDetectedDelegate.h"

@interface PPNVideoSampleOutput : NSObject<AVCaptureVideoDataOutputSampleBufferDelegate>
{
    int faceDetectFrame;
    int faceDetectAttempt;
    id<PPNFacesDetectedDelegate> facesDetectedDelegate;
}

@property(nonatomic, retain) AVCaptureVideoPreviewLayer * previewLayer;
@property(nonatomic, retain) CIDetector * faceDetector;
@property (readwrite) int faceDetectionFrameRate;

- (id)initWithLayer:(AVCaptureVideoPreviewLayer *)previewLayer;
- (void)setFaceDetectedDelegate:(id<PPNFacesDetectedDelegate>)facesDetectedDelegateValue;
- (void)cleanup;

- (PPNFaceDetectionResults *)extractResultsFromImage:(CIImage * )ciImage forVideoBox:(CGRect)clearAperture;

@end
