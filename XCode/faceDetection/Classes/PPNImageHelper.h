//
//  PPNImageHelper.h
//  faceDetection
//
//  Created by Jacob Clark on 3/17/14.
//
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>

@interface PPNImageHelper : NSObject

+(AVCaptureVideoOrientation)getOrientation;
+(UIImageOrientation) getMirroredOrientation;
+(NSNumber *) exifOrientation:(BOOL)isUsingFrontFacingCamera;
+(UIImage *)image:(UIImage*)image scaleAndRotateImageToMaxResolution:(int)resolution;
+(void)rotateLeft:(CGRect)faceRect newRect_p:(CGRect *)newRect_p parentFrameSize:(CGSize)parentFrameSize;
+(void)rotateRight:(CGRect)faceRect newRect_p:(CGRect *)newRect_p parentFrameSize:(CGSize)parentFrameSize;

@end
