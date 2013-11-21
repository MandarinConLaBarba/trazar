var Promise = require('bluebird'),
    nchart = require('nchart'),
    fs = require('fs'),
    writeFile = Promise.promisify(require('fs').writeFile),
    Canvas = require('canvas');


exports.render = function(type, outFile, data, options) {

    var canvas = new Canvas(options.width, options.height),
        ctx = canvas.getContext('2d');

    nchart(ctx)[type](data, options);

    var resolver = Promise.pending();

    //TODO: figure out how to promisify toBuffer...it didn't work previously
    canvas.toBuffer(function(err, buf) {

        if (err) throw err;

        writeFile(outFile, buf)
            .then(function() {
                resolver.fulfill();
            });
    });

    return resolver.promise;
};