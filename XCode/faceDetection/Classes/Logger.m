//
//  Logger.m
//  titanium-facialrecognition
//
//  Created by Jacob Clark on 6/3/13.
//
//

#import "Logger.h"
#import "ComPeoplenetFacedetectModule.h"

@implementation Logger

+(void) Trace:(NSString * )origin message:(NSString *)message
{
    [[ComPeoplenetFacedetectModule Logger] trace:origin value:message];
}

+(void) Error:(NSString * )origin message:(NSString *)message errorCode:(int)errorCode
{
    [[ComPeoplenetFacedetectModule Logger] error:origin value:message errorCode:errorCode];
}

+(NSDictionary *)logException:(NSString *) where exception:(NSString *)exception{
    
    NSString *errorName = [NSString stringWithFormat:@"ERROR at %@", where];
    NSDictionary *errorDetails = [[[NSDictionary alloc] initWithObjectsAndKeys:
                                  errorName, @"name", exception, @"value", nil] autorelease];
    
    [Logger Error:errorName message:exception errorCode:1000];
    return errorDetails;
}

+(NSString *)floatAsString:(float)value {
    NSString * str = [NSString stringWithFormat:@"%f", value];
    return str;
}

+(NSString *)intAsString:(int)value {
    NSString * str = [NSString stringWithFormat:@"%d", value];
    return str;
}


@end
