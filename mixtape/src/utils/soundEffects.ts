// ============================================================
// 🎧 THE DATE MIXTAPE — MASTER SOUND SYNTHESIZER & MULTI-TAPE ENGINE
// ============================================================

export type MoodTapeId = 'tape_sunset' | 'tape_rain' | 'tape_midnight';
export type ShellEditionId = 'titanium' | 'rose' | 'gold' | 'chalk';
export type LabelStyleId = 'rainbow' | 'grid' | 'floral';

class MixtapeSoundSynth {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private isMuted: boolean = false;
  private songAudio: HTMLAudioElement | null = null;
  private songPlaying: boolean = false;
  private activeMoodTape: MoodTapeId = 'tape_sunset';

  // Web Audio BiquadFilter nodes for Graphic EQ
  private bassFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  private isMegaBass: boolean = false;
  private static readonly SONG_SRC = '/audio/song.mp3';
  private static readonly SONG_VOLUME = 0.38;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));

        // 3-Band Graphic EQ Chain
        this.bassFilter = this.ctx.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.setValueAtTime(150, this.ctx.currentTime);
        this.bassFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.midFilter = this.ctx.createBiquadFilter();
        this.midFilter.type = 'peaking';
        this.midFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        this.midFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);
        this.midFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.trebleFilter = this.ctx.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.setValueAtTime(3500, this.ctx.currentTime);
        this.trebleFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);

        // Connect EQ Chain: Bass -> Mid -> Treble -> Compressor -> Analyser -> Destination
        this.bassFilter.connect(this.midFilter);
        this.midFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.compressor);
        this.compressor.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlock() {
    this.initCtx();
  }

  public isReady(): boolean {
    return !!this.ctx && this.ctx.state === 'running';
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.songAudio) {
      this.songAudio.volume = this.isMuted ? 0 : MixtapeSoundSynth.SONG_VOLUME;
    }
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getAudioLevel(): number {
    if (this.isMuted || !this.analyser || !this.dataArray) {
      return 0.15;
    }
    try {
      this.analyser.getByteFrequencyData(this.dataArray);
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      const avg = sum / this.dataArray.length / 255;
      const boost = this.isMegaBass ? 1.8 : 1.4;
      return Math.min(1.0, avg * boost + 0.1);
    } catch {
      return 0.15;
    }
  }

  // Set Graphic Equalizer Faders (-10dB to +10dB)
  public setEQ(bassGain: number, midGain: number, trebleGain: number) {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.bassFilter) {
      const extraBass = this.isMegaBass ? 6 : 0;
      this.bassFilter.gain.setTargetAtTime(bassGain + extraBass, now, 0.05);
    }
    if (this.midFilter) {
      this.midFilter.gain.setTargetAtTime(midGain, now, 0.05);
    }
    if (this.trebleFilter) {
      this.trebleFilter.gain.setTargetAtTime(trebleGain, now, 0.05);
    }
  }

  // Toggle Mega Bass™ / Dolby NR
  public setMegaBass(enabled: boolean) {
    this.isMegaBass = enabled;
    this.initCtx();
    if (!this.ctx || !this.bassFilter) return;
    const now = this.ctx.currentTime;
    const currentGain = this.bassFilter.gain.value;
    this.bassFilter.gain.setTargetAtTime(enabled ? currentGain + 6 : Math.max(-10, currentGain - 6), now, 0.05);
    this.playButtonClunk();
  }

  public getIsMegaBass(): boolean {
    return this.isMegaBass;
  }

  // Switch Mood Tapes (Sunset Chords / Rainy Cafe / Midnight Stargazing)
  public setMoodTape(tapeId: MoodTapeId) {
    this.activeMoodTape = tapeId;
    this.playTapeInsert();
    this.initCtx();
    if (!this.ctx) return;

    // If Rainy Cafe selected, start soft vinyl rain layer
    if (tapeId === 'tape_rain') {
      this.startRainAtmosphere();
    } else {
      this.stopRainAtmosphere();
    }
  }

  public getActiveMoodTape(): MoodTapeId {
    return this.activeMoodTape;
  }

  // Background Lo-Fi Song
  public playSong() {
    if (this.songPlaying) return;
    try {
      if (!this.songAudio) {
        this.songAudio = new Audio(MixtapeSoundSynth.SONG_SRC);
        this.songAudio.loop = true;
        this.songAudio.volume = this.isMuted ? 0 : MixtapeSoundSynth.SONG_VOLUME;

        if (this.ctx && this.bassFilter) {
          try {
            const source = this.ctx.createMediaElementSource(this.songAudio);
            source.connect(this.bassFilter);
          } catch {
            // MediaElementSource fallback
          }
        }
      }
      const promise = this.songAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
      this.songPlaying = true;
    } catch {
      // Audio not ready
    }
  }

  public stopSong() {
    if (this.songAudio) {
      try {
        this.songAudio.pause();
        this.songAudio.currentTime = 0;
      } catch {}
    }
    this.songPlaying = false;
  }

  public isSongPlaying(): boolean {
    return this.songPlaying;
  }

  // Vinyl Rain Noise Atmosphere Generator (for Tape 02: Rainy Cafe)
  private startRainAtmosphere() {
    if (!this.ctx || this.rainSource) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink noise rain filter
        lastOut = data[i];
      }

      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = buffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      if (this.bassFilter) {
        this.rainGain.connect(this.bassFilter);
      } else {
        this.rainGain.connect(this.ctx.destination);
      }

      this.rainSource.start();
    } catch {}
  }

  private stopRainAtmosphere() {
    if (this.rainSource) {
      try {
        this.rainSource.stop();
        this.rainSource.disconnect();
      } catch {}
      this.rainSource = null;
    }
  }

  // Soft warm tone pluck
  private pluck(freq: number, when: number, dur: number, vol: number) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, when);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, when);

      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(vol, when + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

      osc.connect(filter);
      filter.connect(gain);
      if (this.bassFilter) {
        gain.connect(this.bassFilter);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start(when);
      osc.stop(when + dur + 0.05);
    } catch {}
  }

  // Pitch-shifted Tape Scratching (when swirling the yellow pencil)
  public playTapeScratch(speed: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const baseFreq = 160 * Math.max(0.5, Math.min(3.0, speed));
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(2.0, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Spring-loaded EJECT Carriage Pop Sound
  public playEjectSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Heavy metal spring pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Cassette Tape Insertion Clack
  public playTapeInsert() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.playButtonClunk();
      this.pluck(440, now + 0.05, 0.2, 0.05);
    } catch {}
  }

  public playWelcome() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [196.00, 246.94, 293.66, 392.00].forEach((f, i) => {
        this.pluck(f, now + 0.06 + i * 0.08, 1.4, 0.07);
      });
    } catch {}
  }

  public playButtonClunk() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.035;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.04);
      oscGain.gain.setValueAtTime(0.22, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public playMotorWhir() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.25);
      osc.frequency.linearRampToValueAtTime(120, now + 0.55);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.58);
    } catch {}
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.pluck(587.33, now, 0.35, 0.08);
      this.pluck(880.00, now + 0.08, 0.45, 0.07);
    } catch {}
  }

  public playChapterComplete() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [392.00, 493.88, 587.33, 783.99].forEach((f, i) => {
        this.pluck(f, now + i * 0.07, 0.6, 0.08);
      });
    } catch {}
  }

  public playRecordLock() {
    if (this.isMuted) return;
    try {
      this.playButtonClunk();
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((f, i) => {
        this.pluck(f, now + 0.2 + i * 0.08, 1.2, 0.08);
      });
    } catch {}
  }

  public playPageTurn() {
    this.playButtonClunk();
  }

  public playCelebrationTune() {
    this.playRecordLock();
  }
}

export const sound = new MixtapeSoundSynth();