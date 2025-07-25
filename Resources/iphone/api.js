function emptyfn() {}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

function preProcess(cfg) {
    var params = [];
    if (cfg.endpoint) {
        var endpoint = CloudClock.pplNetApi.endpoints[cfg.endpoint];
        _.defaults(cfg.params || {}, endpoint.params || {});
        cfg.url = endpoint.url || endpoint;
        cfg.method = cfg.method || endpoint.method || CloudClock.pplNetApi.defaultMethod || "GET";
    } else cfg.method = cfg.method || CloudClock.pplNetApi.defaultMethod || "GET";
    if (cfg.params) {
        Ti.App.Properties.getString("TERMID") && !cfg.params.termID ? _.extend(cfg.params, {
            termID: Ti.App.Properties.getString("TERMID")
        }, CloudClock.serverContext) : _.extend(cfg.params, CloudClock.serverContext);
        _.each(cfg.params, function(value, key, obj) {
            _.has(obj, key) && params.push([ key, value ].join("="));
        });
        params.push([ "_dc", new Date().getTime() ].join("="));
        cfg.qryStr = "?" + params.join("&");
    }
    if (cfg.oauth && cfg.params) {
        _.each(cfg.params, function(value, key, obj) {
            _.has(obj, key) && params.push([ key, value ]);
        });
        cfg.parameters = params;
    }
    return cfg;
}

function addRequestHeaders(client, ctxOverrides) {
    for (var header in CloudClock.pplNetApi.headers) CloudClock.pplNetApi.headers.hasOwnProperty(header) && client.setRequestHeader(header, CloudClock.pplNetApi.headers[header]);
    for (var ctx in ctxOverrides) ctxOverrides.hasOwnProperty(ctx) && client.setRequestHeader([ "X", ctx.toUpperCase() ].join("-"), ctxOverrides[ctx]);
}

var _str = require("underscore.string");

exports.request = function(cfg) {
    var timeoutValue = 1e3 * parseInt(Ti.App.Properties.getString("PAGETIMEOUTSHORT"), 10) - 2e3;
    "number" != typeof timeoutValue && (timeoutValue = 28e3);
    if (Ti.Network.online) {
        preProcess(cfg);
        var client = Ti.Network.createHTTPClient({
            validatesSecureCertificate: false,
            timeout: cfg.timeout || timeoutValue,
            onerror: function() {
                CloudClock.APIcallInProgress = false;
                var onXXX = cfg["on" + this.status];
                CloudClock.log("Error", "Response from terminal ID: " + cfg.params.termID + ", API call: " + cfg.endpoint + ", STATUS: " + this.status + ", OPENED: " + this.OPENED + ", DONE: " + this.DONE + ", UNSENT: " + this.UNSENT);
                if (onXXX) onXXX(this); else if (cfg.onError) cfg.onError(this); else {
                    alert("Your request cannot be processed at this time due to a network error.");
                    Ti.API.error("Request Error:");
                    Ti.API.error(" Request: " + JSON.stringify(cfg));
                    Ti.API.error(" Response: " + JSON.stringify(this));
                    CloudClock.log("Error", " Request: " + JSON.stringify(cfg));
                    CloudClock.log("Error", " Response: " + JSON.stringify(this));
                }
            },
            onload: function() {
                CloudClock.APIcallInProgress = false;
                var rsp, onXXX = cfg["on" + this.status];
                CloudClock.log("Info", "Response from terminal ID: " + cfg.params.termID + ", API call: " + cfg.endpoint + ", STATUS: " + this.status + ", OPENED: " + this.OPENED + ", DONE: " + this.DONE + ", UNSENT: " + this.UNSENT);
                if (onXXX) onXXX(this); else if (this.status >= 400 || 0 == this.status) if (cfg.onError) cfg.onError("\n\nAPI errored out: " + this); else {
                    alert("Your request cannot be processed at this time due to a network error.");
                    Ti.API.error("Request Error:");
                    Ti.API.error(" Request: " + JSON.stringify(cfg));
                    Ti.API.error(" Response: " + JSON.stringify(this));
                } else {
                    rsp = this.responseText;
                    try {
                        rsp = JSON.parse(this.responseText);
                    } catch (parseEx) {
                        rsp = this.responseText;
                    }
                    (cfg.onSuccess || emptyFn)(rsp);
                }
            }
        });
        var requestUrl = "";
        requestUrl = isUrl(cfg.url) ? [ cfg.url, cfg.qryStr ].join("") : [ CloudClock.pplNetApi.base, cfg.url, cfg.qryStr ].join("");
        CloudClock.log("Info", "Communicating to terminal ID: " + cfg.params.termID + ", API call: " + cfg.endpoint);
        Ti.API.warn("API - " + requestUrl);
        try {
            ("checkin" !== cfg.endpoint || "checkinComplete" !== cfg.endpoint || "postTransactions" !== cfg.endpoint || "postPhotos_batchMode" !== cfg.endpoint || "getPhotos" !== cfg.endpoint || "getLogo" !== cfg.endpoint || "getHelpFiles" !== cfg.endpoint || "sendLogs" !== cfg.endpoint) && (CloudClock.APIcallInProgress = true);
            client.open(cfg.method, requestUrl, true);
            addRequestHeaders(client, cfg.context);
            _str.contains("POST,PUT", (cfg.method || "").toUpperCase()) ? client.send(JSON.stringify(cfg.payload || {})) : client.send();
        } catch (err) {
            (cfg.onError || emptyFn)(err);
        }
    } else if (cfg.onOffline) cfg.onOffline(); else {
        Ti.API.error("No network connection for request: " + JSON.stringify(cfg.endpoint));
        CloudClock.log("Error", "The device is not online, this request could not be processed: " + JSON.stringify(cfg.endpoint));
    }
};