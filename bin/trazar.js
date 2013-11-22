var _ = require('underscore'),
    program = require('commander'),
    trazar = require('../lib/trazar');

program.name = "trazar";
program
    .version(require('../package.json').version)
    .description("A chart generator for CI..")
    .usage('<sourceDir> <outputFile> ')
    .option('-l, --limit', 'number of files in the directory to consider')
    .parse(process.argv);

var options = {};

if (program.limit) {
    options.limit = program.limit;
}

var inputType = 'xunit',
    dir = program.args[0],
    outputFile = program.args[1];

var promise = trazar
    .from(inputType, dir, options)
    .chart('line', outputFile);

promise
    .then(function(result) {
        console.log("Chart generated!");
    })
    .catch(function(err) {
        console.error("Error generating chart:");
        console.error(err);
    });


