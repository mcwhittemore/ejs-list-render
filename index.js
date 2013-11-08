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

module.exports.connect = function(req, res, next) {
    res.render = function(files, data, cb) {
        module.exports(files, data, function(err, html) {
            if (cb) {
                cb(err, html);
            } else if (err) {
                res.statusCode = 500;
                res.end(err);
            } else {
                res.end(html);
            }
        });
    }
    next();
}