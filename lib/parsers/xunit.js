var Promise = require('bluebird'),
    chartItem = require('../chartItem'),
    xml2js = require('xml2js');

exports.parse = function(parsable) {

    var parse = Promise.promisify(new xml2js.Parser().parseString);

    return parse(parsable)
        .then(function(result) {

            var testSuiteInfo = result.testsuite['$'];

            var chartObj = chartItem.create(
                parseInt(testSuiteInfo.tests, 10),
                parseInt(testSuiteInfo.failures, 10),
                parseInt(testSuiteInfo.skipped, 10),
                parseInt(testSuiteInfo.errors, 10)
            );

            return chartObj;

        })
        .catch(function(err) {
            console.error("An error occured:");
            console.error(err);
        });

};