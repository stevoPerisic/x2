//
//  PPNImageEnhancer.m
//  faceDetection
//
//  Created by Cliff Jacobson on 4/16/14.
//
//

#import "PPNImageEnhancer.h"
#import <CoreImage/CoreImage.h>
#import "Logger.h"

@implementation PPNImageEnhancer

+(CIImage *)enhanceImage:(CIImage *)ciImage
{
    //[Logger Trace:NSStringFromSelector(_cmd) message:@"enhanceImageCalled"];
    NSDictionary *options = @{ CIDetectorImageOrientation : @"1" };
    NSArray *adjustments = [ciImage autoAdjustmentFiltersWithOptions:options];
    for (CIFilter *filter in adjustments) {
        [filter setValue:ciImage forKey:kCIInputImageKey];
        ciImage = filter.outputImage;
    }
    return ciImage;
}

@end
