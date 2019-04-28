'use strict';

const [, , configFilePath, ...processorNames] = process.argv;

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

    console.debug(`Processors to run: ${processorNames}`);
    console.debug(`Config: \n${JSON.stringify(config, null, 2)}`);

    const getProcessor = (processorName) => require(`./src/${processorName}`)(config[processorName]);
    const {load, save} = getProcessor('prettify-json');

    console.info('Loading data from file');
    let data = await load();
    if (processorNames.length) {
        for (const processorName of processorNames) {
            console.info(`Will run processor ${processorName}`);
            try {
                const nextProcessor = getProcessor(processorName);
                data = await nextProcessor(data);
                console.info(`Done running processor ${processorName}`);
            } catch (e) {
                console.error(`Failed to load processor ${processorName}`, e);
            }
        }
    } else {
        console.warn('No other utils to run!');
    }

    console.info('Saving data to file');
    save(data);
})();
