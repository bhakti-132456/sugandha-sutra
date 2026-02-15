/**
 * Sugandha Sutra — Audio Engine
 * Tone.js-based generative audio for sacred frequencies.
 * Audio ONLY starts on explicit user gesture (click).
 */

let synth = null;
let tremolo = null;
let analyser = null;
let isPlaying = false;

/**
 * Initializes and starts the sacred tone or audio file.
 * @param {number} frequency - Solfeggio frequency in Hz (default 528)
 * @param {string} url - Optional URL to a WAV/MP3 file to play instead of a pure tone
 * @param {number} tremoloRate - Tremolo rate in Hz (default 4, mimics breathing)
 * @returns {Promise<{getAmplitude: () => number, stop: () => void}>}
 */
export async function startSacredTone({ frequency = 528, url = null, tremoloRate = 4 } = {}) {
    if (isPlaying) return { getAmplitude, stop: stopSacredTone };

    // Dynamically import Tone.js for code splitting
    const Tone = await import("tone");

    // Ensure audio context is started (requires user gesture)
    await Tone.start();

    // Create tremolo effect — mimics breathing rhythm
    tremolo = new Tone.Tremolo({
        frequency: tremoloRate,
        depth: 0.6,
        spread: 0,
        type: "sine",
    }).toDestination();
    tremolo.start();

    // Create analyser for amplitude reading (sync with shader)
    analyser = new Tone.Analyser("waveform", 256);
    tremolo.connect(analyser);

    if (url) {
        // Play the recorded soundscape
        synth = new Tone.Player({
            url: url,
            loop: true,
            autostart: true,
            volume: -10,
        }).connect(tremolo);
    } else {
        // Create sine oscillator at sacred frequency
        synth = new Tone.Oscillator({
            frequency: frequency,
            type: "sine",
            volume: -18, // Gentle volume
        }).connect(tremolo);
        synth.start();
        synth.volume.rampTo(-12, 0.5);
    }

    isPlaying = true;

    return {
        getAmplitude,
        stop: stopSacredTone,
    };
}

/**
 * Returns the current amplitude (0–1) for shader sync.
 */
export function getAmplitude() {
    if (!analyser) return 0.5;
    const waveform = analyser.getValue();
    // RMS amplitude calculation
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
        sum += waveform[i] * waveform[i];
    }
    return Math.sqrt(sum / waveform.length);
}

/**
 * Stops and cleans up audio resources.
 */
export async function stopSacredTone() {
    if (synth) {
        synth.volume.rampTo(-60, 0.5);
        setTimeout(() => {
            synth?.stop();
            synth?.dispose();
            tremolo?.dispose();
            analyser?.dispose();
            synth = null;
            tremolo = null;
            analyser = null;
            isPlaying = false;
        }, 600);
    }
}

/**
 * Solfeggio frequency map for different SKUs / ritual types.
 */
export const SOLFEGGIO_MAP = {
    "champa-jyoti": { frequency: 528, name: "Love Frequency", note: "Mi" },
    "nag-champa-classic": { frequency: 396, name: "Liberation", note: "Ut" },
    "sacred-sandalwood": { frequency: 639, name: "Connection", note: "Fa" },
    "temple-rose": { frequency: 741, name: "Awakening", note: "Sol" },
    "vetiver-earth": { frequency: 432, name: "Cosmic Harmony", note: "La" },
    default: { frequency: 528, name: "Love Frequency", note: "Mi" },
};
