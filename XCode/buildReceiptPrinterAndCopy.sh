#!/bin/sh
clear
############################################################
# Variable assignement
############################################################

sourceFolder="receiptprinter" 
destFolder="../modules/iphone/com.peoplenet.receiptprinter/1.0" 

############################################################
# Perform Build
############################################################

cd receiptprinter

./build.py

cd ..

############################################################
# Copy file and show results
############################################################

echo "********** BEFORE    ********"
ls -gT $destFolder/module.xcconfig
ls -gT $destFolder/libcom.peoplenet.receiptprinter.a
ls -gT $sourceFolder/build/libcom.peoplenet.receiptprinter.a

cp $sourceFolder/module.xcconfig $destFolder/module.xcconfig
cp $sourceFolder/build/libcom.peoplenet.receiptprinter.a $destFolder/libcom.peoplenet.receiptprinter.a

echo "********** AFTER     ********"
ls -gT $destFolder/module.xcconfig
ls -gT $destFolder/libcom.peoplenet.receiptprinter.a
echo
echo

