var Promise = require('bluebird'),
    fs = require('fs');

module.exports = {
    writeFile : Promise.promisify(fs.writeFile)
};