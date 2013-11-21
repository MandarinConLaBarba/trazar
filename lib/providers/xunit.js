var Promise = require('bluebird'),
    _ = require('underscore'),
    Chart = require('nchart'),
    fs = require('fs'),
    writeFile = Promise.promisify(require('fs').writeFile),
    Canvas = require('canvas');

var xunit = function(sources, outFile, options) {
    this.sources = sources;
    this.outFile = outFile;
    this.options = options || {};
    this.parser = require('../parsers/xunit');
};

xunit.prototype.generateBarGraphImage = function(successData, failureData, chartHeight) {

    var self = this,
        scaleStepWidth = 5,
        scaleSteps = chartHeight / 5;

    var graphOptions = _.defaults(this.options, {
        scaleOverride : true,
        scaleShowLabels : true,
        scaleSteps : scaleSteps,
        scaleStartValue : scaleStepWidth,
        scaleStepWidth : scaleStepWidth,
        scaleFontSize: 14,
        height : 400,
        width : 600,
        barStrokeWidth: 3,
        successFillColor : "rgba(63,236,92,0.5)",
        successStrokeColor : "rgba(63,236,92,1)",
        failureFillColor : "rgba(200,0,0,0.5)",
        failureStrokeColor : "rgba(220,220,220,1)"
    });

    successData.fillColor = this.options.successFillColor;
    successData.strokeColor = this.options.successStrokeColor;
    failureData.fillColor = this.options.failureFillColor;
    failureData.strokeColor = this.options.failureStrokeColor;

    var graphData = {
        labels : _.map(this.sources, function(sourceObj) { return sourceObj.label}),
        datasets : [
            successData,
            failureData
        ]
    };

    var canvas = new Canvas(graphOptions.width, graphOptions.height),
    //toBuffer = Promise.promisify(canvas.toBuffer),
        ctx = canvas.getContext('2d');

    var resolver = Promise.pending();

    Chart(ctx).Bar(graphData, graphOptions);
    canvas.toBuffer(function(err, buf) {

        if (err) throw err;

        writeFile(self.outFile, buf)
            .then(function() {
                resolver.fulfill();
            });
    });

    return resolver.promise;

};

xunit.prototype.bar = function() {

    var successData = {
            data : []
        },
        failData = {
            data : []
        };

    var self = this,
        promises = [],
        chartHeight = 0;

    this.sources.forEach(function(source) {

        var promise = self.parser.parse(source.file);

        promise.then(function(testChartObj) {
            if (testChartObj.totalTests > chartHeight) {
                chartHeight = testChartObj.totalTests;
            }
            successData.data.push(testChartObj.successes);
            failData.data.push(testChartObj.failures);
        });
        promises.push(promise);
    });


    return Promise
        .all(promises)
        .then(function() {
            return self.generateBarGraphImage(
                successData,
                failData,
                chartHeight);
        });
};

module.exports = xunit;




