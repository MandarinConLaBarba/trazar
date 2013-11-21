var Promise = require('bluebird'),
    _ = require('underscore'),
    fs = require('fs'),
    readDir = Promise.promisify(require('fs').readdir),
    readFile = Promise.promisify(require('fs').readFile);

var reader = function(source) {

    if (!_.isArray(source)) {
        source = [source];
    }

    this.sources = source;

};

/**
 * Must return an array of 'parsables', something that can be parsed into a chartItem, i.e. an xunit xml string, or
 */
reader.prototype.read = function()  {

    var self = this;
    var parsables = [],
        promises = [];

    this.sources.forEach(function(source) {
        var promise;

        var isFile = fs.lstatSync(source).isFile();
        if (isFile) {
            promise = readFile(source)
                .then(function(result) {
                    parsables.push(result);
                });

        } else {
            promises.push(Promise.rejected("The file reader doesn't accept non-file sources."));
        }

        promises.push(promise);

    });

    return Promise.all(promises)
        .then(function() {
            return parsables;
        });


};

//reader.prototype.readDir = function(path) {
//
//    var self = this;
//    var promise = Promise.pending();
//    var parsables = [];
//
//    readDir(path)
//        .then(function(refs) {
//
//            var filePromises = [];
//
//            refs.forEach(function(ref) {
//                if (fs.lstatSync(ref).isFile()) {
//
//                    var filePromise = self.readFile(ref)
//                        .then(function(parsable) {
//                            parsables.push(parsable);
//                        });
//                    filePromises.push(filePromise);
//                }
//            });
//
//            Promise.all(filePromises)
//                .then(function() {
//                    promise.fulfill(parsables);
//                });
//        })
//        .catch(function(err) {
//            promise.reject(err);
//        });
//
//    return promise;
//
//};


module.exports = reader;