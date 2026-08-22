class MixtapeSoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private welcomePlayed: boolean = false;
  private songAudio: HTMLAudioElement | null = null;
  private songPlaying: boolean = false;
  private static readonly SONG_SRC = '/audio/song.mp3';
  private static readonly SONG_VOLUME = 0.35;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Unlock the AudioContext (called on first user gesture)
  public unlock() {
    this.initCtx();
  }

  // True once the AudioContext is actually running (sound is audible)
  public isReady(): boolean {
    return !!this.ctx && this.ctx.state === 'running';
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.songAudio) {
      this.songAudio.volume = this.isMuted ? 0 : MixtapeSoundSynth.SONG_VOLUME;
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soft warm pluck for selections / confirms
  private pluck(freq: number, when: number, dur: number, vol: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(vol, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  // Gentle tape power-on: soft chord swell + low hum (plays on page load)
  public playWelcome() {
    if (this.isMuted) return;
    if (this.welcomePlayed) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // soft "power on" chord swell
      [164.81, 246.94, 329.63, 493.88].forEach((f, i) => {
        this.pluck(f, now + 0.08 + i * 0.1, 1.6, 0.05);
      });
      // gentle tape hum underneath
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.7);
      this.welcomePlayed = true;
    } catch {
      // Audio not ready
    }
  }

  // Warm two-note chime for selections / settings saved
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.pluck(523.25, now, 0.4, 0.09);
      this.pluck(783.99, now + 0.1, 0.45, 0.07);
    } catch {
      // Audio not ready
    }
  }

  // ---- Background song: looping mp3 player ----

  // Start the looping background song (starts on the cover page)
  public playSong() {
    if (this.songPlaying) return;
    try {
      if (!this.songAudio) {
        this.songAudio = new Audio(MixtapeSoundSynth.SONG_SRC);
        this.songAudio.loop = true;
        this.songAudio.volume = this.isMuted ? 0 : MixtapeSoundSynth.SONG_VOLUME;
      }
      const promise = this.songAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay still blocked — retried on the first user gesture
        });
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
      } catch {
        // already stopped
      }
    }
    this.songPlaying = false;
  }

  public isSongPlaying(): boolean {
    return this.songPlaying;
  }

  // Mechanical tape-transport click (short filtered noise burst + low knock)
  public playPageTurn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);

      // low mechanical knock
      this.pluck(180, now, 0.06, 0.12);
    } catch {
      // Audio not ready
    }
  }

  // Tape warble / dull clunk for errors & the escaping button
  public playFlutter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(560, now + 0.05);
      osc.frequency.linearRampToValueAtTime(300, now + 0.14);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
      this.pluck(140, now + 0.02, 0.12, 0.1);
    } catch {
      // Audio not ready
    }
  }

  // Record-start click + warm rising chord (track complete)
  public playChapterComplete() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // record click
      this.pluck(1200, now, 0.03, 0.12);
      this.pluck(500, now + 0.03, 0.06, 0.1);
      // warm rising chord C - E - G - C
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        this.pluck(f, now + 0.12 + i * 0.09, 0.5, 0.07);
      });
    } catch {
      // Audio not ready
    }
  }

  // REC pop + resolved major arpeggio (celebration)
  public playCelebrationTune() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.pluck(900, now, 0.04, 0.16);
      [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
        this.pluck(f, now + 0.15 + i * 0.11, 0.7, 0.08);
      });
    } catch {
      // Audio not ready
    }
  }

  // Gentle hum when the deck is "playing" (very quiet warm tone)
  public playDeckHum() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.02, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    } catch {
      // Audio not ready
    }
  }
}

export const sound = new MixtapeSoundSynth();