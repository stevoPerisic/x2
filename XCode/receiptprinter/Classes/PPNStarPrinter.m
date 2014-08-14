//
//  PPNStarPrinter.m
//  receiptprinter
//
//  Created by Cliff Jacobson on 7/8/14.
//
//

#import "PPNStarPrinter.h"
#import <sys/time.h> // adds gettimeofday()
#import <StarIO/SMPort.h>

@implementation PPNStarPrinter


#pragma Star Printer methods

+(NSString *)sendCommand:(NSData *)commandsToPrint portName:(NSString *)portName portSettings:(NSString *)portSettings timeoutMillis:(u_int32_t)timeoutMillis
{
    int commandSize = (int)[commandsToPrint length];
    unsigned char *dataToSentToPrinter = (unsigned char *)malloc(commandSize);
    [commandsToPrint getBytes:dataToSentToPrinter];
    NSString *errorMsg = nil;
    
    SMPort *starPort = nil;
    @try
    {
        if(portName == nil)
        {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer Setting Issue\", \"suberror\" : \"PortName is nil\" }"];
            return errorMsg;
        }
        if(portSettings == nil)
        {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer Setting Issue\", \"suberror\" : \"PortSettings is nil\" }"];
            return errorMsg;
        }
        starPort = [SMPort getPort:portName :portSettings :timeoutMillis];
        if (starPort == nil)
        {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer Not Connected\", \"suberror\" : \"Fail to Open Port Initial Attempt\" }"];
            return errorMsg;
        }
        
        StarPrinterStatus_2 status;
        [starPort beginCheckedBlock:&status :2];
        if (status.offline == SM_TRUE)
        {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer is offline\" }"];
            return errorMsg;
        }
        
        struct timeval endTime;
        gettimeofday(&endTime, NULL);
        endTime.tv_sec += 30;
        
        int totalAmountWritten = 0;
        while (totalAmountWritten < commandSize)
        {
            int remaining = commandSize - totalAmountWritten;
            int amountWritten = [starPort writePort:dataToSentToPrinter :totalAmountWritten :remaining];
            totalAmountWritten += amountWritten;
            
            struct timeval now;
            gettimeofday(&now, NULL);
            if (now.tv_sec > endTime.tv_sec)
            {
                break;
            }
        }
        
        if (totalAmountWritten < commandSize)
        {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer Error - Too Slow\", \"suberror\" : \"Took too long - Printer Error - Write port timed out.\" }"];
        }
        
        starPort.endCheckedBlockTimeoutMillis = 30000;
        [starPort endCheckedBlock:&status :2];
        if (status.offline == SM_TRUE) {
            errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer is offline\" }"];
            return errorMsg;
        }
    }
    @catch (PortException *exception)
    {
        errorMsg = [[NSString alloc] initWithString:@"{ \"error\" : \"Printer Error - Communication Issue\", \"suberror\" : \"PortException - Printer Error - Write port timed out.\" }"];
    }
    @finally
    {
        free(dataToSentToPrinter);
        [SMPort releasePort:starPort];
    }
    return errorMsg;
}


#pragma mark Sample Receipt (Line)

/**
 * This function print the sample receipt (3inch)
 * portName - Port name to use for communication. This should be (TCP:<IPAddress>)
 * portSettings - Should be blank
 */
+(NSString *)PrintSampleTimeCardReceiptWithPortname:(NSString *)portName portSettings:(NSString *)portSettings
{
    NSMutableData *commands = [[NSMutableData alloc] init];
    /*
     [commands appendBytes:"\x1b\x1d\x61\x01" length:sizeof("\x1b\x1d\x61\x01") - 1];    // center
     [commands appendBytes:"\x1b\x1d\x61\x00" length:sizeof("\x1b\x1d\x61\x00") - 1];    // Alignment(left)
     [commands appendBytes:"\x1b\x44\x02\x10\x22\x00" length:sizeof("\x1b\x44\x02\x10\x22\x00") - 1];    // SetHT
     [commands appendBytes:"\x1b\x45" length:sizeof("\x1b\x45") - 1];    // SetBold
     [commands appendBytes:"\x1b\x46" length:sizeof("\x1b\x46") - 1];    // CancelBold
     [commands appendBytes:"\x09" length:sizeof("\x09") - 1];            // HT
     [commands appendData:[@"Total" dataUsingEncoding:NSASCIIStringEncoding]];
     [commands appendBytes:"\x09\x09\x1b\x69\x01\x01" length:sizeof("\x09\x09\x1b\x69\x01\x01") - 1];    // SetDoubleHW
     [commands appendData:[@"$156.95\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
     [commands appendBytes:"\x1b\x69\x00\x00" length:sizeof("\x1b\x69\x00\x00") - 1];    // CancelDoubleHW
     [commands appendData:[@"------------------------------------------------\r\n\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
     [commands appendBytes:"\x1b\x64\x02" length:sizeof("\x1b\x64\x02") - 1];    // CutPaper
     */
    
    [commands appendData:[@"Peoplenet Test Receipt\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    
    [commands appendData:[@"------------------------------------------------\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"PAY PERIOD ENDING:                    06/08/2014\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"JOBS, STEVEN\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"------------------------------------------------\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"            IN        OUT        TOT1       TOT2\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"------------------------------------------------\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"MON       8:00a     12:00p       4.00       4.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"MON      12:30a      4:30p       4.00       8.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"TUE       8:00a     12:00p       4.00      12.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"TUE      12:30a      4:30p       4.00      16.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"WED       8:00a      4:30p       4.00      24.50\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"ADJUSTMENT BREAK                -0.50      24.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"THU       8:00a     12:00p       4.00      28.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"THU      12:30a      4:30p       4.00      32.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"FRI       8:00a     12:00p       4.00      36.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"FRI      12:30a      4:30p       4.00      40.00\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    [commands appendData:[@"------------------------------------------------\r\n" dataUsingEncoding:NSASCIIStringEncoding]];
    
    
    [commands appendBytes:"\x1b\x64\x02" length:sizeof("\x1b\x64\x02") - 1];    // CutPaper
    
    //NSString *txt = [[NSString alloc] initWithData:commands encoding:NSUTF8StringEncoding];
    
    NSString *result = [self sendCommand:commands portName:portName portSettings:portSettings timeoutMillis:10000];
    
    //NSLog(@"**RESULT** %@ **\r\n%@", result, txt);
    
    [commands release];
    return result;
}




@end
