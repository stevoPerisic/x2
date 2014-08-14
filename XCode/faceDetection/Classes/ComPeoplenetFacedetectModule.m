/**
 * Your Copyright Here
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "ComPeoplenetFacedetectModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "LoggingProtocol.h"
#import "Logger.h"

@implementation ComPeoplenetFacedetectModule

#pragma mark Constants
NSString * const EVT_TRACE = @"trace";
NSString * const EVT_ERROR = @"error";

#pragma mark Global Logger
static NSObject<LoggingProtocol> * logger = nil;

+(NSObject<LoggingProtocol> *)Logger
{
    return logger;
}

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"56b14e75-86de-43d5-acbe-90f95950c932";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"com.peoplenet.facedetect";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];
    
    logger = self;
	
	NSLog(@"[INFO] %@ loaded",self);
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
    [Logger Trace:NSStringFromSelector(_cmd) message:@"Ahh shit"];
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

#pragma mark Tracing and Error Events
/*--------------------
 Trace  !!!!
 ---------------------*/
-(void)trace:(NSString *)name value:(NSString *)value{
    NSDictionary *returnArgs = [[[NSDictionary alloc] initWithObjectsAndKeys:
                                 name, @"name", value, @"value", nil] autorelease];
    
    [self fireEvent:EVT_TRACE withObject:returnArgs];
}

/*--------------------
 Error  !!!!
 ---------------------*/
-(void)error:(NSString *)name value:(NSString *)value errorCode:(int)errorCode{
    NSDictionary *returnArgs = [[[NSDictionary alloc] initWithObjectsAndKeys:
                                 name, @"name", value, @"value", [self asString:errorCode], @"errorCode", nil] autorelease];
    
    [self fireEvent:EVT_ERROR withObject:returnArgs];
}

-(NSString *)asString:(int)value {
    NSString * str = [NSString stringWithFormat:@"%d", value];
    return str;
}



@end
