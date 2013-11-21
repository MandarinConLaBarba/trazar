var Promise = require('bluebird'),
    readFile = Promise.promisify(require('fs').readFile),
    xml2js = require('xml2js');


function createChartObj(total, failures, skipped, errors) {

    return {
        totalTests : total,
        failures : failures,
        successes : total - failures,
        skipped : skipped,
        errors : errors
    }

}

exports.parse = function(fileName) {

    var parse = Promise.promisify(new xml2js.Parser().parseString);

    return readFile(fileName)
        .then(function(data) {
            return parse(data);
        })
        .then(function(result) {

            var testSuiteInfo = result.testsuite['$'];

            return createChartObj(
                parseInt(testSuiteInfo.tests, 10),
                parseInt(testSuiteInfo.failures, 10),
                parseInt(testSuiteInfo.skipped, 10),
                parseInt(testSuiteInfo.errors, 10)
            );

        })
        .catch(function(err) {
            console.error("An error occured:");
            console.error(err);
        });

};