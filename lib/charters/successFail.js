var Promise = require('bluebird'),
    _ = require('underscore'),
    chart = require('../util/chart');

var charter = function(reader, parser, options, outFile) {

    //TODO: get labels in a more reliable way?? Or a more configurable way..
    var labels = _.map(reader.getSources(), function(src) {
        return src.split("/").pop();
    });

    this.reader = reader;
    this.parser = parser;
    this.labels = labels;
    this.options = options;
    this.outFile = outFile;

};

charter.prototype.bar = function(successData, failureData) {

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
        labels : this.labels,
        datasets : [
            successData,
            failureData
        ]
    };

    //console.log(JSON.stringify(graphData));

    return chart.render('Bar', this.outFile, graphData, graphOptions);

};

charter.prototype.line = function(successData, failureData) {

    var graphOptions = _.defaults(this.options, {
        scaleShowLabels : true,
        //scaleLabel : "<%=parseInt(value, 10)%>",
        scaleLabel : "<%=value % 1 !== 0 ? '' : parseInt(value, 10) %>",
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
            successData
            ,
            failureData
        ]
    };

    //console.log(JSON.stringify(graphData));

    return chart.render('Line', this.outFile, graphData, graphOptions);

};

charter.prototype.chart = function(type) {

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
                    resolver.fulfill(self[type](
                        successData,
                        failData));
                })
                .catch(function(err) {
                    resolver.reject(err);
                });

        })
        .catch(function(err) {
            resolver.reject("Failed to read chart sources: " + err);
        });


    return resolver.promise;

};


module.exports = charter;