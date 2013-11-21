var Promise = require('bluebird');

var ChartFactory = function(provider, sources, options) {

    this.providerName = provider;
    this.providerClass = require("./providers/" + provider);
    this.sources = sources;
    this.options = options;

};

ChartFactory.prototype.chart = function(type, outFile) {

    this.provider = new this.providerClass(this.sources, outFile, this.options);

    var operation = this.provider[type];

    if (!operation) {
        return Promise.rejected("Unsupported chart type: " + type + " for provider " + this.providerName);
    }

    return operation.call(this.provider);

};


exports.from = function(provider, sources, options) {
    return new ChartFactory(provider, sources, options);
};


