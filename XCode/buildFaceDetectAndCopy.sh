#!/bin/sh
clear
############################################################
# Variable assignement
############################################################

sourceFolder="faceDetectionCameraTest/modules/iphone/com.peoplenet.facedetect/1.0" 
#/bitbucket/cloudclock_v2_alloy/XCode/faceDetectionCameraTest/modules/iphone/com.peoplenet.facedetect/1.0
destFolder="../modules/iphone/com.peoplenet.facedetect/1.0" 
#destFolder="./faceDetection/modules/iphone/com.peoplenet.facedetect/1.0" 
#destFolder="./faceDetectionCameraTest/modules/iphone/com.peoplenet.facedetect/1.0" 

############################################################
# Perform Build
############################################################

cd facedetection

sh run.sh

cd ..

############################################################
# Copy file and show results
############################################################

echo "********** BEFORE    ********"
ls -gT $destFolder/libcom.peoplenet.facedetect.a
ls -gT $sourceFolder/libcom.peoplenet.facedetect.a

cp $sourceFolder/libcom.peoplenet.facedetect.a $destFolder/libcom.peoplenet.facedetect.a

echo "********** AFTER     ********"
ls -gT $destFolder/libcom.peoplenet.facedetect.a
echo
echo

