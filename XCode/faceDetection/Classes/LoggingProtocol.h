//
//  LoggingProtocol.h
//  titanium-facialrecognition
//
//  Created by Jacob Clark on 6/3/13.
//
//

#ifndef titanium_videokitsdk_LoggingProtocol_h
#define titanium_videokitsdk_LoggingProtocol_h

#import <Foundation/Foundation.h>

#define ERROR_GENERIC 1000

@protocol LoggingProtocol <NSObject>

@required
- (void) trace:(NSString *) name value:(NSString *)value;
- (void) error:(NSString *) name value:(NSString *)value errorCode:(int)errorCode;

@end


#endif
