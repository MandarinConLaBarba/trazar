var Promise = require('bluebird'),
    chartItem = require('../chartItem');

exports.parse = function(parsable) {

    //Using mocha json reporter format..
    var mochaJSONObject = JSON.parse(parsable),
        stats = mochaJSONObject.stats;

    var chartObj = chartItem.create(
        parseInt(stats.tests, 10),
        parseInt(stats.failures, 10),
        0,
        0);

    return Promise.resolve(chartObj);

};