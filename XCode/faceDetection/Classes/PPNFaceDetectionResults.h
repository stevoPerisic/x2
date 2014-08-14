//
//  PPNFaceDetectionResults.h
//  faceDetection
//
//  Created by Jacob Clark on 3/17/14.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface PPNFaceDetectionResults : NSObject

@property(nonatomic, retain) NSArray * faceRects;
@property(nonatomic, retain) NSArray * faceImages;
@property(nonatomic, retain) UIImage * fullImage;
@property(nonatomic) UIImageOrientation * orientation;
@property(nonatomic, retain) NSMutableArray * allFaces;
@property(nonatomic) CGRect previewBox;

@end
