// Unified Web Audio API Synthesizer for the Watercolor Atelier Date Planner

class WatercolorAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private melodyInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('dateAppMuted') === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
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
    if (this.isMuted) {
      this.stopAcousticMelody();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('dateAppMuted', String(this.isMuted));
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAcousticMelody();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('dateAppMuted', String(this.isMuted));
    }
  }

  // Pure water droplet dipping into a water jar (pleasant bubbly pop)
  public playWaterDrip(pitchMultiplier = 1) {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 820 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  // Soft wet watercolor brush stroke sweep (filtered pink/white noise)
  public playBrushStroke(intensity = 1) {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.2; // 200ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft pink-ish noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08 * intensity, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback
    }
  }

  // Harmonic chord chime for palette color mixing
  public playColorChord(colorIndex: number = 0) {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const pentatonicScales = [
        [523.25, 659.25, 783.99], // C major (Rose)
        [587.33, 739.99, 880.00], // D major (Sky Blue)
        [659.25, 830.61, 987.77], // E major (Sunset Amber)
        [698.46, 880.00, 1046.50],// F major (Emerald Meadow)
        [783.99, 987.77, 1174.66] // G major (Lavender Dream)
      ];

      const scale = pentatonicScales[Math.abs(colorIndex) % pentatonicScales.length];
      const now = ctx.currentTime;

      scale.forEach((freq, i) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.07, now + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.42);
      });
    } catch {
      // Audio fallback
    }
  }

  // Pop sound when stamping stickers or splashing paint
  public playSplatterPop() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  // Soft page flip sound
  public playPageTurn() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  // Wind flutter sound for escaping button
  public playFlutter() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(650, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.16);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  // Gentle romantic chime
  public playChime() {
    this.playColorChord(0);
  }

  // Celebration fanfare on finalizing date
  public playFanfare() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 659.25, t: 0.12, d: 0.15 },
        { f: 783.99, t: 0.24, d: 0.18 },
        { f: 1046.50, t: 0.38, d: 0.5 },
        { f: 1318.51, t: 0.55, d: 0.7 }
      ];

      notes.forEach(n => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.09, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // Audio fallback
    }
  }

  public playChapterComplete() {
    this.playFanfare();
  }

  public playCelebrationTune() {
    this.playFanfare();
  }

  // Play soothing acoustic watercolor music loop fallback
  public playAcousticMelody() {
    if (this.isMuted) return;
    this.stopAcousticMelody();
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatonic warmth
      let step = 0;

      const playNote = () => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const freq = scale[step % scale.length];
        step = (step + 1) % scale.length;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      };

      playNote();
      this.melodyInterval = window.setInterval(playNote, 600);
    } catch {
      // Audio fallback
    }
  }

  public stopAcousticMelody() {
    if (this.melodyInterval !== null) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
  }
}

export const watercolorAudio = new WatercolorAudioEngine();
