var should = require("should");
var render = require("../");
var path = require("path");

var layoutFile = path.join(__dirname, "./layout.ejs");
var fooFile = path.join(__dirname, "./foo.ejs");
var barFile = path.join(__dirname, "./bar.ejs");

it("One File", function(done) {
    render(barFile, {
        bang: "!"
    }, function(err, html) {
        html.should.equal("bar!");
        done(err);
    });
});

it("Two Files", function(done) {
    render([fooFile, barFile], {
        bang: "!"
    }, function(err, html) {
        html.should.equal("foo bar!");
        done(err);
    });
});

it("Three Files", function(done) {
    render([layoutFile, fooFile, barFile], {
        bang: "!"
    }, function(err, html) {
        html.should.equal("<div>foo bar!</div>");
        done(err);
    });
});