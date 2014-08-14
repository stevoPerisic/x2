/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "ComPeoplenetFacedetectViewProxy.h"
#import "ComPeoplenetFacedetectView.h"
#import "TiUtils.h"
#import "Logger.h"

@implementation ComPeoplenetFacedetectViewProxy

-(ComPeoplenetFacedetectView *)getView
{
    return (ComPeoplenetFacedetectView *)[self view];
}

-(void)cleanup:(id)args
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[self getView] cleanup];
        }
        @catch (NSException *exception) {
            [Logger logException:NSStringFromSelector(_cmd) exception:[exception reason]];
        }
    });
}

-(void)setupCamera:(id)args
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[self getView] setupCamera];
        }
        @catch (NSException *exception) {
            [Logger logException:NSStringFromSelector(_cmd) exception:[exception reason]];
        }
    });
}

-(void)takePicture:(id)args
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[self getView] takePicture];
        }
        @catch (NSException *exception) {
            [Logger logException:NSStringFromSelector(_cmd) exception:[exception reason]];
        }
    });
}

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
    [Logger Trace:NSStringFromSelector(_cmd) message:@"Ahh shit"];
}

-(void)setFaceDetectionFrameRate:(id)valueId
{
    int faceDetectFrameRate = [TiUtils intValue:valueId];
    [Logger Trace:NSStringFromSelector(_cmd)
          message:[NSString stringWithFormat:@"Setting face detect frame rate to : %d", faceDetectFrameRate]];

    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[self getView] setFaceDetectionFrameRate:faceDetectFrameRate];
        }
        @catch (NSException *exception) {
            [Logger logException:NSStringFromSelector(_cmd) exception:[exception reason]];
        }
    });
}

@end
