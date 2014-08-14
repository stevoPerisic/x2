// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
window.add(label);
window.open();

var GoogleAnalytics = require('com.thinkorange.google.analytics');

GoogleAnalytics.addEventListener('complete', function(e) {
  Ti.API.log(e);
});

GoogleAnalytics.addEventListener('hit_dispatched', function(e) {
  Ti.API.log("Hit dispatched!");
  Ti.API.log(e);
});

GoogleAnalytics.startTracker({
  accountID: 'UA-2061857-1',
  debug: true
});
GoogleAnalytics.setAnonymizeIp(true);
GoogleAnalytics.setSampleRate(95);

var top = 10;
function createButton(title, callback) {
  var button = Ti.UI.createButton({
    title: title, top: top, left: 10, right: 10, width: 300, height: 30
  });
  button.addEventListener('click', callback);
  window.add(button);

  top = top + 40;
}

createButton('setCustomVariable', function(e) {
  GoogleAnalytics.setCustomVariable({
    index: 1,
    name : "iPhone1",
    value: "iv1"
  });
});

createButton('getVisitorCustomVariable', function(e) {
  alert(GoogleAnalytics.getVisitorCustomVariable(1));
});

createButton('trackPageView', function(e) {
  GoogleAnalytics.trackPageView('/app_entry_point');
});

createButton('trackEvent', function(e) {
  GoogleAnalytics.trackEvent({
    category: 'my_category',
    action  : 'my_action',
    label   : 'my_label',
    value   : 2
  });
});

createButton('addTransaction', function(e) {
  GoogleAnalytics.addTransaction({
    orderID: '1',
    storeName: "ThinkOrange",
    totalPrice: 2.45,
    totalTax: 0.69,
    shippingCost: 1.00
  });

  Ti.API.log("Transaction added!");
});

createButton('addItem', function(e) {
  GoogleAnalytics.addItem({
    orderID: '1',
    itemName: 'pair of socks',
    itemSKU: 'asdfasdfadfasdf',
    itemPrice: 2.45,
    itemCount: 1,
    itemCategory: 'category'
  });

  Ti.API.log("Item added!")
});

createButton('trackTransaction', function(e) {
  GoogleAnalytics.trackTransactions();
});

createButton('clearTransactions', function(e) {
  GoogleAnalytics.clearTransactions();
});

createButton('setReferrer', function(e) {
  GoogleAnalytics.setReferrer('gclid=12345');
  Ti.API.log("Referrer setted!");
});

createButton('dispatch', function(e) {
  GoogleAnalytics.dispatch();
});

