// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.

var mirrorImage = require('com.inzori.mirrorimage');
Ti.API.info("module is => " + mirrorImage);

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

// place imageView
var iv = Ti.UI.createImageView({top:30,image:'sample.png'});
win.add(iv);

// place button
var btn = Ti.UI.createButton({top:5,title:'Mirror',color:'#000',height:20,width:100});
win.add(btn);

win.open();

btn.addEventListener('click',function(){
	// convert imageView to image blob
    var imageBlob = iv.toImage();

	// the parameter must be a blob, returns a blob
    var newImageBlob = mirrorImage.imageMirror(imageBlob);

	// replace with the mirrored image blob
    iv.setImage(newImageBlob);
});
