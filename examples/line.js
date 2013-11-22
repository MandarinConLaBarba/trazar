var trazar = require('../lib/trazar');

var sources = [
    __dirname + "/xunit-samples/project-one.xml",
    __dirname + "/xunit-samples/project-two.xml"];

var options = {
    successStrokeColor : "#000000"
};

var outFile = __dirname + '/out/hello-world-line.png';

var promise = trazar.from('xunit', sources, options).chart('line', outFile);

promise
    .then(function(result) {
        console.log("Chart generated!");
    })
    .catch(function(err) {
        console.error("Error generating chart:");
        console.error(err);
    });
