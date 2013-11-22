var Promise = require('bluebird'),
    fileReader = require('./readers/file');

var ChartFactory = function(provider, sources, options) {

    this.providerName = provider;
    this.providerClass = require("./providers/" + provider);
    this.sources = sources;
    this.options = options;

};

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

exports.from = function(provider, sources, options) {
    return new ChartFactory(provider, sources, options);
};


