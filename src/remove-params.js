'use strict';

const emptyParameter = [0, 0];

module.exports = (config) => {
    const shouldAddNoteNumberToComment = config['add-note-number'];

    return (data) => {
        const result = JSON.parse(JSON.stringify(data));

        result.tracks.forEach(track => {
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
                }
            });

            track.parameters = {interval, pitchDelta, vibratoEnv, loudness, tension, breathiness, voicing, gender};
        });

        return result;
    }
};
