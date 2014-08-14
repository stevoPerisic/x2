var should = require("should");

module.exports = function(win, view) {
    describe("index.js", function() {
        describe("#index", function() {
            it("exists", function() {
                should.exist(win);
                win.id.should.equal("index");
            });
            it("has Ti.UI.Window functions", function() {
                should(win.open).be.a.Function;
                should(win.close).be.a.Function;
                should(win.hideTabBar).be.a.Function;
            });
            it("has dimensions equal to the device", function() {
                win.size.height.should.equal(Ti.Platform.displayCaps.platformHeight);
                win.size.width.should.equal(Ti.Platform.displayCaps.platformWidth);
            });
        });
        describe("#left", function() {
            it("exists", function() {
                should.exist(view);
                view.id.should.equal("left");
            });
            it("has Ti.UI.View functions", function() {
                should(view.add).be.a.Function;
            });
            it("is a child of window", function() {
                win.children.length.should.equal(4);
                should.exist(win.children[0]);
                win.children[0].id.should.equal("activityIndicator");
            });
            it("view is half the width of the window", function() {
                view.size.height.should.equal(win.size.height);
                view.size.width.should.equal(win.size.width / 2);
            });
        });
    });
    mocha.run();
};