/**
 * Your Copyright Here
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "TiModule.h"
#import "LoggingProtocol.h"

@interface ComPeoplenetFacedetectModule : TiModule<LoggingProtocol>
{
}

-(void)trace:(NSString *)name value:(NSString *)value;
-(void)error:(NSString *)name value:(NSString *)value errorCode:(int)errorCode;
+(NSObject<LoggingProtocol> *)Logger;

@end
