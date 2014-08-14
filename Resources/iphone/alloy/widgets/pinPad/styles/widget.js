function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "pinPad/" + s : s.substring(0, index) + "/pinPad/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0003,
    key: "Label",
    style: {
        font: {
            fontFamily: "Helvetica",
            fontSize: "18dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        color: "#333"
    }
}, {
    isApi: true,
    priority: 1000.0004,
    key: "Button",
    style: {
        height: "60dp",
        font: {
            fontSize: "20dp"
        },
        color: "#000"
    }
}, {
    isApi: true,
    priority: 1101.0005,
    key: "Button",
    style: {
        borderColor: "#1c1d1c",
        color: "#ffffff",
        backgroundImage: "none"
    }
}, {
    isClass: true,
    priority: 10000.0001,
    key: "container",
    style: {
        backgroundColor: "#fcfcfc",
        fullscreen: false,
        navBarHidden: false,
        statusBarStyle: Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
        top: 20
    }
}, {
    isClass: true,
    priority: 10000.0002,
    key: "content",
    style: {
        backgroundColor: "#fcfcfc",
        width: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.0006,
    key: "buttonIcon",
    style: {
        left: 10
    }
}, {
    isClass: true,
    priority: 10000.0007,
    key: "buttonLabel",
    style: {
        left: 60,
        color: "#333"
    }
}, {
    isClass: true,
    priority: 10000.0015,
    key: "pinPadButton",
    style: {
        width: "30%",
        height: "17%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0",
                y: "0"
            },
            endPoint: {
                x: "0",
                y: "100"
            },
            colors: [ "#f0f0f0", "#fafafa" ],
            backFillStart: false
        },
        backgroundSelectedColor: "#34aadc",
        backgroundFocusedColor: "#34aadc",
        font: {
            fontSize: "40dp"
        }
    }
}, {
    isClass: true,
    priority: 10000.0017,
    key: "firstRow",
    style: {
        top: "21%"
    }
}, {
    isClass: true,
    priority: 10000.0018,
    key: "secondRow",
    style: {
        top: "41%"
    }
}, {
    isClass: true,
    priority: 10000.0019,
    key: "thirdRow",
    style: {
        top: "61%"
    }
}, {
    isClass: true,
    priority: 10000.002,
    key: "fourthRow",
    style: {
        top: "81%"
    }
}, {
    isClass: true,
    priority: 10000.0021,
    key: "firstCol",
    style: {
        left: 0
    }
}, {
    isClass: true,
    priority: 10000.0022,
    key: "secondCol",
    style: {
        left: "35%"
    }
}, {
    isClass: true,
    priority: 10000.0023,
    key: "thirdCol",
    style: {
        left: "69%"
    }
}, {
    isClass: true,
    priority: 10101.0016,
    key: "pinPadButton",
    style: {
        color: "#000",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    }
}, {
    isId: true,
    priority: 100000.0008,
    key: "activityIndicator",
    style: {
        top: "25%",
        left: "20%",
        height: "50%",
        width: "60%",
        zIndex: 1,
        backgroundColor: "#000",
        color: "#fff",
        opacity: "0.7",
        borderRadius: 20,
        font: {
            fontSize: "28dp"
        }
    }
}, {
    isId: true,
    priority: 100000.0012,
    key: "pinPad",
    style: {
        top: "12%",
        width: "60%",
        height: "75%"
    }
}, {
    isId: true,
    priority: 100000.0013,
    key: "pinPadTxtField",
    style: {
        left: 0,
        width: "100%",
        height: "17%",
        top: 0,
        bubbleParent: false,
        borderWidth: 1,
        borderColor: "#e4e4e4",
        borderRadius: 10,
        color: "#333",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "40dp"
        }
    }
}, {
    isId: true,
    priority: 100000.0025,
    key: "MAINT",
    style: {
        font: {
            fontSize: "20dp"
        }
    }
}, {
    isId: true,
    priority: 100101.0009,
    key: "activityIndicator",
    style: {
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
    }
} ];