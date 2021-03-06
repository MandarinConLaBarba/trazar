var Promise = require('bluebird'),
    _ = require('underscore');

var xunit = function(sources, outFile, options) {
    options = options || {};
    var parser = require('../parsers/xunit');

    var Reader = require('../readers/file');

    var Charter = require('../charters/successFail');

    this.charter = new Charter(new Reader(sources), parser, options, outFile);

};


xunit.prototype.bar = function() {

    return this.charter.chart('bar');

};

xunit.prototype.line = function() {
    return this.charter.chart('line');
};

module.exports = xunit;




