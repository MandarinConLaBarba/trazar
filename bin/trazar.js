var _ = require('underscore'),
    program = require('commander'),
    trazar = require('../lib/trazar');

program.name = "trazar";
program
    .version(require('../package.json').version)
    .description("A chart generator for CI..")
    .usage('<sourceDir> <outputFile> [options]')
    .option('-f --from <from>', 'which provider/input type to use (i.e. xunit|json)', 'xunit')
    .option('-x --extension <extension>', 'file extension to look for when processing files')
    .option('-l, --limit', 'number of files in the directory to consider')
    .parse(process.argv);

var options = {};

if (program.limit) {
    options.limit = program.limit;
}

var provider = program.from,
    dir = program.args[0],
    outputFile = program.args[1];

var allowedProviders = ['xunit', 'json'];
if (allowedProviders.indexOf(provider) === -1) {
    console.log("Invalid provider.")
    program.help();
}

if (provider === 'json' && !program.extension) {
    options.sourceFilter = '.json';
}

var promise = trazar
    .from(provider, dir, options)
    .chart('line', outputFile);

promise
    .then(function(result) {
        console.log("Chart generated!");
    })
    .catch(function(err) {
        console.error("Error generating chart:");
        console.error(err);
    });


