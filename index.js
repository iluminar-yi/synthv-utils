'use strict';

const [_1, _2, configFilePath, ...processorNames] = process.argv;

if (!configFilePath) {
    console.error('Please specify configFilePath');
    process.exit(1);
}

const fs = require('fs');

(async () => {
    const configFileBuffer = await fs.promises.readFile(configFilePath);
    const config = (() => {
        try {
            return JSON.parse(configFileBuffer);
        } catch (e) {
            return {};
        }
    })();

    const {load, save} = require('./src/prettify-json')(config['prettify-json']);

    let data = await load();
    if (processorNames.length) {
        for (const processorName of processorNames) {
            try {
                const nextProcessor = require(`./src/${processorName}`)(config[processorName]);
                data = await nextProcessor(data);
            } catch (e) {
                console.error(`Failed to load processor ${processorName}`, e);
            }
        }
    } else {
        console.warn('No other utils to run!');
    }

    save(data);
})();
