'use strict';

const PER_NOTE_PARAMS = new Set([
    "onset", "duration", "lyric", "comment", "pitch", "sublib", "tF0Offset", "tF0Left", "tF0Right", "dF0Left",
    "dF0Right", "tF0VbrStart", "tF0VbrLeft", "tF0VbrRight", "dF0Vbr", "pF0Vbr", "fF0Vbr", "dF0Jitter",
    "tNoteOffset", "tSylOnset", "tSylCoda", "wSylNucleus"
]);

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
                if (PER_NOTE_PARAMS.has(param)) {
                    result.tracks[trackNum].notes.forEach((note) => note[param] = value);
                } else {
                    result.tracks[trackNum].parameters[param] = [0, value, numValues, 0];
                }
            });
        });
        return result;
    }
};
