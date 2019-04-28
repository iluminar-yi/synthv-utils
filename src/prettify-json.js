'use strict';

const fs = require('fs');

module.exports = (config) => {
    const {indent, input, output} = config;

    const load = () => {
        if (!fs.existsSync(input)) {
            throw new Error('File does not exist: ' + input);
        }

        return fs.promises.readFile(input).then(JSON.parse);
    };

    const save = (data) => {
        return fs.promises.writeFile(output, JSON.stringify(data, null, indent || 2) + '\n');
    };

    return {load, save};
};
