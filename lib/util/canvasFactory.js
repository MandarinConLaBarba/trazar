var Promise = require('bluebird'),
    Canvas = require('canvas');

module.exports = {

    create : function(w, h) {
        var canvas = new Canvas(w, h);
        canvas.toBufferAsync = Promise.promisify(canvas.toBuffer, canvas);
        return canvas;
    }

};