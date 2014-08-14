//
//  PPNFacesDetectedDelegate.h
//  faceDetection
//
//  Created by Cliff Jacobson on 4/17/14.
//
//

#import <Foundation/Foundation.h>

@protocol PPNFacesDetectedDelegate <NSObject>

@optional

/*!
 @method onFacesDetected:
 @abstract
 Called whenever faces were detected on an AV channel
 
 @param faceRects
 An array of CGRects (placed in NSValue objects)
 
 @discussion
 CGRect face;
 [miValue getValue:&face];
 
 */
- (void)onFacesDetected:(NSArray *)faceRects fullImage:(UIImage *)fullImage croppedFaces:(NSArray *)croppedFaces;
@end
