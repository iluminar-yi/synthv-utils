'use strict';

const NUM_DECIMAL_PLACES = 4;

const PER_NOTE_PARAMS = [
    'onset',
    'duration',
    'lyric',
    'comment',
    'pitch',
    'sublib',
    'tF0Offset',
    'tF0Left',
    'tF0Right',
    'dF0Left',
    'dF0Right',
    'tF0VbrStart',
    'tF0VbrLeft',
    'tF0VbrRight',
    'dF0Vbr',
    'pF0Vbr',
    'fF0Vbr',
    'dF0Jitter',
    'tNoteOffset',
    'tSylOnset',
    'tSylCoda',
    'wSylNucleus',
];

module.exports = {
    numDecimalPlaces: NUM_DECIMAL_PLACES,
    perNoteParams: new Set(PER_NOTE_PARAMS),
};
