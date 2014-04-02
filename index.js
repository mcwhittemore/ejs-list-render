var ejs = require("ejs");
module.exports = function(files, data, cb) {

    console.log(files);

    if (typeof files === "string") {
        files = [files];
    }

    var compile = function(i, html) {
        if (i < 0) {
            cb(null, html);
        } else {
            data.__yield = html;
            console.log(files[i], data);
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
            res.end(err.stack ? err.stack : err.toString());
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
    var resAttr = opts.name || "listRender";

    var baseData = opts.data || {};
    var baseKeys = Object.keys(baseData);
    var numKeys = baseKeys.length;

    var path = require("path");
    return function(req, res, next) {
        res[resAttr] = function(files, data, cb) {

            for (var i = 0; i < numKeys; i++) {
                var key = baseKeys[i];
                data[key] = data[key] || baseData[key];
            }

            console.log(data);

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