/**
 * Your Copyright Here
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "ComPeoplenetReceiptprinterModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "PPNStarPrinter.h"
//#import <sys/time.h> // adds gettimeofday()
//#import <StarIO/SMPort.h>

@implementation ComPeoplenetReceiptprinterModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"77b1d88b-d379-4db5-bdc6-42ec0f2c7ea7";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"com.peoplenet.receiptprinter";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];
	
	NSLog(@"[INFO] %@ Titanium Appcelerator Module loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably
	
	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup 

-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Listener Notifications

-(void)_listenerAdded:(NSString *)type count:(int)count
{
	if (count == 1 && [type isEqualToString:@"my_event"])
	{
		// the first (of potentially many) listener is being added 
		// for event named 'my_event'
	}
}

-(void)_listenerRemoved:(NSString *)type count:(int)count
{
	if (count == 0 && [type isEqualToString:@"my_event"])
	{
		// the last listener called for event named 'my_event' has
		// been removed, we can optionally clean up any resources
		// since no body is listening at this point for that event
	}
}

#pragma Public APIs

-(id)example:(id)args
{
	// example method
	return @"hello world method";
}

-(id)exampleProp
{
	// example property getter
	return @"hello world property";
}

-(void)setExampleProp:(id)value
{
	// example property setter
}

-(id)testMethod:(id)args
{
	NSString *response = @"no args";
    if (args) {
        response = @"args found";
        @try
        {
            NSString *parm1 = [args objectAtIndex:0];
            response = parm1;
        }
        @catch (NSException *exc)
        {}
    }
	return response;
}

-(id)testPrint:(id)args
{
	NSString *response = [PPNStarPrinter PrintSampleTimeCardReceiptWithPortname:@"BT:Star Micronics" portSettings:@"Standard"];
    return response;
}


-(id)printReceiptText:(id)args
{
	NSString *response = @"{ \"status\" : \"no args\" }";
    if (args) {
        response = @"{ \"status\" : \"args found\" }";
        @try
        {
            NSString *parm1 = [args objectAtIndex:0];
            response = [NSString stringWithFormat:@"{ \"status\" : \"method printReceiptText called with parameter = %@\" }", parm1];
            
            NSMutableData *commands = [[NSMutableData alloc] init];
            [commands appendData:[parm1 dataUsingEncoding:NSUTF8StringEncoding]];
            [commands appendBytes:"\x1b\x64\x02" length:sizeof("\x1b\x64\x02") - 1];    // CutPaper
            
            NSString *result = [PPNStarPrinter sendCommand:commands portName:@"BT:Star Micronics" portSettings:@"Standard" timeoutMillis:10000];
            
            response = [NSString stringWithFormat:@"%@", result];
        }
        @catch (NSException *exc)
        {
            NSString *beforeExc = response;
            response = [NSString stringWithFormat:@"{ \"error\" : \"EXCEPTION OCCURED: %@\", \"before\" : \"%@\" } ", exc, beforeExc];
        }
    }
    else
    {
        response = @"{ \"status\" : \"no args found, nothing to do, printReceiptText exiting\" }";
    }
	return response;
}


@end
