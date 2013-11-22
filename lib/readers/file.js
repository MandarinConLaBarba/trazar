var Promise = require('bluebird'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    readDir = Promise.promisify(require('fs').readdir),
    lstat = Promise.promisify(require('fs').lstat),
    readFile = Promise.promisify(require('fs').readFile);

var reader = function(source, options) {

    if (!_.isArray(source)) {
        source = [source];
    }

    options = options || {};

    this.options = _.defaults(options, {
        limit : 10,
        sortBy : 'timestamp'
    });

    this.sources = source;

};


reader.isDirectory = function(path) {

    return reader.isFileOrDir(path, 'dir');

};

reader.isFile = function(path) {

    return reader.isFileOrDir(path, 'file');
};

/**
 * Tests if it is a string and if is either a file or directory..
 *
 * @param path
 * @param type
 * @returns {Function|ref.promise|promise|PromiseResolver.promise}
 */
reader.isFileOrDir = function(path, type) {
    var resolver = Promise.pending();
    if (_.isString(path)) {


        lstat(path)
            .then(function(stats) {

                var method = type.toLowerCase() === "dir" ? "isDirectory" : "isFile";

                resolver.fulfill(stats[method]());

            })
            .catch(function(err) {
                resolver.reject(err);
            });


    } else {
        resolver.fulfill(false);
    }
    return resolver.promise;
};

reader.getRelevantFilesFromDirectory = function(parentPath, filter) {

    filter = filter || ".xml";
    var self = this;
    var resolver = Promise.pending();
    var files = [];

    readDir(parentPath)
        .then(function(subpaths) {

            var filePromises = [];

            subpaths.forEach(function(subpath) {
                var fullPath = path.join(parentPath, subpath);
                var promise = reader.isFile(fullPath)
                    .then(function() {
                        if (!filter || (filter && subpath.indexOf(filter) !== -1)) {
                            files.push(fullPath);
                        }
                    });

                filePromises.push(promise);
            });

            Promise.all(filePromises)
                .then(function() {

                    resolver.fulfill(files);
                });
        })
        .catch(function(err) {
            resolver.reject(err);
        });

    return resolver.promise;

};

/**
 * Must return an array of 'parsables', something that can be parsed into a chartItem, i.e. an xunit xml string, or
 */
reader.prototype.read = function()  {

    var self = this;
    var parsables = [],
        promises = [];

    var finalSources = whittleSourceList(this.sources, this.options.limit, this.options.sortBy);

    finalSources.forEach(function(source) {
        var promise;
        promise = readFile(source)
            .then(function(result) {
                parsables.push(result);
            });

        promises.push(promise);

    });

    return Promise.all(promises)
        .then(function() {
            return parsables;
        });


};

reader.prototype.getSources = function() {
    return this.sources;
};


module.exports = reader;


function whittleSourceList(sources, limit, sortBy) {


    return _.chain(sources)
        .map(function(source) {
            return {
                stats : fs.lstatSync(source),
                path : source
            }
        })
        .filter(function(sourceObj) {
            return sourceObj.stats.isFile();
        })
        .sortBy(function(sourceObj) {
            if (sortBy === "filename") {
                return sourceObj.path.split("/").pop();
            } else {
                return sourceObj.stats.mtime.getTime();
            }

        })
        .first(limit)
        .map(function(sourceObj) {
            return sourceObj.path;
        })
        .value();

}