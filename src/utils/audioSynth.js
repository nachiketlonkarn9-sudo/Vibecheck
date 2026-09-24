/**
 * Web Audio API Disco Synth: "Ramba Ho" (from Dhurandhar / Armaan)
 * Generates the iconic 130 BPM Bollywood disco-funk groove with punchy disco kicks,
 * driving octave bassline, brass disco stabs, and an iconic brass hook.
 */

class RambaHoSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.bpm = 130;
    this.timerId = null;
    this.currentStep = 0;
    this.gainNode = null;
    this.volume = 0.35;
    this.onBeatCallback = null;
    this.songTitle = "Ramba Ho";
    this.artist = "Usha Uthup";
    this.movie = "Dhurandhar";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.ctx.destination);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // 1. Disco Kick Drum
  playKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.30);
    
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.30);
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.start(time);
    osc.stop(time + 0.30);
  }

  // 2. Crisp Disco Open/Closed Hi-hats
  playHiHat(time, open = false) {
    if (!this.ctx) return;
    const dur = open ? 0.15 : 0.04;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = open ? 6000 : 9000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.28 : 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    whiteNoise.start(time);
  }

  // 3. Funky Disco Octave Bassline
  playDiscoBass(time, freq) {
    if (!this.ctx || freq <= 0) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, time);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.15);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + 0.18);
  }

  // 4. Disco Brass / Synth Hook ("Ram-ba Ho Ho Ho...")
  playBrassHook(time, freq) {
    if (!this.ctx || freq <= 0) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Detuned sawtooth brass
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 1.005, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.Q.value = 1.8;

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.24);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.24);
    osc2.stop(time + 0.24);
  }

  start(onBeat) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.isPlaying = true;
    this.onBeatCallback = onBeat;
    this.currentStep = 0;

    const stepInterval = (60 / this.bpm) / 4; // 16th note
    let nextNoteTime = this.ctx.currentTime;

    // Disco Funk Octave Bassline pattern in D minor (32 steps loop)
    const bassline = [
      // D minor groove: low-high-low-high
      73.42, 146.83, 73.42, 146.83, 73.42, 146.83, 73.42, 146.83,
      // F to G
      87.31, 174.61, 87.31, 174.61, 98.0, 196.0, 98.0, 196.0,
      // D minor return
      73.42, 146.83, 73.42, 146.83, 73.42, 146.83, 73.42, 146.83,
      // C to A
      65.41, 130.81, 65.41, 130.81, 110.0, 220.0, 110.0, 220.0
    ];

    // "Ramba Ho Ho Ho, Samba Ho Ho Ho" Melodic Hook:
    const melodyLead = [
      // "Ram - ba - Ho" -> "Ho - Ho - Ho"
      293.66, 0, 349.23, 0, 392.00, 0, 0, 0,
      392.00, 0, 349.23, 0, 293.66, 0, 0, 0,
      // "Sam - ba - Ho" -> "Ho - Ho - Ho"
      293.66, 0, 349.23, 0, 392.00, 0, 0, 0,
      440.00, 0, 392.00, 0, 349.23, 0, 293.66, 0
    ];

    const schedule = () => {
      if (!this.isPlaying) return;

      while (nextNoteTime < this.ctx.currentTime + 0.1) {
        const step = this.currentStep % 32;
        const time = nextNoteTime;

        // 4-on-the-floor disco kick on steps 0, 4, 8, 12, 16, 20, 24, 28
        if (step % 4 === 0) {
          this.playKick(time);
          if (this.onBeatCallback) {
            setTimeout(() => this.onBeatCallback && this.onBeatCallback(step), (time - this.ctx.currentTime) * 1000);
          }
        }

        // Disco Hi-hat: Open on offbeats 2, 6, 10, 14..., closed on 1, 3, 5, 7...
        if (step % 4 === 2) {
          this.playHiHat(time, true);
        } else if (step % 2 === 1) {
          this.playHiHat(time, false);
        }

        // Funky Bassline
        const bassNote = bassline[step];
        if (bassNote) {
          this.playDiscoBass(time, bassNote);
        }

        // Iconic "Ramba Ho" Brass Hook
        const leadNote = melodyLead[step];
        if (leadNote) {
          this.playBrassHook(time, leadNote);
        }

        this.currentStep++;
        nextNoteTime += stepInterval;
      }

      this.timerId = setTimeout(schedule, 25);
    };

    schedule();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggle(onBeat) {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(onBeat);
      return true;
    }
  }
}

export const clubSynth = new RambaHoSynth();
