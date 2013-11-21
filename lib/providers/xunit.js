var Promise = require('bluebird'),
    _ = require('underscore'),
    chart = require('../util/chart');

var xunit = function(sources, outFile, options) {
    this.sources = sources;
    this.outFile = outFile;
    this.options = options || {};
    this.parser = require('../parsers/xunit');

    //TODO: allow for directory reader...directory reader would just identify a list of file paths and then use the file reader, but then
    //need to make sure the labels for directories reflect the files, not just the top level directories..
    var Reader = require('../readers/file');

    //TODO: get labels in a more reliable way??
    this.labels = _.map(this.sources, function(src) {
        return src.split("/").pop();
    });

    this.reader = new Reader(sources);

};

xunit.prototype.barImage = function(successData, failureData) {

    var graphOptions = _.defaults(this.options, {
        scaleShowLabels : true,
        scaleLabel : "<%=parseInt(value, 10)%>",
        scaleFontSize: 14,
        height : 500,
        width : 600,
        barStrokeWidth: 1,
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
        //TODO: figure out a better way to set labels..
        labels : this.labels,
        datasets : [
            successData,
            failureData
        ]
    };

    return chart.render('Bar', this.outFile, graphData, graphOptions);

};

xunit.prototype.lineImage = function(successData, failureData) {

    var graphOptions = _.defaults(this.options, {
        scaleShowLabels : true,
        scaleLabel : "<%=parseInt(value, 10)%>",
        scaleFontSize: 14,
        height : 500,
        width : 600,
        barStrokeWidth: 1,
        successFillColor : "rgba(63,236,92,0.5)",
        successPointColor : "rgba(63,236,92,0.5)",
        successPointStokeColor : "rgba(63,236,92,1)",
        successStrokeColor : "rgba(63,236,92,1)",
        failureFillColor : "rgba(200,0,0,0.5)",
        failureStrokeColor : "rgba(220,220,220,1)",
        failurePointColor : "rgba(200,0,0,0.5)",
        failurePointStokeColor : "rgba(220,220,220,1)"
    });

    successData.fillColor = this.options.successFillColor;
    successData.strokeColor = this.options.successStrokeColor;
    failureData.fillColor = this.options.failureFillColor;
    failureData.strokeColor = this.options.failureStrokeColor;

    var graphData = {
        labels : this.labels,
        datasets : [
            successData,
            failureData
        ]
    };
    return chart.render('Line', this.outFile, graphData, graphOptions);

};

xunit.prototype.successFailGraph = function(type) {

    var successData = {
            data : []
        },
        failData = {
            data : []
        };

    var self = this,
        promises = [];

    var resolver = Promise.pending();

    this.reader.read()
        .then(function(parsables) {

            parsables.forEach(function(parsable) {
                var promise = self.parser.parse(parsable);

                promise.then(function(testChartObj) {
                    successData.data.push(testChartObj.successes);
                    failData.data.push(testChartObj.failures);
                });
                promises.push(promise);
            });

            Promise
                .all(promises)
                .then(function() {
                    //console.log(successData);
                    resolver.fulfill(self[type + 'Image'](
                        successData,
                        failData));
                });

        })
        .catch(function(err) {
            promises.push(Promise.rejected("Failed to read chart sources: " + err));
        });


    return resolver.promise;

};

xunit.prototype.bar = function() {

    return this.successFailGraph('bar');

};

//xunit.prototype.pie = function() {

    //TODO: ..

//};

xunit.prototype.line = function() {
    return this.successFailGraph('line');
}

module.exports = xunit;




