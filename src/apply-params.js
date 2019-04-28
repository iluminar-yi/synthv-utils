'use strict';

module.exports = (config) => {
    const {enabled, tracks} = config;
    if (!enabled) {
        console.debug('Processor disabled in config, skipping');
        return (data) => data;
    }

    return (data) => {
        if (data.tracks.length < tracks.length) {
            throw new Error(`Config has more tracks than input file: ${tracks.length} vs ${data.tracks.length}`);
        }

        const result = JSON.parse(JSON.stringify(data));

        tracks.forEach((trackDef) => {
            const trackNum = trackDef['track'];
            const paramValues = trackDef['values'];
            const numValues = result.tracks[trackNum].parameters.interval;
            paramValues.forEach(({param, value}) => {
                const paramArr = result.tracks[trackNum].parameters[param] = [];
                for (let i = 0; i < numValues; i++) {
                    paramArr.push(i);
                    paramArr.push(value);
                }
            });
        });
        return result;
    }
};