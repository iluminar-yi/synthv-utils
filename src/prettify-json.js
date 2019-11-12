'use strict';

const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

module.exports = (config, {baseDirectory}) => {
    const {indent, input, output} = config;
    const [inputFilePath, outputFilePath] = [path.isAbsolute(input) ? input : path.join(baseDirectory, input),
                                             path.isAbsolute(output) ? output : path.join(baseDirectory, output)];

    const load = () => {
        if (!fs.existsSync(inputFilePath)) {
            throw new Error('File does not exist: ' + inputFilePath);
        }

        return fsPromises.readFile(inputFilePath).then(JSON.parse);
    };

    const save = (data) => {
        const outputContent = JSON.stringify(data, null, indent || 2) + '\n';
        return fsPromises.writeFile(outputFilePath, outputContent);
    };

    return {load, save};
};
