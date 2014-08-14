//
//  PPNImageHelper.m
//  faceDetection
//
//  Created by Jacob Clark on 3/17/14.
//
//

#import "PPNImageHelper.h"
#import <AVFoundation/AVFoundation.h>
#import "Logger.h"
#import <UIKit/UIKit.h>

@implementation PPNImageHelper

+(AVCaptureVideoOrientation)getOrientation
{
    AVCaptureVideoOrientation videoOrientation = AVCaptureVideoOrientationLandscapeRight;
    
    UIDeviceOrientation  orientation = [[UIDevice currentDevice] orientation];
    switch (orientation) {
        case UIDeviceOrientationPortrait:
            [Logger Trace:NSStringFromSelector(_cmd) message:@"setup Camera View - Portrait"];
            videoOrientation = AVCaptureVideoOrientationPortrait;
            break;
        case UIDeviceOrientationLandscapeLeft:
            [Logger Trace:NSStringFromSelector(_cmd) message:@"setup Camera View - Landscape - Left"];
            videoOrientation = AVCaptureVideoOrientationLandscapeRight; // STOP ! Left and right are swapped on purpose!
            break;
        case UIDeviceOrientationLandscapeRight:
            [Logger Trace:NSStringFromSelector(_cmd) message:@"setup Camera View - Landscape - Right"];
            videoOrientation = AVCaptureVideoOrientationLandscapeLeft;
            break;
        case UIDeviceOrientationPortraitUpsideDown:
            [Logger Trace:NSStringFromSelector(_cmd) message:@"setup Camera View - Portrait - UpsideDown"];
            videoOrientation = AVCaptureVideoOrientationPortraitUpsideDown;
            break;
        default:
            break;
    }
    return videoOrientation;
}

+(UIImageOrientation) getMirroredOrientation
{
    // ok, so we actually have to undo (and mirror) what was done on the original image
    UIDeviceOrientation  orientation = [[UIDevice currentDevice] orientation];
    switch (orientation) {
        case UIDeviceOrientationPortrait:
            return UIImageOrientationLeftMirrored;
            break;
        case UIDeviceOrientationLandscapeLeft:
            return UIImageOrientationDownMirrored;
            break;
        case UIDeviceOrientationLandscapeRight:
            return UIImageOrientationUpMirrored ;
            break;
        case UIDeviceOrientationPortraitUpsideDown:
            return UIImageOrientationRightMirrored;
            break;
        default:
            break;
    }
}

+(NSNumber *) exifOrientation:(BOOL)isUsingFrontFacingCamera
{
    UIDeviceOrientation  orientation = [[UIDevice currentDevice] orientation];
	int exifOrientation;
    /* kCGImagePropertyOrientation values
     The intended display orientation of the image. If present, this key is a CFNumber value with the same value as defined
     by the TIFF and EXIF specifications -- see enumeration of integer constants.
     The value specified where the origin (0,0) of the image is located. If not present, a value of 1 is assumed.
     
     used when calling featuresInImage: options: The value for this key is an integer NSNumber from 1..8 as found in kCGImagePropertyOrientation.
     If present, the detection will be done based on that orientation but the coordinates in the returned features will still be based on those of the image. */
    
	enum {
		PHOTOS_EXIF_0ROW_TOP_0COL_LEFT			= 1, //   1  =  0th row is at the top, and 0th column is on the left (THE DEFAULT).
		PHOTOS_EXIF_0ROW_TOP_0COL_RIGHT			= 2, //   2  =  0th row is at the top, and 0th column is on the right.
		PHOTOS_EXIF_0ROW_BOTTOM_0COL_RIGHT      = 3, //   3  =  0th row is at the bottom, and 0th column is on the right.
		PHOTOS_EXIF_0ROW_BOTTOM_0COL_LEFT       = 4, //   4  =  0th row is at the bottom, and 0th column is on the left.
		PHOTOS_EXIF_0ROW_LEFT_0COL_TOP          = 5, //   5  =  0th row is on the left, and 0th column is the top.
		PHOTOS_EXIF_0ROW_RIGHT_0COL_TOP         = 6, //   6  =  0th row is on the right, and 0th column is the top.
		PHOTOS_EXIF_0ROW_RIGHT_0COL_BOTTOM      = 7, //   7  =  0th row is on the right, and 0th column is the bottom.
		PHOTOS_EXIF_0ROW_LEFT_0COL_BOTTOM       = 8  //   8  =  0th row is on the left, and 0th column is the bottom.
	};
    
	switch (orientation) {
		case UIDeviceOrientationPortraitUpsideDown:  // Device oriented vertically, home button on the top
			exifOrientation = PHOTOS_EXIF_0ROW_LEFT_0COL_BOTTOM;
			break;
		case UIDeviceOrientationLandscapeLeft:       // Device oriented horizontally, home button on the right
			exifOrientation = PHOTOS_EXIF_0ROW_BOTTOM_0COL_RIGHT;
			break;
		case UIDeviceOrientationLandscapeRight:      // Device oriented horizontally, home button on the left
			exifOrientation = PHOTOS_EXIF_0ROW_TOP_0COL_LEFT;
			break;
		case UIDeviceOrientationPortrait:            // Device oriented vertically, home button on the bottom
			exifOrientation = PHOTOS_EXIF_0ROW_RIGHT_0COL_TOP;
			break;
		default:
			exifOrientation = PHOTOS_EXIF_0ROW_TOP_0COL_LEFT;
			break;
	}
    return [NSNumber numberWithInt:exifOrientation];
}

+(UIImage *)image:(UIImage*)image scaleAndRotateImageToMaxResolution:(int)resolution
{
	int kMaxResolution = resolution; // Or whatever
    
	CGImageRef imgRef = image.CGImage;
    
	CGFloat width = CGImageGetWidth(imgRef);
	CGFloat height = CGImageGetHeight(imgRef);
    
    
	CGAffineTransform transform = CGAffineTransformIdentity;
	CGRect bounds = CGRectMake(0, 0, width, height);
	CGFloat scaleRatio = bounds.size.width / width;
	CGSize imageSize = CGSizeMake(CGImageGetWidth(imgRef), CGImageGetHeight(imgRef));
	CGFloat boundHeight;
	UIImageOrientation orient = image.imageOrientation;
	switch(orient) {
            
		case UIImageOrientationUp: //EXIF = 1
			transform = CGAffineTransformIdentity;
			break;
            
		case UIImageOrientationUpMirrored: //EXIF = 2
            /*
            transform = CGAffineTransformMakeTranslation(imageSize.width, 0.0F);
            transform = CGAffineTransformScale(transform, -1.0F, 1.0F);
            */
            NSLog(@">>>>PPNImageHelper scaleAndRotateImageToMaxResolution imageOrientation=UIImageOrientationUpMirrored handled as UIImageOrientationDownMirrored for iPad laying flat ");
			transform = CGAffineTransformMakeTranslation(0.0F, imageSize.height);
			transform = CGAffineTransformScale(transform, 1.0F, -1.0F);
			break;
            
		case UIImageOrientationDown: //EXIF = 3
			transform = CGAffineTransformMakeTranslation(imageSize.width, imageSize.height);
			transform = CGAffineTransformRotate(transform, (CGFloat)M_PI);
			break;
            
		case UIImageOrientationDownMirrored: //EXIF = 4
			transform = CGAffineTransformMakeTranslation(0.0F, imageSize.height);
			transform = CGAffineTransformScale(transform, 1.0F, -1.0F);
			break;
            
		case UIImageOrientationLeftMirrored: //EXIF = 5
			boundHeight = bounds.size.height;
			bounds.size.height = bounds.size.width;
			bounds.size.width = boundHeight;
			transform = CGAffineTransformMakeTranslation(imageSize.height, imageSize.width);
			transform = CGAffineTransformScale(transform, -1.0F, 1.0F);
			transform = CGAffineTransformRotate(transform, 3.0F * (CGFloat)M_PI / 2.0F);
			break;
            
		case UIImageOrientationLeft: //EXIF = 6
			boundHeight = bounds.size.height;
			bounds.size.height = bounds.size.width;
			bounds.size.width = boundHeight;
			transform = CGAffineTransformMakeTranslation(0.0F, imageSize.width);
			transform = CGAffineTransformRotate(transform, 3.0F * (CGFloat)M_PI / 2.0F);
			break;
            
		case UIImageOrientationRightMirrored: //EXIF = 7
			boundHeight = bounds.size.height;
			bounds.size.height = bounds.size.width;
			bounds.size.width = boundHeight;
			transform = CGAffineTransformMakeScale(-1.0F, 1.0F);
			transform = CGAffineTransformRotate(transform, (CGFloat)M_PI / 2.0F);
			break;
            
		case UIImageOrientationRight: //EXIF = 8
			boundHeight = bounds.size.height;
			bounds.size.height = bounds.size.width;
			bounds.size.width = boundHeight;
			transform = CGAffineTransformMakeTranslation(imageSize.height, 0.0F);
			transform = CGAffineTransformRotate(transform, (CGFloat)M_PI / 2.0F);
			break;
            
		default:
			[NSException raise:NSInternalInconsistencyException format:@"Invalid image orientation"];
            
	}
    
	UIGraphicsBeginImageContext(bounds.size);
    
	CGContextRef context = UIGraphicsGetCurrentContext();
    
	if (orient == UIImageOrientationRight || orient == UIImageOrientationLeft) {
		CGContextScaleCTM(context, -scaleRatio, scaleRatio);
		CGContextTranslateCTM(context, -height, 0);
	}
	else {
		CGContextScaleCTM(context, scaleRatio, -scaleRatio);
		CGContextTranslateCTM(context, 0, -height);
	}
    
	CGContextConcatCTM(context, transform);
    
	CGContextDrawImage(UIGraphicsGetCurrentContext(), CGRectMake(0, 0, width, height), imgRef);
	UIImage *imageCopy = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
    
	return imageCopy;
}

+(void)rotateLeft:(CGRect)faceRect newRect_p:(CGRect *)newRect_p parentFrameSize:(CGSize)parentFrameSize
{
    // doing this the hard way since the rotation is not working!
    newRect_p->origin.x= faceRect.origin.y;
    newRect_p->origin.y= parentFrameSize.width - faceRect.origin.x - faceRect.size.width;
    newRect_p->size.height = faceRect.size.width;
    newRect_p->size.width = faceRect.size.height;
}

+(void)rotateRight:(CGRect)faceRect newRect_p:(CGRect *)newRect_p parentFrameSize:(CGSize)parentFrameSize
{
    // doing this the hard way since the rotation is not working!
    newRect_p->origin.x= parentFrameSize.height - faceRect.origin.y - faceRect.size.height;
    newRect_p->origin.y=faceRect.origin.x;
    newRect_p->size.height = faceRect.size.width;
    newRect_p->size.width = faceRect.size.height;
}

@end
