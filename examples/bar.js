var trazar = require('../lib/trazar');

var sources = [
    __dirname + "/xunit-samples/project-one.xml",
    __dirname + "/xunit-samples/project-two.xml"];

var options = {
    successStrokeColor : "#000000"
};

var outFile = __dirname + '/out/hello-world-bar.png';

var promise = trazar.from('xunit', sources, options).chart('bar', outFile);

promise
    .then(function(result) {
        console.log("Chart generated!");
    })
    .catch(function(err) {
        console.error(err);
    });
