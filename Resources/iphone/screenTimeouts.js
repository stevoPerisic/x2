module.exports = {
    _context: {},
    _window: "",
    currentHeader: null,
    homeScreenTimeout: 3e4,
    employeeFlow: 0,
    employeeOptions: 0,
    managerOptions: 0,
    startScreenSaver: function() {
        try {
            console.log("Adding screensaver and starting animation....");
            if (_.isObject(CloudClock.parent.newEmployeeDialog)) {
                CloudClock.parent.pinPad.clearPinPadTxtField();
                CloudClock.parent.pinPad.addBtnEvents();
                CloudClock.parent.newEmployeeDialog.hide();
            }
            if (_.isObject(CloudClock.parent.wrongManagerPinDialog)) {
                CloudClock.parent.pinPad.clearPinPadTxtField();
                CloudClock.parent.pinPad.addBtnEvents();
                CloudClock.parent.wrongManagerPinDialog.hide();
            }
            if (_.isObject(CloudClock.parent.badPinAlert)) {
                CloudClock.parent.pinPad.clearPinPadTxtField();
                CloudClock.parent.pinPad.addBtnEvents();
                CloudClock.parent.badPinAlert.hide();
            }
            CloudClock.parent.screenSaver.setVisible(true);
            CloudClock.parent.startAnimation();
            CloudClock.screensaverON = true;
        } catch (error) {
            CloudClock.error(error);
        }
    },
    restartTimeoutIndex: function() {
        try {
            var children = CloudClock.parent.index.getChildren();
            _.each(children, function(child) {
                if ("screenSaver" === child.id) {
                    CloudClock.parent.screenSaver.setVisible(false);
                    console.log("Screen saver removed");
                }
            });
            children = null;
            CloudClock.clock.indexTimeout = 0;
            console.log("Index timeout counter reset!");
            CloudClock.parent.screenSaver.running = false;
            console.log("Screen saver property running set to false");
        } catch (error) {
            CloudClock.error(error);
        }
    },
    destroyScreenSaver: function() {
        try {
            CloudClock.parent.stopAnimation();
            CloudClock.parent.screenSaver.hide();
            CloudClock.screensaverON = false;
        } catch (error) {
            CloudClock.error(error);
        }
    },
    flowTimeout: function(_window, _flow) {
        try {
            var that = this;
            that._window = _flow;
            console.log("Timeout started on: " + _flow);
            that._context.timeoutDialog = CloudClock.customAlert.create({
                type: "alert",
                cancel: 0,
                buttonNames: [ CloudClock.customL.strings("quit"), CloudClock.customL.strings("continue") ],
                title: CloudClock.customL.strings("alert"),
                message: CloudClock.customL.strings("session_timeout"),
                callback: {
                    eType: "click",
                    action: function(_e) {
                        try {
                            if (_e.source.id === this.cancel) {
                                CloudClock.screenTimeout.currentHeader.fireEvent("click", {
                                    screenTimedOut: true
                                });
                                CloudClock.clock.showEmployeeFlowDialog = false;
                                CloudClock.clock.showEmployeeOptionsDialog = false;
                                CloudClock.clock.showManagerOptionsDialog = false;
                            } else {
                                CloudClock.screenTimeout.restartTimeout(that._window);
                                _.has(that._context, "newEmployeeTxtField") && that._context.newEmployeeTxtField.focus();
                            }
                            that._context.timeoutDialog.hide.apply(that._context);
                        } catch (error) {
                            CloudClock.error(error);
                        }
                    }
                }
            });
            _.has(that._context, "activityIndicator") && that._context.activityIndicator.hide();
            _.has(that._context, "newEmployeeTxtField") && that._context.newEmployeeTxtField.blur();
            that._context.timeoutDialog.show.apply(that._context);
            CloudClock.log("Info", "Session timed out for: " + JSON.stringify(CloudClock.sessionObj.employee));
        } catch (error) {
            CloudClock.error(error);
        }
    },
    restartTimeout: function(_flow, _window, _header) {
        try {
            console.log("Reset timeout for: " + _flow);
            CloudClock.clock[_flow] = 0;
            if (void 0 === _window || void 0 === _header) return false;
            CloudClock.clock.employeeFlowWindow = _window;
            this.currentHeader = _header;
        } catch (error) {
            CloudClock.error(error);
        }
    }
};