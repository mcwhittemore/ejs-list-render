var should = require("should");
var elr = require("../");
var path = require("path");

var layoutFile = path.join(__dirname, "./layout.ejs");
var fooFile = path.join(__dirname, "./foo.ejs");
var barFile = path.join(__dirname, "./bar.ejs");

it("One File", function(done) {
    elr(barFile, {
        bang: "!"
    }, function(err, html) {
        html.should.equal("bar!");
        done(err);
    });
});

it("Two Files", function(done) {
    elr([fooFile, barFile], {
        bang: "!"
    }, function(err, html) {
        html.should.equal("foo bar!");
        done(err);
    });
});

it("Three Files", function(done) {
    elr([layoutFile, fooFile, barFile], {
        bang: "!"
    }, function(err, html) {
        html.should.equal("<div>foo bar!</div>");
        done(err);
    });
});