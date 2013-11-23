var Promise = require('bluebird'),
    _ = require('underscore');

var json = function(sources, outFile, options) {
    options = options || {};
    var parser = require('../parsers/json');

    var Reader = require('../readers/file');

    var Charter = require('../charters/successFail');

    this.charter = new Charter(new Reader(sources), parser, options, outFile);

};

json.prototype.bar = function() {

    return this.charter.chart('bar');

};

json.prototype.line = function() {
    return this.charter.chart('line');
};

module.exports = json;




