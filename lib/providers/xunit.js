var Promise = require('bluebird'),
    _ = require('underscore'),
    chart = require('../util/chart');

var xunit = function(sources, outFile, options) {
    options = options || {};
    var parser = require('../parsers/xunit');

    //TODO: allow for directory reader...directory reader would just identify a list of file paths and then use the file reader, but then
    //need to make sure the labels for directories reflect the files, not just the top level directories..
    var Reader = require('../readers/file');


    var Charter = require('../charters/successFail');

    this.charter = new Charter(new Reader(sources), parser, options, outFile);

};


xunit.prototype.bar = function() {

    return this.charter.chart('bar');

};

//xunit.prototype.pie = function() {

    //TODO: ..

//};

xunit.prototype.line = function() {
    return this.charter.chart('line');
};

module.exports = xunit;




