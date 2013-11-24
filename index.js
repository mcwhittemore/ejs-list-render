var ejs = require("ejs");
module.exports = function(files, data, cb) {
    if (typeof files === "string") {
        files = [files];
    }

    var compile = function(i, html) {
        if (i < 0) {
            cb(null, html);
        } else {
            data.__yeild = html;
            ejs.renderFile(files[i], {
                locals: data
            }, function(err, html) {
                if (err) {
                    cb(err)
                } else {
                    compile(i - 1, html);
                }
            });
        }
    }

    ejs.renderFile(files[files.length - 1], {
        locals: data
    }, function(err, html) {
        if (err) {
            cb(err)
        } else {
            compile(files.length - 2, html);
        }
    });
}

var responder = function(cb, res) {
    return function(err, html) {
        if (cb) {
            cb(err, html);
        } else if (err) {
            res.statusCode = 500;
            res.end(err);
        } else {
            res.end(html);
        }
    }
}

module.exports.connect = function(req, res, next) {
    res.render = function(files, data, cb) {
        module.exports(files, data, responder(cb, res));
    }
    next();
}

module.exports.express = function(opts) {
    opts = opts || {};
    opts.name = opts.name || "listRender";
    var path = require("path");
    return function(req, res, next) {
        res[opts.name] = function(files, data, cb) {

            var viewFolder = path.join(req.app.get("views"), "/");

            for (var i = 0; i < files.length; i++) {
                files[i] = path.join(viewFolder, files[i]);
                if (!files[i].match(/\.ejs$/)) {
                    files[i] = files[i] + ".ejs";
                }
            }

            module.exports(files, data, responder(cb, res))
        }
        next();
    }
}