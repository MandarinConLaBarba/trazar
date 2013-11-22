var Promise = require('bluebird'),
    promisified = require('./promisified'),
    nchartFactory = require('./nchartFactory'),
    canvasFactory = require('./canvasFactory');


exports.render = function(type, outFile, data, options) {

    var canvas = canvasFactory.create(options.width, options.height),
        ctx = canvas.getContext('2d'),
        nchart = nchartFactory.create(ctx);

    nchart[type](data, options);

    return canvas.toBufferAsync()
        .then(function(buf) {
            return promisified.writeFile(outFile, buf);
        });

};