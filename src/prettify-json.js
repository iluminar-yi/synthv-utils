'use strict';

const fs = require('fs');

module.exports = (config) => {
    const {indent} = config;

    const load = (filename) => {
        if (!fs.existsSync(filename)) {
            throw new Error('File does not exist: ' + filename);
        }

        return fs.promises.read(filename).then(JSON.parse);
    };

    const save = (data, filename) => {
        return fs.promises.writeFile(filename, JSON.stringify(data, null, indent || 2));
    };

    return {load, save};
};
