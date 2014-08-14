echo “*************************************************************************************************************************”
echo “***************** STARTING BULD “
echo “*************************************************************************************************************************”
echo 
echo 

STARTDIR=$(pwd)
cd "../faceDetectionCameraTest"
DESTDIR=$(pwd)
MODULE=com.peoplenet.facedetect

rm -rf build
cd "$STARTDIR"
echo StartDir = $STARTDIR
echo Project dir = $DESTDIR

pwd
./build.py
rm -rf modules

pwd
unzip $MODULE-iphone-1.0.zip

cd "$DESTDIR"
if [ ! -d "./modules/iphone" ]
then
  mkdir -p modules/iphone
fi
cd ./modules/iphone

rm -rf $MODULE

pwd
cp -r "$STARTDIR/modules/iphone/$MODULE" "./$MODULE"
cd "$DESTDIR"

rm -rf build

cd "$STARTDIR"

pwd
