// src/constants/keys.js

// A0 ~ C8, 총 88키
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

export const KEYS = (() => {
  const keys = [];
  for (let octave = 0; octave <= 8; octave++) {
    for (let i = 0; i < 12; i++) {
      const note = `${NOTE_NAMES[i]}${octave}`;
      const midiNumber = octave * 12 + i + 12; // MIDI 번호 (A0=21)
      if (midiNumber < 21 || midiNumber > 108) continue; // A0~C8 범위
      keys.push({
        note,                              // "C4", "A#3" ...
        midi: midiNumber,                  // 21 ~ 108
        isBlack: note.includes('#'),       // 흑건 여부
        octave,
        playbackRate: Math.pow(2, (midiNumber - 60) / 12), // C4=1.0 기준
      });
    }
  }
  return keys.reverse(); // 위가 고음
})();

// 빠른 조회용 Map
export const KEY_MAP = new Map(KEYS.map(k => [k.note, k]));
