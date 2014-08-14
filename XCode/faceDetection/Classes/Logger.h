//
//  Logger.h
//  titanium-facialrecognition
//
//  Created by Jacob Clark on 6/3/13.
//
//

#import <Foundation/Foundation.h>

@interface Logger : NSObject

+(void) Trace:(NSString * )origin message:(NSString *)message;
+(void) Error:(NSString * )origin message:(NSString *)message errorCode:(int)errorCode;
+(NSDictionary *)logException:(NSString *) where exception:(NSString *)exception;
+(NSString *)floatAsString:(float)value;
+(NSString *)intAsString:(int)value;

@end
