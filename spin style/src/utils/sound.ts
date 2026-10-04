/**
 * High-Realism Procedural Web Audio API sound synthesizer for arcade slot machine.
 * 100% self-contained with zero external assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('spin_date_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('spin_date_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Authentic mechanical ratchet peg tick
   */
  public playTick(pitchMultiplier = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const startTime = this.ctx.currentTime;
      const baseFreq = 850 * pitchMultiplier;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.025);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(500, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.025);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Heavy mechanical ratchet stop clunk when a slot reel brakes into place
   */
  public playReelStop(reelIndex = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime;

      // 1. Low frequency metallic thud
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      const pitch = 160 + reelIndex * 40;

      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(pitch, startTime);
      oscLow.frequency.exponentialRampToValueAtTime(45, startTime + 0.12);

      gainLow.gain.setValueAtTime(0.35, startTime);
      gainLow.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      oscLow.connect(gainLow);
      gainLow.connect(this.ctx.destination);

      oscLow.start(startTime);
      oscLow.stop(startTime + 0.12);

      // 2. High frequency metal click / brake claw latch
      const oscHigh = this.ctx.createOscillator();
      const gainHigh = this.ctx.createGain();

      oscHigh.type = 'sawtooth';
      oscHigh.frequency.setValueAtTime(1200 + reelIndex * 150, startTime);
      oscHigh.frequency.exponentialRampToValueAtTime(300, startTime + 0.04);

      gainHigh.gain.setValueAtTime(0.15, startTime);
      gainHigh.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

      oscHigh.connect(gainHigh);
      gainHigh.connect(this.ctx.destination);

      oscHigh.start(startTime);
      oscHigh.stop(startTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Slot machine lever pull mechanical release
   */
  public playLeverPull() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, startTime);
      osc.frequency.linearRampToValueAtTime(350, startTime + 0.14);
      osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.25);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Stamp thud on ticket confirm
   */
  public playStampThud() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, startTime);
      osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.15);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Soft bouncy pop on chip/button selection
   */
  public playPop(isSelect = true) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;
      const startFreq = isSelect ? 350 : 500;
      const endFreq = isSelect ? 700 : 250;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.07);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.07);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Arcade button press sound
   */
  public playArcadePress() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(220, startTime);
      osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.08);

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Joyful victory fanfare & jackpot chime
   */
  public playWinFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.11, dur: 0.12 }, // E5
        { freq: 783.99, time: 0.22, dur: 0.14 }, // G5
        { freq: 1046.50, time: 0.35, dur: 0.45 }, // C6
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = this.ctx.currentTime + time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Metallic coin scratch sound for scratch-off cards
   */
  public playScratch() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 600;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(startTime);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Wax seal crackle / envelope open sound
   */
  public playWaxSealCrack() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, startTime);
      osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.12);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Present pop / unboxing sparkle sound
   */
  public playPresentOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [400, 600, 800, 1200];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundEngine();
