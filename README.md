#Trazar

An xunit -> chart library..


##Installation

1. Install Cairo (OSX: brew install cairo)
2. Make sure your PKG_CONFIG_PATH includes all relevant pkg-config directories (for me, this was /usr/local/lib/pkgconfig:/usr/X11/lib/pkgconfig):
    export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/usr/X11/lib/pkgconfig
3. npm install


##Simple Example

```
var trazar = require('./lib/generator');
var source = "path/to/some/dir;

var options = {
    successStrokeColor : "#000000"
};

var outFile = __dirname + '/bar.png';
var promise = trazar.from('xunit', source, options).chart('bar', outFile);

promise
    .then(function(result) {
        console.log("Chart generated!");
    })
    .catch(function(err) {
        console.error(err);
    });

```

This will generate something like this:

![](examples/out/hello-world-line.png?raw=true)

Also