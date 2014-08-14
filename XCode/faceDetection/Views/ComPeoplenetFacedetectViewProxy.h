/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
#import "TiViewProxy.h"

@interface ComPeoplenetFacedetectViewProxy : TiViewProxy {

}

@property (nonatomic, readwrite, assign) id faceDetectionFrameRate;

-(void)setupCamera:(id)args;
-(void)cleanup:(id)args;
-(void)takePicture:(id)args;

@end
