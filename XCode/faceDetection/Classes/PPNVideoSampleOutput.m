//
//  PPNVideoSampleOutput.m
//  AVCam
//
//  Created by Jacob Clark on 3/12/14.
//  Copyright (c) 2014 Apple Inc. All rights reserved.
//

#import "PPNVideoSampleOutput.h"
#import "Logger.h"
#import "PPNImageHelper.h"
#import "PPNFaceDetectionResults.h"
#import "PPNImageEnhancer.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <ImageIO/ImageIO.h>
#import "TiRect.h"

@implementation PPNVideoSampleOutput

@synthesize previewLayer = _previewLayer;
@synthesize faceDetector = _faceDetector;
@synthesize faceDetectionFrameRate = _faceDetectionFrameRate;

- (id)initWithLayer:(AVCaptureVideoPreviewLayer *)previewLayer
{
    faceDetectFrame = 0;
    faceDetectAttempt = 0;
    _faceDetectionFrameRate = 25;

    [Logger Trace:NSStringFromSelector(_cmd) message:@"PPNVideoSampleOutput - I have been initialized!"];
    self = [super init];
    
    _previewLayer = previewLayer;
    
    NSDictionary *detectorOptions = [[[NSDictionary alloc] initWithObjectsAndKeys:CIDetectorAccuracyLow, CIDetectorAccuracy, nil] autorelease];
    _faceDetector = [[CIDetector detectorOfType:CIDetectorTypeFace context:nil options:detectorOptions] retain];

    return self;
}

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection
{
    faceDetectFrame++;
    if (faceDetectFrame >= _faceDetectionFrameRate)
    {
        faceDetectFrame = 0;
    }
    if (faceDetectFrame == 1)   // ensures it happens on the first frame and every X frames
    {
        faceDetectAttempt++;
        [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@"Face Detection Attempt # %d ", faceDetectAttempt]];
        [self DetectFaces:sampleBuffer];
    }
}

- (void)DetectFaces:(CMSampleBufferRef)sampleBuffer {
    CVPixelBufferRef pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
    CFDictionaryRef attachments = CMCopyDictionaryOfAttachments(kCFAllocatorDefault, sampleBuffer, kCMAttachmentMode_ShouldPropagate);
    CIImage *ciImage = [[[CIImage alloc] initWithCVPixelBuffer:pixelBuffer options:(__bridge NSDictionary *)attachments] autorelease];
    if (attachments) {
        CFRelease(attachments);
    }
 
    ciImage = [PPNImageEnhancer enhanceImage:ciImage];
    
    // get the clean aperture
    // the clean aperture is a rectangle that defines the portion of the encoded pixel dimensions
    // that represents image data valid for display.
    CMFormatDescriptionRef fdesc = CMSampleBufferGetFormatDescription(sampleBuffer);
    CGRect cleanAperture = CMVideoFormatDescriptionGetCleanAperture(fdesc, false);
    PPNFaceDetectionResults * faceResults = [self extractResultsFromImage:ciImage forVideoBox:cleanAperture];
    
    if (faceResults.allFaces.count > 0) {
        [self drawFaceBorderRect:faceResults withBorder:[UIColor greenColor]];
        if (facesDetectedDelegate)
        {
            UIImage * fullUIImage = [[[UIImage alloc] initWithCIImage:ciImage scale:1.0f orientation:faceResults.orientation] autorelease];
            [facesDetectedDelegate onFacesDetected:faceResults.allFaces fullImage:fullUIImage croppedFaces:faceResults.faceImages];
        }
    }
    else
    {
        [self hideAllFaceRects];
    }
}


- (PPNFaceDetectionResults *)extractResultsFromImage:(CIImage * )ciImage forVideoBox:(CGRect)clearAperture
{
    ciImage = [PPNImageEnhancer enhanceImage:ciImage];
    NSDictionary *imageOptions = nil;
    imageOptions = [NSDictionary dictionaryWithObject:[PPNImageHelper exifOrientation:YES] forKey:CIDetectorImageOrientation];
    
    NSArray *features = [_faceDetector featuresInImage:ciImage options:imageOptions];
    [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@"PICTURE Faces found :%lu", (unsigned long)[features count]]];
    
	NSInteger currentFeature = 0;
	CGSize parentFrameSize = [_previewLayer visibleRect].size;
	CGRect previewBox = CGRectMake(0, 0, parentFrameSize.width, parentFrameSize.height);
    NSMutableArray * allFaces = [[[NSMutableArray alloc] init] autorelease];
    NSMutableArray * croppedImages = [[[NSMutableArray alloc] init] autorelease];
    UIImageOrientation flippedOrientation =[PPNImageHelper getMirroredOrientation];
    
	for ( CIFaceFeature *ff in features ) {
        CIImage * croppedCIImage = [ciImage imageByCroppingToRect:[ff bounds]];
        UIImage * img = [[[UIImage alloc] initWithCIImage:croppedCIImage scale:1.0f orientation:flippedOrientation] autorelease];
        if (img) {
            [croppedImages addObject:img];
        }
        
		// find the correct position for the square layer within the previewLayer
		// the feature box originates in the bottom left of the video frame.
		// (Bottom right if mirroring is turned on)
		CGRect faceRect = [ff bounds];
        
		// flip preview width and height
		CGFloat temp = faceRect.size.width;
		faceRect.size.width = faceRect.size.height;
		faceRect.size.height = temp;
		temp = faceRect.origin.x;
		faceRect.origin.x = faceRect.origin.y;
		faceRect.origin.y = temp;
		// scale coordinates so they fit in the preview box, which may be scaled
		CGFloat widthScaleBy = previewBox.size.width / clearAperture.size.height;
		CGFloat heightScaleBy = previewBox.size.height / clearAperture.size.width;
		faceRect.size.width *= widthScaleBy;
		faceRect.size.height *= heightScaleBy;
		faceRect.origin.x *= widthScaleBy;
		faceRect.origin.y *= heightScaleBy;
        
        // it IS MIRRORED
		faceRect = CGRectOffset(faceRect, previewBox.origin.x + previewBox.size.width - faceRect.size.width - (faceRect.origin.x * 2), previewBox.origin.y);
        
        CGRect newRect = faceRect;
        UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
		switch (orientation) {
			case UIDeviceOrientationPortrait:
                // should not have to do anything!
				break;
			case UIDeviceOrientationPortraitUpsideDown:
                // not supported!!!
				break;
			case UIDeviceOrientationLandscapeLeft:
                [PPNImageHelper rotateLeft:faceRect newRect_p:&newRect parentFrameSize:parentFrameSize];
				break;
			case UIDeviceOrientationLandscapeRight:
                [PPNImageHelper rotateRight:faceRect newRect_p:&newRect parentFrameSize:parentFrameSize];
				break;
			case UIDeviceOrientationFaceUp:
			case UIDeviceOrientationFaceDown:
			default:
				break; // leave the layer in its last known orientation
		}
        
        TiRect *tiFaceRect = [[[TiRect alloc] init] autorelease];
        [tiFaceRect setRect:newRect];
        [allFaces addObject:tiFaceRect];
        [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@"New Face Rect -> %@", NSStringFromCGRect(newRect)]];
	}
    
    PPNFaceDetectionResults * results = [[PPNFaceDetectionResults alloc] init];
    results.faceRects = allFaces;
    results.faceImages = croppedImages;
    results.fullImage = [[[UIImage alloc] initWithCIImage:ciImage scale:1.0f orientation:flippedOrientation] autorelease];
    results.orientation = flippedOrientation;
    results.allFaces = allFaces;
    results.previewBox = previewBox;
    return  results;
}

- (void)hideAllFaceRects
{
	NSArray *sublayers = [NSArray arrayWithArray:[self.previewLayer sublayers]];
    for ( CALayer *layer in sublayers ) {
		if ( [[layer name] isEqualToString:@"FaceLayer"] )
        {
			[layer setHidden:YES];
        }
	}
    
}

- (void)drawFaceBorderRect:(PPNFaceDetectionResults *)results withBorder:(UIColor *)borderColor
{
	NSArray *sublayers = [NSArray arrayWithArray:[self.previewLayer sublayers]];
	NSInteger sublayersCount = [sublayers count], currentSublayer = 0;
    
	[CATransaction begin];
	[CATransaction setValue:(id)kCFBooleanTrue forKey:kCATransactionDisableActions];
    
    [self hideAllFaceRects];
    
    for (TiRect *tiRect in results.allFaces) {
        CALayer *featureLayer = nil;
        // re-use an existing layer if possible
        while ( !featureLayer && (currentSublayer < sublayersCount) ) {
            CALayer *currentLayer = [sublayers objectAtIndex:currentSublayer++];
            if ( [[currentLayer name] isEqualToString:@"FaceLayer"] ) {
                featureLayer = currentLayer;
                [currentLayer setHidden:NO];
            }
        }
        
        // create a new one if necessary
        if ( !featureLayer ) {
            featureLayer = [[[CALayer alloc] init] retain];
            featureLayer.borderColor = [borderColor CGColor];
            featureLayer.borderWidth = 3.0;
            [featureLayer setName:@"FaceLayer"];
            [_previewLayer addSublayer:featureLayer];
        }
        featureLayer.frame = [tiRect rect];
        featureLayer = nil;

    /*
        TiRect *tiFaceRect = [[[TiRect alloc] init] autorelease];
        [tiFaceRect setRect:newRect];
        [allFaces addObject:tiFaceRect];
	*/
        
    }
	[CATransaction commit];
}

- (void)setFaceDetectedDelegate:(id<PPNFacesDetectedDelegate>)facesDetectedDelegateValue
{
    facesDetectedDelegate =facesDetectedDelegateValue;
}

-(void)cleanup
{
	NSArray *sublayers = [NSArray arrayWithArray:[_previewLayer sublayers]];
    for ( CALayer *layer in sublayers ) {
		if ( [[layer name] isEqualToString:@"FaceLayer"] )
        {
            [layer removeFromSuperlayer];
            [layer release];
        }
	}

    if (_faceDetector) {
        [_faceDetector release];
        _faceDetector = nil;
    }
}

-(void)dealloc
{
    [self cleanup];
    [super dealloc];
}

@end




















