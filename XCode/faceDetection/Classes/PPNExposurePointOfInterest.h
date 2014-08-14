//
//  PPNExposurePointOfInterest.h
//  faceDetection
//
//  Created by Cliff Jacobson on 4/17/14.
//
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@interface PPNExposurePointOfInterest : NSObject

+(void)setExposurePointByTouchLocation:(CGPoint)touchLocation forDevice:(AVCaptureDevice *)device;
+(void)setExposurePointScaled:(CGPoint)exposurePoint forDevice:(AVCaptureDevice *)_device;
+(void)persistExposurePoint:(CGPoint)exposurePoint;
+(CGPoint)retrieveExposurePoint;

@end
