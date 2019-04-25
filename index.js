'use strict';

const [_1, _2, filename, ...params] = process.argv;

if (!filename) {
    console.error('No filename specified!');
    process.exit(1);
}

const {load, save} = require('./src/prettify-json')({});
const removeParams = require('./src/remove-params');

const dataPromise = load(filename);

if (params.length) {
    for (let param of params) {
        switch (param) {
            case 'remove-params':
                dataPromise.then(removeParams);
                break;
            default:
                console.error(`Unrecoginized param: ${param}`);
        }
    }
} else {
    console.warn("No other utils to run!");
}

dataPromise.then((data) => save(data, filename));
