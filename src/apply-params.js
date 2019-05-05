'use strict';

const {numDecimalPlaces, perNoteParams} = require('./facts');
const DETECTION_THRESHOLD = 100;

/**
 * Apply value to a parameter that is attached to a note
 * @param notes {number[]} The original data of all notes
 * @param param {string} Name of the parameter to be applied
 * @param value {number | string} Value of the parameter to be applied
 * @param method {string} Name of the method to be use when applying, currently not implemented
 * @returns {number[]} Transformed note values after applying the given value
 */
const applyPerNoteParam = (notes, param, value, method) => {
    return notes.map((note) => {
        note[param] = value;
        return note;
    });
};

/**
 * Apply value to a parameter in the "parameters" field
 *
 * @param oldValues {number[]} The original data of this parameter
 * @param newValue {number} New value to be applied
 * @param lastIndex {number} Last index in this project. Normally the "interval" field
 * @param method {string} Name of the method to be use when applying
 * @returns {number[]} Transformed values after applying the given value
 */
const applyParam = (oldValues, newValue, lastIndex, method) => {
    const oldValue = inferOldValue(oldValues);
    switch (method) {
        case 'shift':
            const difference = oldValue - newValue;
            return oldValues.map((oldVal, index, oldVals) => {
                if (index % 2 === 0) {
                    // This is index value
                    return oldVal;
                } else if (index === oldVals.length - 1) {
                    // Always make last value 0
                    return 0;
                } else {
                    return shortenNumericValue(oldVal - difference);
                }
            });
        case 'overwrite':
            return [0, newValue, lastIndex, 0];
        case 'unmodified-only':
            const indexValuePairs = toIndexValuePairs(oldValues);
            indexValuePairs.forEach((indexValue, i, arr) => {
                if (i === arr.length - 1) {
                    indexValue[1] = 0;
                } else {
                    const nextIndexValue = arr[i + 1];
                    if (nextIndexValue[0] - indexValue[0] > DETECTION_THRESHOLD) {
                        // This value is dangling, probably a reset value
                        indexValue[1] = newValue;
                    }
                }
            });
            return toFlatValues(indexValuePairs);
        default:
            throw new Error(`Unknown method: ${method}`);
    }
};

const inferOldValue = (oldValues) => {
    return oldValues[1];
};

/**
 * Convert flat index value array to structured time value pairs
 * @param flatValues {number[]} Flat inde value array of format [index1, value1, index2, value2, ..., indexN, valueN]
 * @returns {[number, number][]} Index value pairs of format [[index, value1], [index2, value2], ..., [indexN, valueN]]
 */
const toIndexValuePairs = (flatValues) => {
    const result = [];
    for (let i = 0; i < flatValues.length; i += 2) {
        result.push([flatValues[i], flatValues[i + 1]]);
    }
    return result;
};

/**
 * Convert structured index value pairs to flat time value array
 * @param indexValuePairs {[number, number][]} Index value pairs of format [[index, value1], [index2, value2], ..., [indexN, valueN]]
 * @returns {number[]} Flat inde value array of format [index1, value1, index2, value2, ..., indexN, valueN]
 */
const toFlatValues = (indexValuePairs) => {
    const result = [];
    indexValuePairs.forEach((indexValuePair) => {
        result.push(indexValuePair[0]);
        result.push(indexValuePair[1]);
    });
    return result;
};

const shortenNumericValue = (value) => {
    return parseFloat(value.toFixed(numDecimalPlaces));
};

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
            const {track: trackNum, values: paramValues} = trackDef;
            const lastIndex = result.tracks[trackNum].parameters.interval;
            paramValues.forEach((paramConfig) => {
                const {enabled, param, value, method = 'shift'} = paramConfig;
                if (!enabled) {
                    console.debug(`Skip applying ${param} of ${value} because it is disabled`);
                    return;
                } else {
                    console.debug(`Will apply ${param} of ${value} using ${method} method`);
                }
                let valueToUse;
                if (value instanceof Number) {
                    valueToUse = shortenNumericValue(value);
                    console.debug(`Value of ${value} is shortened to ${numDecimalPlaces} decimal places, yield a value of ${valueToUse}`);
                } else {
                    valueToUse = value;
                }
                if (perNoteParams.has(param)) {
                    result.tracks[trackNum].notes = applyPerNoteParam(result.tracks[trackNum].notes, param, valueToUse, method);
                } else {
                    result.tracks[trackNum].parameters[param] = applyParam(result.tracks[trackNum].parameters[param], valueToUse, lastIndex, method)
                }
            });
        });
        return result;
    }
};
