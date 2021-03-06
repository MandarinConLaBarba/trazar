var Promise = require('bluebird'),
    fileReader = require('./readers/file');

/**
 * ChartFactory constructor
 *
 * @api private
 * @param String provider the chart provider to use. i.e. 'xunit', 'json'
 * @param String|Array sources a path to a directory, or an array of file paths
 * @param Object options configuration options, extends chart.js options
 * @constructor
 */
var ChartFactory = function(provider, sources, options) {

    this.providerName = provider;
    this.providerClass = require("./providers/" + provider);
    this.sources = sources;
    this.options = options;

};

/**
 * Generate the chart image
 *
 * @api public
 * @param String type type of chart, i.e. 'line', 'bar'
 * @param String outFile path to output file
 * @returns {Function|ref.promise|promise|PromiseResolver.promise}
 */
ChartFactory.prototype.chart = function(type, outFile) {

    //TODO: Determine labeling strategy?

    //TODO: determine the reader to use (based on the sources)

    var self = this,
        resolver = Promise.pending();

    //TODO: come up w/ a way to specify how many files in directory should be processed, and arbitration strategy, such as by date, filename, etc
    fileReader.isDirectory(this.sources)
        .then(function(isDir) {
            if (isDir) {
                return fileReader.getRelevantFilesFromDirectory(self.sources, self.options.sourceFilter)
                .then(function(directorySources) {
                        self.sources = directorySources;
                    });
            }
        })
        .catch(function(err) {
            resolver.reject(err);
        })
        .finally(function() {

            self.provider = new self.providerClass(self.sources, outFile, self.options);

            var operation = self.provider[type];

            if (!operation) {
                return resolver.reject("Unsupported chart type: " + type + " for provider " + self.providerName);
            }

            operation.call(self.provider)
                .then(function() {
                    resolver.fulfill();
                })
                .catch(function(err) {
                    resolver.reject(err);
                });

        });

    return resolver.promise;

};

/**
 *
 * Prepares a chart factory
 *
 * ### Example
 *
 *

 ```
 var promise = trazar
   .from("json", "path/to/mocha/json/output")
   .chart("line', "path/to/chart.png");
 ```

 * ### Example with options
 *
 *

 ```
 var promise = trazar
   .from("json", "path/to/mocha/json/output", {
     limit : 5,
     scaleLineWidth : 2,
     pointDotRadius : 4
   })
   .chart("line", "path/to/chart.png");
 ```

 * ### Available options
 *
 * #### Common options
 *
 * * limit : Number (number of files to process in a directory)
 * * sortBy : String (method for sorting files on a graph. "filename"|"timestamp")
 * * sourceFilter : String (a string to match files in a directory for processing, i.e. '.xml' will only process files w/ '.xml' in the name)
 * * successFillColor : String (hex or rgba, i.e. '#000000', 'rgba(0,0,0,.1)'
 * * successStrokeColor : String (hex or rgba)
 * * failureFillColor : String (hex or rgba)
 * * failureStrokeColor : String (hex or rgba)
 *
 * #### Line Graph Options
 *
 * * successPointColor : String (hex or rgba)
 * * successPointStrokeColor : String (hex or rgba)
 * * failurePointColor : String (hex or rgba)
 * * failurePointStrokeColor : String (hex or rgba)
 * * any option from http://www.chartjs.org/docs/#lineChart-chartOptions, but note that animation options are not relevant and will have no effect
 *
 * #### Bar Graph Options
 *
 * * any option from http://www.chartjs.org/docs/#barChart-chartOptions, but note that animation options are not relevant and will have no effect

 *
 * @param String provider the chart provider to use. i.e. 'xunit', 'json'
 * @param String|Array sources a path to a directory, or an array of file paths
 * @param Object options configuration options, extends chart.js options
 * @returns {ChartFactory}
 */
exports.from = function(provider, sources, options) {
    return new ChartFactory(provider, sources, options);
};


