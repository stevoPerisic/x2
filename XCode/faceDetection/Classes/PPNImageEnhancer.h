//
//  PPNImageEnhancer.h
//  faceDetection
//
//  Created by Cliff Jacobson on 4/16/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreImage/CoreImage.h>

@interface PPNImageEnhancer : NSObject

+(CIImage *)enhanceImage:(CIImage *)ciImage;

@end
