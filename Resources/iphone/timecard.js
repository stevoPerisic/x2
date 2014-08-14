function hideActivityIndicator() {
    _.isUndefined(CloudClock.employeeOptions) || _.isNull(CloudClock.employeeOptions) ? timecard.context.activityIndicator.hide() : CloudClock.employeeOptions ? CloudClock.employeeOptions.activityIndicator.hide() : timecard.context.activityIndicator.hide();
}

var timecard = {};

timecard.params = {};

timecard.setEmplCommParams = {};

timecard.printer = require("com.acktie.mobile.ios.airprint");

console.log(timecard.printer);

timecard.receiptprinter = require("com.peoplenet.receiptprinter");

console.log(timecard.receiptprinter);

timecard.confirmationMessage = {
    message: {},
    create: function() {
        timecard.confirmationMessage.message = Ti.UI.createLabel({
            id: "confirmationMessage",
            top: "25%",
            left: "25%",
            height: "50%",
            width: "50%",
            zIndex: 1,
            backgroundColor: "#000",
            color: "#fff",
            opacity: "0.7",
            borderRadius: 20,
            font: {
                fontSize: "28dp"
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
        });
    },
    add: function() {
        null !== timecard.context && "employeeOptions_timecardDetail" !== timecard.context.__controllerPath && "employeeFlow_hoursVerification" !== timecard.context.__controllerPath ? timecard.context.timecardDetail.add(timecard.confirmationMessage.message) : CloudClock.employeeOptions ? CloudClock.employeeOptions.employeeOptions.add(timecard.confirmationMessage.message) : timecard.context.timecardDetail.add(timecard.confirmationMessage.message);
    },
    remove: function() {
        timecard.confirmationDialog_timeout = setTimeout(function() {
            delete timecard.confirmationDialog_timeout;
            if (null !== timecard.context && "employeeOptions_timecardDetail" !== timecard.context.__controllerPath && "employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
                timecard.context.timecardDetail.remove(timecard.confirmationMessage.message);
                timecard.submitPunchAndView();
            } else {
                if (null === timecard.context) return false;
                if (CloudClock.employeeOptions) {
                    CloudClock.employeeOptions.employeeOptions.remove(timecard.confirmationMessage.message);
                    CloudClock.employeeOptions.__views.sideBarMenu.children[0].fireEvent("click");
                } else {
                    timecard.context.timecardDetail.remove(timecard.confirmationMessage.message);
                    timecard.viewDetails();
                }
            }
        }, 3e3);
    }
};

timecard.confirmationDialog_timeout = 0;

timecard.handleOffline = function() {
    timecard.errorLabel = Ti.UI.createLabel({
        text: CloudClock.customL.strings("error_lbl_3"),
        color: "#333",
        top: "300dp"
    });
    try {
        timecard.context.timecardWrap.removeAllChildren();
        timecard.context.timecardWrap.add(timecard.errorLabel);
        hideActivityIndicator();
    } catch (error) {
        CloudClock.error(error);
    }
};

timecard.handleErrorResponse = function(response) {
    if (null !== timecard.context) {
        timecard.errorLabel = Ti.UI.createLabel({
            id: "timecardErrorLabel",
            text: "employeeOptions_timecardDetail" === timecard.context.__controllerPath ? CloudClock.customL.strings("timesheetReq_notRegisteredEmpl") : CloudClock.customL.strings("error_lbl_2"),
            color: "#333",
            top: "300dp"
        });
        try {
            if ("employeeOptions_timecardDetail" === timecard.context.__controllerPath || "employeeFlow_hoursVerification" === timecard.context.__controllerPath) {
                timecard.context.timecardWrapHeader.hide();
                timecard.context.tableHolder.hide();
            } else timecard.context.timecardWrap.removeAllChildren();
            "employeeOptions_timecardDetail" !== timecard.context.__controllerPath && timecard.context.header.exit.show();
            timecard.context.timecardWrap.add(timecard.errorLabel);
            timecard.context.timecardDetail.visible || timecard.context.timecardDetail.show();
            hideActivityIndicator();
        } catch (error) {
            CloudClock.error(error);
        }
    }
    CloudClock.log("Error", "Error getting punch and view timecard: " + JSON.stringify(response));
};

timecard.handleHTMLresponse = function(response) {
    var webView = Ti.UI.createWebView({
        id: "timecardWebView",
        top: 0,
        height: "90%",
        width: "96%",
        backgroundColor: "#fcfcfc"
    });
    try {
        _.has(timecard, "errorLabel") && timecard.context.timecardWrap.remove(timecard.errorLabel);
        if (_.has(response, "error")) timecard.handleErrorResponse(response); else {
            var timecardHTML = response.timecard.replace("<html>", '<html><head><meta name="format-detection" content="telephone=no" /></head>');
            webView.html = timecardHTML;
            if ("employeeOptions_timecardDetail" === timecard.context.__controllerPath || "employeeFlow_hoursVerification" === timecard.context.__controllerPath || 0 === timecard.context.timecardWrap.children.length) {
                timecard.context.timecardWrap.add(webView);
                webView = null;
                "employeeOptions_timecardDetail" !== timecard.context.__controllerPath && timecard.context.header.exit.show();
            } else if (timecard.context.timecardWrap.children.length > 0) {
                timecard.context.timecardWrap.removeAllChildren();
                timecard.context.timecardWrap.add(webView);
                webView = null;
            } else timecard.context.timecardWrap.children[0].html = response.timecard;
            timecard.context.removeClass(timecard.context.nextWeek, "active");
            timecard.context.removeClass(timecard.context.previousWeek, "active");
            timecard.context.removeClass(timecard.context.nextWeekLbl, "active");
            timecard.context.removeClass(timecard.context.previousWeekLbl, "active");
            timecard.context.previousWeek.enabled = true;
            timecard.context.nextWeek.enabled = true;
            hideActivityIndicator();
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "2000";
            Alloy.Collections.deviceHelp.audioPlayer.play();
        }
    } catch (error) {
        console.log("Error in timecard.handleHTMLresponse!");
        CloudClock.error(error);
    }
};

timecard.handlePRINTresponse = function(response) {
    console.log(response);
    var printTimecardDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "printTimecard");
    var printTimecardFile = "timecardDetails.txt";
    var timecardFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, printTimecardFile);
    try {
        console.log("Does our Print Timecard folder exist? " + printTimecardDir.exists());
        if (false === printTimecardDir.exists()) {
            console.log("\n No it does not exist create it.");
            printTimecardDir.createDirectory();
        } else {
            var existingTimecard = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "printTimecard/", printTimecardFile);
            existingTimecard.deleteFile();
        }
        timecardFile.write(response.timecard);
        timecardFile.move("printTimecard/" + printTimecardFile);
        timecardFile = null;
        timecard.printer.print({
            file: "printTimecard/" + printTimecardFile,
            text: {
                isMarkup: true
            },
            orientation: "landscape",
            view: timecard.context.print,
            sentToPrinter: function(r) {
                console.log("SentToPrinter callback: " + JSON.stringify(r));
            }
        });
    } catch (error) {
        CloudClock.error(error);
    }
};

timecard.handlePRINTReceiptResponse = function(response) {
    console.log(response);
    try {
        var printText = response.timecard;
        printText += moment().format("MM/DD/YYYY hh:mm:ss a");
        var printingResult = timecard.receiptprinter.printReceiptText(printText);
        if (printingResult) {
            var resultObject = JSON.parse(printingResult);
            if (resultObject && resultObject.error) {
                var logInfo = resultObject.error;
                resultObject.suberror && (logInfo += " \r\nErrorDetail: " + resultObject.suberror);
                CloudClock.error(logInfo);
                timecard.context.printReceiptError = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("ok") ],
                    title: CloudClock.customL.strings("alert"),
                    message: "Printer not available.",
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            _e.source.id === this.cancel && timecard.context.printReceiptError.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                        }
                    }
                });
                timecard.context.printReceiptError.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
            }
        }
    } catch (error) {
        CloudClock.error(error);
    }
};

timecard.submitPunchAndView = function() {
    CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " submitted a request to view their time post punch.");
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = 0;
    var cfg = {
        endpoint: "employeePrintTimecard",
        params: timecard.params,
        onSuccess: function(response) {
            timecard.handleHTMLresponse(response);
        },
        onError: function(response) {
            timecard.handleErrorResponse(response);
        },
        onOffline: function() {
            timecard.handleOffline();
        },
        payload: {
            punch: {
                idType: CloudClock.sessionObj.currentPunch.idType,
                employeeBadge: CloudClock.sessionObj.currentPunch.employeeBadge,
                transType: CloudClock.sessionObj.currentPunch.transType,
                departmentNum: CloudClock.sessionObj.currentPunch.departmentNum,
                command: "view",
                transTime: CloudClock.sessionObj.currentPunch.transTime,
                transSrc: 0,
                verified: 0,
                transDateTime: CloudClock.sessionObj.currentPunch.transDateTime,
                initials: CloudClock.sessionObj.currentPunch.initials
            }
        }
    };
    CloudClock.api.request(cfg);
};

timecard.handleJSONresponse = function(response) {
    try {
        _.each(timecard.context.timecardWrap.children, function(child) {
            _.has(child, "id") && "timecardWebView" === child.id && $.timecardWrap.remove(child);
        });
        _.has(timecard, "errorLabel") && timecard.context.timecardWrap.remove(timecard.errorLabel);
        if ("N/A" === response.weekEnding) {
            timecard.context.weekEnding = false;
            var errorLabel = Ti.UI.createLabel({
                id: "employeeNotRegistered",
                text: CloudClock.customL.strings("timesheetReq_notRegisteredEmpl"),
                color: "#333",
                top: "300dp"
            });
            if ("employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
                timecard.context.timecardWrapHeader.hide();
                timecard.context.tableHolder.hide();
                timecard.context.timecardWrap.add(errorLabel);
                timecard.context.timecardWrap.show();
                timecard.context.timecardDetail.show();
            } else {
                timecard.context.timecardDetail.visible = timecard.context.timecardDetail.visible ? true : true;
                timecard.context.tableLeftContainer.children[0].hide();
                timecard.context.tableLeftContainer.children[1].hide();
                timecard.context.tableLeftContainer.children[2].hide();
                errorLabel.top = "80dp";
                3 >= timecard.context.tableLeftContainer.children.length && timecard.context.tableLeftContainer.add(errorLabel);
            }
            hideActivityIndicator();
            return false;
        }
        var dailySummary = [];
        var weeklySummary = [];
        var row = null;
        var endOfWeek = moment(response.weekEnding, "MM-DD-YYYY").format("MMMM D[,] YYYY");
        var startOfWeek = moment(response.weekEnding, "MM-DD-YYYY").subtract("days", 6).format("MMMM D[,] YYYY");
        var startOfWeekDayNum = moment(response.weekEnding, "MM-DD-YYYY").subtract("days", 6).day();
        timecard.context.timecardWrapHeader.setText(startOfWeek + " - " + endOfWeek);
        var sorted_listOfDays = response.dailySummary.slice(startOfWeekDayNum).concat(response.dailySummary.slice(0, startOfWeekDayNum));
        _.each(sorted_listOfDays, function(rowData, i) {
            row = Alloy.createController("employeeFlow_timecardDetailRow", {
                weekEnding: response.weekEnding,
                dayNumber: i,
                hours: rowData.totalHours.toFixed(2)
            }).getView();
            dailySummary.push(row);
            row = null;
        });
        var totalHours = 0;
        var paySummaryLength = response.paySummary.length;
        _.each(response.paySummary, function(item) {
            var totalRow = Ti.UI.createTableViewRow({
                height: "44dp"
            });
            var totalLabel1 = Ti.UI.createLabel({
                left: "10dp",
                color: "#333",
                font: {
                    fontSize: "18dp"
                }
            });
            var totalLabel2 = Ti.UI.createLabel({
                right: "15dp",
                color: "#333",
                font: {
                    fontSize: "18dp"
                }
            });
            10 >= item.sortId && (totalHours = Number(totalHours + item.amount));
            if (0 === item.payCode.length && 3 >= paySummaryLength) {
                console.log("remove the empty row");
                weeklySummary.push(totalRow);
                weeklySummary.pop();
            } else {
                totalLabel1.text = item.payCode.replace(/\s*$/, "");
                totalLabel2.text = 0 === item.payCode.length ? "" : item.amount.toFixed(2);
                totalRow.add(totalLabel1);
                totalRow.add(totalLabel2);
                weeklySummary.push(totalRow);
            }
            totalLabel1 = null;
            totalLabel2 = null;
            totalRow = null;
        });
        var totalRow = Ti.UI.createTableViewRow({
            height: "44dp"
        });
        var totalLabel1 = Ti.UI.createLabel({
            text: "Total",
            left: "10dp",
            color: "#333",
            font: {
                fontSize: "18dp",
                fontWeight: "bold"
            }
        });
        var totalLabel2 = Ti.UI.createLabel({
            text: totalHours.toFixed(2),
            right: "15dp",
            color: "#333",
            font: {
                fontSize: "18dp",
                fontWeight: "bold"
            }
        });
        totalRow.add(totalLabel1);
        totalRow.add(totalLabel2);
        weeklySummary.unshift(totalRow);
        if ("employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
            var timecardWrapChildren = timecard.context.timecardWrap.getChildren();
            _.each(timecardWrapChildren, function(child) {
                if ("employeeNotRegistered" === child.id) {
                    console.log("we have the rror screen up");
                    timecard.context.timecardWrap.remove(child);
                    timecard.context.timecardWrapHeader.show();
                    timecard.context.tableHolder.show();
                }
            });
        } else {
            var tableLeftContainerChildren = timecard.context.tableLeftContainer.getChildren();
            _.each(tableLeftContainerChildren, function(child) {
                if ("employeeNotRegistered" === child.id) {
                    console.log("we have the rror screen up");
                    timecard.context.tableLeftContainer.remove(child);
                    timecard.context.tableLeftContainer.children[1].show();
                    timecard.context.tableLeftContainer.children[2].show();
                }
            });
        }
        timecard.context.tableWeeklySum.removeAllChildren();
        timecard.context.tableWeeklySum.height = 44 * weeklySummary.length + "dp";
        timecard.context.tableWeeklySum.setData(weeklySummary);
        if ("employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
            timecard.context.tableDailySum.removeAllChildren();
            timecard.context.tableDailySum.setData(dailySummary);
        }
        timecard.context.timecardWrap.show();
        timecard.context.timecardDetail.show();
        hideActivityIndicator();
        console.log("\n\n\nGarbage collection in the getTimecardDetails_success fn.");
        totalLabel2 = null;
        totalLabel1 = null;
        totalRow = null;
        weeklySummary = null;
        dailySummary = null;
    } catch (error) {
        console.log("error in the handleJSONresponse: " + error);
        CloudClock.error(error);
    }
};

timecard.viewDetails = function() {
    CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " wants to see their time details.");
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = 0;
    var cfg = {
        endpoint: "employeeGetTimecardDetail",
        params: timecard.params,
        onSuccess: function(response) {
            timecard.handleJSONresponse(response);
        },
        onError: function(response) {
            timecard.handleErrorResponse(response);
        }
    };
    CloudClock.api.request(cfg);
};

timecard.viewDetailsPrint = function() {
    CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " wants to print their timecard.");
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = 0;
    var cfg = {
        endpoint: "employeeGetTimecardDetailPrint",
        params: timecard.params,
        onSuccess: function(response) {
            timecard.handleHTMLresponse(response);
        },
        onError: function(response) {
            timecard.handleErrorResponse(response);
        }
    };
    CloudClock.api.request(cfg);
};

timecard.navigateWeeks = function() {
    function disableTheButton(_btn) {
        timecard.context.addClass(_btn, "disabled");
        _btn.enabled = false;
        timecard.context.addClass(_btn.children[0], "labelDisabled");
    }
    try {
        timecard.context.restartTimeout();
        if (CloudClock.APIcallInProgress) return false;
        if (this.classes.indexOf("disabled") > -1) {
            this.removeEventListener("click", timecard.navigateWeeks);
            this.addEventListener("click", timecard.navigateWeeks);
            return false;
        }
        this.removeEventListener("click", timecard.navigateWeeks);
        timecard.context.removeClass("previousWeek" === this.id ? this.parent.children[2] : this.parent.children[0], "disabled");
        timecard.context.removeClass("previousWeek" === this.id ? this.parent.children[2].children[0] : this.parent.children[0].children[0], "labelDisabled");
        timecard.context.week = this.week;
        timecard.params.weekId = this.week;
        if ("employeeOptions_timecardDetail" !== timecard.context.__controllerPath && "employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
            timecard.context.activityIndicator.show();
            timecard.submitPunchAndView();
        } else {
            CloudClock.employeeOptions ? CloudClock.employeeOptions.activityIndicator.show() : timecard.context.activityIndicator.show();
            timecard.viewDetails();
        }
        if ("previousWeek" === this.id && 3 === this.week) {
            disableTheButton(this);
            this.parent.children[2].week = this.week - 1;
        } else if ("previousWeek" === this.id) {
            this.parent.children[2].week = this.week - 1;
            this.week = this.week + 1;
        } else if ("nextWeek" === this.id && 0 === this.week) {
            disableTheButton(this);
            this.parent.children[0].week = this.week + 1;
        } else if ("nextWeek" === this.id) {
            this.parent.children[0].week = this.week + 1;
            this.week = this.week - 1;
        }
        this.addEventListener("click", timecard.navigateWeeks);
    } catch (error) {
        CloudClock.error(error);
    }
};

timecard.prevNextChangeBackground = function(e) {
    try {
        if (this.classes.indexOf("disabled") > -1) {
            this.removeEventListener(e.type, timecard.prevNextChangeBackground);
            this.addEventListener(e.type, timecard.prevNextChangeBackground);
            return false;
        }
        this.removeEventListener(e.type, timecard.prevNextChangeBackground);
        this.backgroundColor = "touchstart" === e.type ? "#34aadc" : "transparent";
        this.addEventListener(e.type, timecard.prevNextChangeBackground);
    } catch (error) {
        CloudClock.error(error);
    }
};

timecard.commButtonsChangeColor = function(e) {
    e.source.backgroundColor = "touchstart" === e.type ? "#34aadc" : "#fff";
    e.source.children[1].color = "touchstart" === e.type ? "#fff" : "#34aadc";
};

timecard.emailMe = function() {
    if (CloudClock.APIcallInProgress) return false;
    CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " emailed themselves a copy of their timecard.");
    if ("email" === this.id) {
        this.removeEventListener("click", timecard.emailMe);
        timecard.context.restartTimeout();
        this.addEventListener("click", timecard.emailMe);
    }
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = timecard.context.week;
    var cfg = {
        endpoint: "employeeEmailTimecard",
        params: timecard.params,
        onSuccess: function() {
            timecard.confirmationMessage.message.text = CloudClock.customL.strings("email_success_A");
            timecard.confirmationMessage.add();
            timecard.confirmationMessage.remove();
        },
        onError: function(response) {
            CloudClock.log("Error", "Request for email errored out: " + JSON.stringify(response));
            timecard.context.emailReqError = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("ok") ],
                title: CloudClock.customL.strings("alert"),
                message: "Sorry, an error occurred while processing your request.",
                callback: {
                    eType: "click",
                    action: function(_e) {
                        _e.source.id === this.cancel && timecard.context.emailReqError.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                    }
                }
            });
            timecard.context.emailReqError.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
        }
    };
    CloudClock.api.request(cfg);
};

timecard.textMe = function() {
    if (CloudClock.APIcallInProgress) return false;
    CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " texted themselves a copy of their timecard.");
    if ("text" === this.id) {
        this.removeEventListener("click", timecard.textMe);
        timecard.context.restartTimeout();
        this.addEventListener("click", timecard.textMe);
    }
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = timecard.context.week;
    var cfg = {
        endpoint: "employeeTextTimecard",
        params: timecard.params,
        onSuccess: function(response) {
            console.log(response);
            timecard.confirmationMessage.message.text = CloudClock.customL.strings("text_success_A");
            timecard.confirmationMessage.add();
            timecard.confirmationMessage.remove();
        },
        onError: function(response) {
            CloudClock.log("Error", "Request for text errored out: " + JSON.stringify(response));
            timecard.context.textReqError = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("ok") ],
                title: CloudClock.customL.strings("alert"),
                message: "Sorry, an error occurred while processing your request.",
                callback: {
                    eType: "click",
                    action: function(_e) {
                        _e.source.id === this.cancel && timecard.context.textReqError.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                    }
                }
            });
            timecard.context.textReqError.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
        }
    };
    CloudClock.api.request(cfg);
};

timecard.printMe = function() {
    if (CloudClock.APIcallInProgress) return false;
    console.log("Employee has clicked the print button");
    timecard.context.restartTimeout();
    timecard.params.weekId = timecard.context.week;
    timecard.params.screenId = timecard.context.week;
    var cfg = {
        endpoint: "employeeGetTimecardDetailPrintReceipt",
        params: timecard.params,
        onSuccess: function(response) {
            timecard.handlePRINTReceiptResponse(response);
        },
        onError: function(response) {
            CloudClock.log("Error", "Request for print errored out: " + JSON.stringify(response));
            timecard.context.couldNotPrint = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("ok") ],
                title: CloudClock.customL.strings("alert"),
                message: CloudClock.customL.strings("couldNotPrint"),
                callback: {
                    eType: "click",
                    action: function() {
                        timecard.context.couldNotPrint.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                    }
                }
            });
            hideActivityIndicator();
            timecard.context.couldNotPrint.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
            console.log(response);
        }
    };
    CloudClock.log("Info", "Requested print timecard for employee: " + CloudClock.sessionObj.employee.get("name") + ", CFG - badge: " + cfg.params.badge);
    CloudClock.api.request(cfg);
};

timecard.setUpEmplComm = function() {
    try {
        if (CloudClock.APIcallInProgress) return false;
        timecard.context.weekNavBtns.setVisible(false);
        "employeeFlow_hoursVerification" !== timecard.context.__controllerPath || _.isObject(timecard.context.hoursVerificationChildren) || (timecard.context.hoursVerificationChildren = timecard.context.timecardWrap.getChildren());
        timecard.context.timecardWrap.removeAllChildren();
        var instructions = Ti.UI.createLabel({
            top: "20dp",
            height: "80dp",
            font: {
                fontSize: "24dp"
            },
            color: "#333",
            text: "text" === this.id ? CloudClock.customL.strings("instructions_cell") : CloudClock.customL.strings("instructions_email")
        });
        var textField = Ti.UI.createTextField({
            id: "text" === this.id ? "dialogTxtFieldCell" : "dialogTxtFieldEmail",
            hintText: "text" === this.id ? "000-000-0000" : "john.doe@company.com",
            top: "100dp",
            height: "60dp",
            width: "60%",
            borderWidth: 1,
            borderColor: "#e4e4e4",
            borderRadius: 10,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            font: {
                fontSize: "40dp"
            },
            color: "#333",
            keyboardType: "text" === this.id ? Ti.UI.KEYBOARD_PHONE_PAD : Ti.UI.KEYBOARD_EMAIL,
            autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
        });
        textField.addEventListener("change", function() {
            console.log("Restart timeout for context");
            timecard.context.restartTimeout();
        });
        if ("text" === this.id) {
            Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1800";
            var picker = Ti.UI.createPicker({
                id: "picker",
                selectionIndicator: true,
                useSpinner: true,
                top: "180dp",
                width: "60%",
                borderColor: "#e4e4e4",
                borderRadius: 10,
                visibleItems: 4
            });
            var pickerColumn = Ti.UI.createPickerColumn({
                id: "cellCarriers"
            });
            var cellCarriers = Alloy.Collections.parameters.getCellCarriersNames();
            var sortArr = [];
            for (var i = 0, ilen = cellCarriers.length; ilen > i; i++) {
                var row = Ti.UI.createPickerRow({
                    title: cellCarriers[i],
                    order: i,
                    borderWidth: 1,
                    borderColor: "#e4e4e4",
                    fontSize: "24dp"
                });
                sortArr.push(row);
                row = null;
            }
            cellCarriers = null;
            sortArr.sort(function(a, b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return textB > textA ? -1 : textA > textB ? 1 : 0;
            });
            picker.addEventListener("change", function() {
                timecard.context.restartTimeout();
            });
            picker.add(sortArr);
            sortArr = null;
            pickerColumn = null;
            timecard.context.timecardWrap.add(picker);
        } else Alloy.Collections.deviceHelp.audioPlayer.viewNo = "1900";
        var buttonWrap = Ti.UI.createView({
            id: "buttonWrap",
            top: "420dp",
            width: "60%",
            backgroundColor: "#fcfcfc",
            layout: "horizontal"
        });
        var cancel = Ti.UI.createLabel({
            id: "text" === this.id ? "cancelCell" : "cancelEmail",
            width: "45%",
            height: "100dp",
            backgroundColor: "#ff2d55",
            color: "#fff",
            borderRadius: 10,
            borderColor: "#ff2d55",
            font: {
                fontSize: "28dp",
                fontWeight: "bold"
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            text: CloudClock.customL.strings("cancel")
        });
        cancel.addEventListener("click", function() {
            console.log(this.id);
            timecard.context.timecardWrap.removeAllChildren();
            timecard.context.weekNavBtns.setVisible(true);
            if ("employeeOptions_timecardDetail" !== timecard.context.__controllerPath && "employeeFlow_hoursVerification" !== timecard.context.__controllerPath) {
                timecard.context.activityIndicator.show();
                timecard.submitPunchAndView();
            } else if (CloudClock.employeeOptions) CloudClock.employeeOptions.__views.sideBarMenu.children[0].fireEvent("click"); else {
                _.each(timecard.context.hoursVerificationChildren, function(child) {
                    timecard.context.timecardWrap.add(child);
                });
                timecard.viewDetails();
            }
        });
        var save = Ti.UI.createLabel({
            id: "text" === this.id ? "saveCell" : "saveEmail",
            width: "45%",
            height: "100dp",
            left: "9.5%",
            backgroundColor: "#62bb47",
            color: "#fff",
            borderRadius: 10,
            borderColor: "#62bb47",
            font: {
                fontSize: "28dp",
                fontWeight: "bold"
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            text: CloudClock.customL.strings("save")
        });
        save.addEventListener("click", function() {
            console.log(this.id);
            var textFieldValue = "";
            var carrier = "";
            if ("saveCell" === this.id) {
                CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " is attempting to set their cell phone.");
                textFieldValue = textField.getValue().replace(/\D/g, "");
                if (10 !== textFieldValue.length) {
                    timecard.context.enter_valid_cellNum = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("enter_valid_cellNum"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    timecard.context.enter_valid_cellNum.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                                    textField.value = "";
                                }
                            }
                        }
                    });
                    timecard.context.enter_valid_cellNum.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                    return false;
                }
                carrier = picker.getSelectedRow(0).title;
                order = parseInt(picker.getSelectedRow(0).order, 10) + 1;
                timecard.context.cellPhoneConfDialog = CloudClock.customAlert.create({
                    type: "alert",
                    cancel: 0,
                    buttonNames: [ CloudClock.customL.strings("no"), CloudClock.customL.strings("yes") ],
                    title: CloudClock.customL.strings("alert"),
                    message: CloudClock.customL.strings("correct_info") + "\n" + CloudClock.customL.strings("cell_phone") + textFieldValue + "\n" + CloudClock.customL.strings("cell_carrName") + carrier,
                    callback: {
                        eType: "click",
                        action: function(_e) {
                            if (_e.source.id !== this.cancel) {
                                CloudClock.sessionObj.employee.save({
                                    cellPhone: textFieldValue,
                                    cellCarrier: order
                                });
                                var setText_cfg = {
                                    endpoint: "employeeProfile",
                                    params: timecard.setEmplCommParams,
                                    payload: {
                                        parm1: textFieldValue,
                                        parm2: order,
                                        itemID: "Mobile"
                                    },
                                    onSuccess: function(response) {
                                        console.log(response);
                                        timecard.textMe();
                                        timecard.context.timecardWrap.removeAllChildren();
                                        if ("employeeFlow_hoursVerification" === timecard.context.__controllerPath) {
                                            _.each(timecard.context.hoursVerificationChildren, function(child) {
                                                timecard.context.timecardWrap.add(child);
                                            });
                                            timecard.viewDetails();
                                        }
                                        timecard.context.weekNavBtns.visible = true;
                                        timecard.context.text.removeEventListener("click", timecard.setUpEmplComm);
                                        timecard.context.text.addEventListener("click", timecard.textMe);
                                    },
                                    onError: function(response) {
                                        Ti.API.error("Error: " + JSON.stringify(response));
                                    }
                                };
                                CloudClock.api.request(setText_cfg);
                            }
                            timecard.context.cellPhoneConfDialog.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                        }
                    }
                });
                timecard.context.cellPhoneConfDialog.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
            } else {
                CloudClock.log("Info", CloudClock.sessionObj.employee.get("name") + " is attempting to set their email.");
                textFieldValue = textField.getValue();
                var n = textFieldValue.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
                if (!n) {
                    timecard.context.enter_valid_email = CloudClock.customAlert.create({
                        type: "alert",
                        cancel: 0,
                        buttonNames: [ CloudClock.customL.strings("ok") ],
                        title: CloudClock.customL.strings("alert"),
                        message: CloudClock.customL.strings("enter_valid_email"),
                        callback: {
                            eType: "click",
                            action: function(_e) {
                                if (_e.source.id === this.cancel) {
                                    timecard.context.enter_valid_email.hide.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                                    textField.value = "";
                                }
                            }
                        }
                    });
                    timecard.context.enter_valid_email.show.apply("employeeOptions_timecardDetail" !== timecard.context.__controllerPath ? timecard.context : CloudClock.employeeOptions);
                    return false;
                }
                CloudClock.sessionObj.employee.save({
                    email: textFieldValue
                });
                var setEmail_cfg = {
                    endpoint: "employeeProfile",
                    params: timecard.setEmplCommParams,
                    payload: {
                        parm1: textFieldValue,
                        parm2: 0,
                        itemID: "Email"
                    },
                    onSuccess: function(response) {
                        console.log(response);
                        timecard.emailMe();
                        timecard.context.timecardWrap.removeAllChildren();
                        if ("employeeFlow_hoursVerification" === timecard.context.__controllerPath) {
                            _.each(timecard.context.hoursVerificationChildren, function(child) {
                                timecard.context.timecardWrap.add(child);
                            });
                            timecard.viewDetails();
                        }
                        timecard.context.weekNavBtns.visible = true;
                        timecard.context.email.removeEventListener("click", timecard.setUpEmplComm);
                        timecard.context.email.addEventListener("click", timecard.emailMe);
                    },
                    onError: function(response) {
                        Ti.API.error(JSON.stringify(response));
                    }
                };
                CloudClock.api.request(setEmail_cfg);
            }
        });
        buttonWrap.add(cancel);
        buttonWrap.add(save);
        timecard.context.timecardWrap.add(instructions);
        timecard.context.timecardWrap.add(textField);
        timecard.context.timecardWrap.add(buttonWrap);
        Alloy.Collections.deviceHelp.audioPlayer.play();
    } catch (error) {
        console.log("Error setUpEmplComm");
        CloudClock.error(error);
    }
};

timecard.init = function(_context) {
    timecard.context = _context;
    timecard.confirmationMessage.create();
    timecard.params = {
        termID: Ti.App.Properties.getString("TERMID"),
        badge: CloudClock.sessionObj.employee.get("badge"),
        weekId: 0
    };
    CloudClock.log("Info", "Timecard initialized for employee: " + CloudClock.sessionObj.employee.get("name"));
    timecard.setEmplCommParams = {
        termID: Ti.App.Properties.getString("TERMID"),
        badge: CloudClock.sessionObj.employee.get("badge")
    };
};

timecard.gc = function() {
    console.log("\n\nTimecard garbage collection :)");
    timecard.context = null;
    timecard.confirmationMessage.message = null;
    delete timecard.confirmationDialog_timeout;
    _.has(timecard, "errorLabel") && delete timecard.errorLabel;
};

module.exports = {
    init: timecard.init,
    submitPunchAndView: timecard.submitPunchAndView,
    viewDetails: timecard.viewDetails,
    viewDetailsPrint: timecard.viewDetailsPrint,
    navigateWeeks: timecard.navigateWeeks,
    prevNextChangeBackground: timecard.prevNextChangeBackground,
    textMe: timecard.textMe,
    emailMe: timecard.emailMe,
    printMe: timecard.printMe,
    setUpEmplComm: timecard.setUpEmplComm,
    commButtonsChangeColor: timecard.commButtonsChangeColor,
    gc: timecard.gc
};