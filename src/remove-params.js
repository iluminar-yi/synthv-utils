'use strict';

const emptyParameter = [0, 0];

module.exports = (config) => {
    const {enabled, excludes = []} = config;
    if (!enabled) {
        console.debug('Processor disabled in config, skipping');
        return (data) => data;
    }
    excludes.forEach((exclude) => {
        exclude.tracks = new Set(exclude.tracks);
    });

    const shouldAddNoteNumberToComment = config['add-note-number'];

    return (data) => {
        const result = JSON.parse(JSON.stringify(data));

        result.tracks.forEach((track, index) => {
            const trackExcludeParamNames = excludes
                .filter((exclude) => exclude.tracks.has(index))
                .map((exclude) => exclude.param);

            track.dbDefaults = {};

            track.notes = track.notes.map((note, index) => {
                let {onset, duration, lyric, comment, pitch} = note;
                if (shouldAddNoteNumberToComment) {
                    comment = `${index + 1} ${comment}`;
                }

                return {onset, duration, lyric, comment, pitch};
            });

            const {interval} = track.parameters;
            const {pitchDelta, vibratoEnv, loudness, tension, breathiness, voicing, gender} = new Proxy({}, {
                get() {
                    return emptyParameter
                },
            });

            const newParams = {interval, pitchDelta, vibratoEnv, loudness, tension, breathiness, voicing, gender};
            trackExcludeParamNames.forEach((trackExcludeParamName) => newParams[trackExcludeParamName] = track.parameters[trackExcludeParamName]);
            track.parameters = newParams;
        });

        return result;
    }
};
