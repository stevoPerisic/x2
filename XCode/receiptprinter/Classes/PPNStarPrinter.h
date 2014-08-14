//
//  PPNStarPrinter.h
//  receiptprinter
//
//  Created by Cliff Jacobson on 7/8/14.
//
//

#import <Foundation/Foundation.h>

@interface PPNStarPrinter : NSObject


+(NSString *)sendCommand:(NSData *)commandsToPrint portName:(NSString *)portName portSettings:(NSString *)portSettings timeoutMillis:(u_int32_t)timeoutMillis;

+(NSString *)PrintSampleTimeCardReceiptWithPortname:(NSString *)portName portSettings:(NSString *)portSettings;


@end
