//
//  PPNExposurePointOfInterest.m
//  faceDetection
//
//  Created by Cliff Jacobson on 4/17/14.
//
//

#import "PPNExposurePointOfInterest.h"
#import <AVFoundation/AVFoundation.h>
#import "Logger.h"

// TODO: change to properties to add getters 
float const HORIZONTAL_TOUCH_DIMENSION_DIVISOR = 480.f;
float const VERTICAL_TOUCH_DIMENSION_DIVISOR = 400.f;

NSString *_exposurePointXKey = @"exposurePointXKey";
NSString *_exposurePointYKey = @"exposurePointYKey";

float _exposurePointX = 0.5f;
float _exposurePointY = 0.5f;


@implementation PPNExposurePointOfInterest

+(void)setExposurePointByTouchLocation:(CGPoint)touchLocation forDevice:(AVCaptureDevice *)device
{
    float x = (touchLocation.x/HORIZONTAL_TOUCH_DIMENSION_DIVISOR);
    float y = (1.0f-(touchLocation.y/VERTICAL_TOUCH_DIMENSION_DIVISOR));
    CGPoint exposurePoint = CGPointMake(x, y);
    [self setExposurePointScaled:exposurePoint forDevice:device];
    
    CGPoint deviceSetting = device.exposurePointOfInterest;
    [Logger Trace:NSStringFromSelector(_cmd)
          message:[NSString stringWithFormat:@"** touchLocation %f %f  camera %f %f",
                   touchLocation.x, touchLocation.y, deviceSetting.x, deviceSetting.y]];
}

+(void)setExposurePointScaled:(CGPoint)exposurePoint forDevice:(AVCaptureDevice *)device
{
    if ([device isExposurePointOfInterestSupported]) {
        
        [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@" setExposurePointOfInterest: %f / %f ", exposurePoint.x, exposurePoint.y ]];
        [device setExposurePointOfInterest:exposurePoint];
        
        if ([device isExposureModeSupported:AVCaptureExposureModeLocked]) {
            [device setExposureMode:AVCaptureExposureModeLocked];
        }
        if ([device isExposureModeSupported:AVCaptureExposureModeAutoExpose]) {
            [device setExposureMode:AVCaptureExposureModeAutoExpose];
        }
        if ([device isExposureModeSupported:AVCaptureExposureModeContinuousAutoExposure]) {
            [device setExposureMode:AVCaptureExposureModeContinuousAutoExposure];
        }
        
        [self persistExposurePoint:exposurePoint];
        
    } else {
        [Logger Trace:NSStringFromSelector(_cmd) message:@" setting ExposurePointOfInterest is not supported on this device. "];
    }
}

+(void)persistExposurePoint:(CGPoint)exposurePoint
{
    _exposurePointX = exposurePoint.x;
    _exposurePointY = exposurePoint.y;
    [[NSUserDefaults standardUserDefaults] setFloat:_exposurePointX forKey:_exposurePointXKey];
    [[NSUserDefaults standardUserDefaults] setFloat:_exposurePointY forKey:_exposurePointYKey];
    [[NSUserDefaults standardUserDefaults] synchronize];
    //[Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@" persistExposurePoint: %f / %f ", exposurePoint.x, exposurePoint.y ]];
}

+(CGPoint)retrieveExposurePoint
{
    NSNumber *savedX = (NSNumber *)[[NSUserDefaults standardUserDefaults] objectForKey:_exposurePointXKey];
    NSNumber *savedY = (NSNumber *)[[NSUserDefaults standardUserDefaults] objectForKey:_exposurePointYKey];
    if (savedX == nil)     // App first run: set up user defaults.
    {
        NSDictionary *appDefaults  = [NSDictionary  dictionaryWithObjectsAndKeys:
                                      [NSNumber numberWithFloat:_exposurePointX], _exposurePointXKey,
                                      [NSNumber numberWithFloat:_exposurePointY], _exposurePointYKey,
                                      nil];
        
        // sync the defaults to disk
        [[NSUserDefaults standardUserDefaults] registerDefaults:appDefaults];
        [[NSUserDefaults standardUserDefaults] synchronize];
        [[NSUserDefaults standardUserDefaults] setFloat:_exposurePointX forKey:_exposurePointXKey];
        [[NSUserDefaults standardUserDefaults] setFloat:_exposurePointY forKey:_exposurePointYKey];
        [[NSUserDefaults standardUserDefaults] synchronize];
        [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@" retrieveExposurePoint - defaults saved as: %f / %f ", _exposurePointX, _exposurePointY ]];
    } else {
        _exposurePointX = [savedX floatValue];
        _exposurePointY = [savedY floatValue];
        [Logger Trace:NSStringFromSelector(_cmd) message:[NSString stringWithFormat:@" retrieveExposurePoint - saved values read as: %f / %f ", _exposurePointX, _exposurePointY ]];
    }
    
    CGPoint exposurePoint = CGPointMake(_exposurePointX, _exposurePointY);
    return exposurePoint;
}


@end
