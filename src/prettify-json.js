'use strict';

const fs = require('fs');
const fsPromises = fs.promises;

module.exports = (config) => {
    const {indent, input, output} = config;

    const load = () => {
        if (!fs.existsSync(input)) {
            throw new Error('File does not exist: ' + input);
        }

        return fsPromises.readFile(input).then(JSON.parse);
    };

    const save = (data) => {
        const outputContent = JSON.stringify(data, null, indent || 2) + '\n';
        return fsPromises.writeFile(output, outputContent);
    };

    return {load, save};
};
