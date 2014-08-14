/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "ComPeoplenetFacedetectView.h"
#import "Logger.h"
#import "AVCamViewController.h"
#import "AVCamPreviewView.h"
#import <AVFoundation/AVFoundation.h>
#import "PPNVideoSampleOutput.h"
#import "PPNImageHelper.h"
#import "TiUtils.h"
#import "TiRect.h"

static int instanceCounter = 0;
NSString * const EVT_PIC_CAPTURED = @"pictureCaptured";
NSString * const EVT_FACES_DETECTED = @"facesDetected";

@implementation ComPeoplenetFacedetectView

@synthesize videoSampleOutput = _videoSampleOutput;
@synthesize captureVideoPreviewLayer = _captureVideoPreviewLayer;
@synthesize captureSession = _captureSession;
@synthesize input = _input;
@synthesize output = _output;
@synthesize device = _device;
@synthesize stillImageOutput = _stillImageOutput;
@synthesize overlayView = _overlayView;
@synthesize faceDetectionFrameRate = _faceDetectionFrameRate;

-(void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [[event allTouches] anyObject];
    CGPoint touchLocation = [touch locationInView:touch.view];
    
    NSError *lockerror = nil;
    [_device lockForConfiguration:&lockerror];
    if (lockerror) {
        [Logger Trace:NSStringFromSelector(_cmd) message:@"ERROR!!!! (lock for config)"];
        [Logger Trace:NSStringFromSelector(_cmd) message:lockerror.description];
    }

    [PPNExposurePointOfInterest setExposurePointByTouchLocation:touchLocation forDevice:_device];
    
    [_device unlockForConfiguration];
}

-(void)initCamera
{
    instanceCounter = instanceCounter + 1;
    
    _captureSession = [[[AVCaptureSession alloc] init] autorelease];
    _captureSession.sessionPreset = AVCaptureSessionPresetMedium;
    _captureVideoPreviewLayer = [[[AVCaptureVideoPreviewLayer alloc] initWithSession:_captureSession] autorelease];
    _captureVideoPreviewLayer.frame = self.bounds;
    [self.layer addSublayer:_captureVideoPreviewLayer];
    
    _device = [ComPeoplenetFacedetectView deviceWithMediaType:AVMediaTypeVideo preferringPosition:AVCaptureDevicePositionFront];
    
    NSError *error = nil;
    [_device lockForConfiguration:&error];
    if (error) {
        [Logger Trace:NSStringFromSelector(_cmd) message:@"ERROR!!!! (lock for config)"];
        [Logger Trace:NSStringFromSelector(_cmd) message:error.description];
    }
    
    @try {
        CGPoint exposurePoint = [PPNExposurePointOfInterest retrieveExposurePoint];
        [PPNExposurePointOfInterest setExposurePointScaled:exposurePoint forDevice:_device];
        
        if([_device isLowLightBoostSupported]) {
            [_device setAutomaticallyEnablesLowLightBoostWhenAvailable:YES];
        }

        _input = [AVCaptureDeviceInput deviceInputWithDevice:_device error:&error];
        
        if (error) {
            [Logger Trace:NSStringFromSelector(_cmd) message:@"ERROR!!!!"];
            [Logger Trace:NSStringFromSelector(_cmd) message:error.description];
        }
        else
        {
            [_captureSession addInput:_input];
            
            _output = [[[AVCaptureVideoDataOutput alloc] init] retain];
            NSDictionary *rgbOutputSettings = [NSDictionary dictionaryWithObject:
                                               [NSNumber numberWithInt:kCMPixelFormat_32BGRA] forKey:(id)kCVPixelBufferPixelFormatTypeKey];
            [_output setVideoSettings:rgbOutputSettings];
            [_output setAlwaysDiscardsLateVideoFrames:YES]; // discard if the data output queue is blocked
            
            [_captureSession addOutput:_output];
            
            _videoSampleOutput = [[[PPNVideoSampleOutput alloc] initWithLayer:_captureVideoPreviewLayer] retain];
            [_videoSampleOutput setFaceDetectedDelegate:self];
            if (_faceDetectionFrameRate > 0)
            {
                [_videoSampleOutput setFaceDetectionFrameRate:_faceDetectionFrameRate];
                [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@"setting face detect frame rate to %d", _faceDetectionFrameRate]];
            }

            [_output setSampleBufferDelegate:_videoSampleOutput queue:dispatch_get_main_queue()];
            [[_output connectionWithMediaType:AVMediaTypeVideo] setEnabled:YES];
            
            _stillImageOutput = [[[AVCaptureStillImageOutput alloc] init] retain];
            if ([_captureSession canAddOutput:_stillImageOutput])
            {
                [_stillImageOutput setOutputSettings:@{AVVideoCodecKey : AVVideoCodecJPEG}];
                [_captureSession addOutput:_stillImageOutput];
            }
            
            [[_captureVideoPreviewLayer connection] setVideoOrientation:[PPNImageHelper getOrientation]];
            [self attachNotifications];
            
            [Logger Trace:NSStringFromSelector(_cmd) message:@"Starting video capture..."];
            [_captureSession startRunning];
            [Logger Trace:NSStringFromSelector(_cmd) message:@"Video capture started"];
        }
    }
    @finally {
        [_device unlockForConfiguration];
    }

}

-(void)setFaceDetectionFrameRate:(int)faceDetectionFrameRateValue
{
    if (_videoSampleOutput)
    {
        [_videoSampleOutput setFaceDetectionFrameRate:faceDetectionFrameRateValue];
    }
    _faceDetectionFrameRate = faceDetectionFrameRateValue;
}

- (void)attachNotifications
{    
    NSNotificationCenter *notify = [NSNotificationCenter defaultCenter];
    
    [notify addObserver: self
               selector: @selector(onVideoError:)
                   name: AVCaptureSessionRuntimeErrorNotification
                 object: _captureSession];
    [notify addObserver: self
               selector: @selector(onVideoStart:)
                   name: AVCaptureSessionDidStartRunningNotification
                 object: _captureSession];
    [notify addObserver: self
               selector: @selector(onVideoStop:)
                   name: AVCaptureSessionDidStopRunningNotification
                 object: _captureSession];
    [notify addObserver: self
               selector: @selector(onVideoStop:)
                   name: AVCaptureSessionWasInterruptedNotification
                 object: _captureSession];
    [notify addObserver: self
               selector: @selector(onVideoStart:)
                   name: AVCaptureSessionInterruptionEndedNotification
                 object: _captureSession];
}

+ (AVCaptureDevice *)deviceWithMediaType:(NSString *)mediaType preferringPosition:(AVCaptureDevicePosition)position
{
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:mediaType];
    AVCaptureDevice *captureDevice = [devices firstObject];
    
    for (AVCaptureDevice *device in devices)
    {
        if ([device position] == position)
        {
            captureDevice = device;
            break;
        }
    }
    return captureDevice;
}

-(void)onVideoStart:(NSNotification *)notification
{
    [Logger Trace:NSStringFromSelector(_cmd) message:@"Camera Started"];
}

-(void)onVideoStop:(NSNotification *)notification
{
    [Logger Trace:NSStringFromSelector(_cmd) message:@"Camera Stopped"];
}

-(void)onVideoError:(NSNotification *)notification
{
    [Logger Trace:NSStringFromSelector(_cmd) message:@"CAMERA ERROR"];
}


#pragma mark Public methods
-(void)setupCamera
{
    [self initCamera];
}

-(void)cleanup
{
    NSError *error = nil;
    [_device lockForConfiguration:&error];
    @try {
        [_videoSampleOutput cleanup];
        [_videoSampleOutput setFaceDetectedDelegate:NULL];
        NSNotificationCenter *notify = [NSNotificationCenter defaultCenter];
        [notify removeObserver:self name:AVCaptureSessionRuntimeErrorNotification object:_captureSession];
        [notify removeObserver:self name:AVCaptureSessionDidStartRunningNotification object:_captureSession];
        [notify removeObserver:self name:AVCaptureSessionDidStopRunningNotification object:_captureSession];
        [notify removeObserver:self name:AVCaptureSessionWasInterruptedNotification object:_captureSession];
        [notify removeObserver:self name:AVCaptureSessionInterruptionEndedNotification object:_captureSession];
        
        [Logger Trace:NSStringFromSelector(_cmd) message:@"Stopping running"];
        [_captureSession stopRunning];
        
        [Logger Trace:NSStringFromSelector(_cmd) message:@"Removing Inputs"];
        NSArray * allInputs = [_captureSession inputs];
        for (AVCaptureInput* input in allInputs)
        {
            [_captureSession removeInput:input];
        }
        
        [Logger Trace:NSStringFromSelector(_cmd) message:@"Removing Outputs"];
        NSArray * allOutputs = [_captureSession outputs];
        for (AVCaptureOutput* output in allOutputs)
        {
            [_captureSession removeOutput:output];
        }
        
        [Logger Trace:NSStringFromSelector(_cmd) message:@"Detaching from layer"];
        [_captureVideoPreviewLayer removeFromSuperlayer];
        [Logger Trace:NSStringFromSelector(_cmd) message:@"Done"];
        
    }
    @finally {
        [_device unlockForConfiguration];
    }
}

-(void)takePicture
{    
    // Capture a still image.
    [_stillImageOutput
     captureStillImageAsynchronouslyFromConnection:[_stillImageOutput connectionWithMediaType:AVMediaTypeVideo]
     completionHandler:^(CMSampleBufferRef imageDataSampleBuffer, NSError *error) {
         
         [Logger Trace:NSStringFromSelector(_cmd) message:@"FacesDetectedDelegate Called"];
         if (imageDataSampleBuffer)
         {
             UIImageOrientation flippedOrientation =[PPNImageHelper getMirroredOrientation];
             NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageDataSampleBuffer];
             CIImage * ciImage = [[[CIImage alloc] initWithData:imageData] autorelease];
             
             CIContext *myContext = [[CIContext contextWithOptions:nil] retain];
             CGImageRef img = [myContext createCGImage:ciImage fromRect:[ciImage extent]];
             
             UIImage * imageTemp = [[[UIImage alloc] initWithCGImage:img scale:1.0f orientation:flippedOrientation] autorelease];
             UIImage * newImage = [PPNImageHelper image:imageTemp scaleAndRotateImageToMaxResolution:1];
             // Setting JPEG compression to 0.3 to reduce file size to approx 1/10th orignal size to save bandwidth and time
             // UIImage * flippedImage = [[[UIImage alloc] initWithData:UIImageJPEGRepresentation(newImage, 1.0)] autorelease];
             UIImage * flippedImage = [[[UIImage alloc] initWithData:UIImageJPEGRepresentation(newImage, 0.3)] autorelease];
             TiBlob * imageBlob = [[[TiBlob alloc] initWithImage:flippedImage] autorelease];
             
             NSMutableArray * croppedBlobFaces = [[[NSMutableArray alloc] init] autorelease];
             NSArray * faceRects = [[[NSArray alloc] init] autorelease];
             
             CMFormatDescriptionRef fdesc = CMSampleBufferGetFormatDescription(imageDataSampleBuffer);
             CGRect cleanAperture = CMVideoFormatDescriptionGetCleanAperture(fdesc, false);
             
             PPNFaceDetectionResults * faceResults = [_videoSampleOutput extractResultsFromImage:ciImage forVideoBox:cleanAperture];
             if (faceResults) {
                 faceRects = faceResults.faceRects;
                 for (UIImage * faceImage in faceResults.faceImages) {
                     CIImage * faceCIImage = [faceImage CIImage];
                     CGImageRef cgiImage = [myContext createCGImage:faceCIImage fromRect:[faceCIImage extent]];
                     UIImage * faceImageTemp = [[[UIImage alloc] initWithCGImage:cgiImage scale:1.0f orientation:flippedOrientation] autorelease];
                     UIImage * faceImage2 = [[[UIImage alloc] initWithData:UIImageJPEGRepresentation(faceImageTemp, 1.0)] autorelease];
                     TiBlob * croppedImageBlob = [[[TiBlob alloc] initWithImage:faceImage2] autorelease];
                     [croppedBlobFaces addObject:croppedImageBlob];
                 }
             }
             
             NSDictionary *returnArgs = [[[NSDictionary alloc] initWithObjectsAndKeys:
                                          imageBlob, @"image", faceRects, @"faceRects", croppedBlobFaces, @"faceImages", nil] autorelease];
             
             [[self proxy] fireEvent:EVT_PIC_CAPTURED withObject:returnArgs];
             
             [myContext release];
         }
     }];
}


-(void)dealloc
{
    [Logger Trace:NSStringFromSelector(_cmd) message:@"RELEASING RESOURCES!"];
    [_videoSampleOutput release];
    [_output release];
    [_stillImageOutput release];

    [super dealloc];
}

- (void)onFacesDetected:(NSArray *)faceRects fullImage:(UIImage *)fullImage croppedFaces:(NSArray *)croppedFaces
{
    [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@"yes, I found %lu faces!", (unsigned long)[faceRects count]]];

    NSDictionary *returnArgs = [[[NSDictionary alloc] initWithObjectsAndKeys:
                                  faceRects, @"faceRects", nil] autorelease];
    
    [[self proxy] fireEvent:EVT_FACES_DETECTED withObject:returnArgs];
    
}

@end
