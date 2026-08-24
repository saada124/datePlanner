export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  genre: string;
}

class ProceduralRomanticSynth {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.45;
  private currentTrackId: string = 'paris';
  private step: number = 0;

  constructor() {
    // Lazy init on user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Play a soft acoustic piano / guitar note
  private playNote(freq: number, startTime: number, duration: number, type: 'piano' | 'accordion' | 'lofi' | 'guitar' = 'piano', velocity: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;

    if (type === 'accordion') {
      // Dual detuned saw/triangle for musette accordion warmth
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.004, startTime); // Subtle tremolo beating

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.08 * velocity, startTime + 0.05);
      gain.gain.setValueAtTime(0.08 * velocity, startTime + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);
    } else if (type === 'lofi') {
      // Warm mellow Rhodes with lowpass
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.14 * velocity, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } else {
      // Romantic Solo Piano / Acoustic Guitar
      const osc = this.ctx.createOscillator();
      const harm = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      harm.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      harm.frequency.setValueAtTime(freq * 2, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.16 * velocity, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      harm.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      harm.start(startTime);
      osc.stop(startTime + duration + 0.05);
      harm.stop(startTime + duration + 0.05);
    }
  }

  // Romantic Note frequencies in Hz
  private readonly NOTE = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, C6: 1046.50
  };

  public start(trackId: string) {
    this.initCtx();
    this.currentTrackId = trackId;
    this.isRunning = true;
    this.step = 0;
    this.tick();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private tick = () => {
    if (!this.isRunning || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.currentTrackId === 'paris') {
      // 🥐 Parisian Accordion Café Waltz (3/4 time, 140 BPM)
      const bar = Math.floor(this.step / 3) % 8;
      const beat = this.step % 3; // 0 (bass), 1 (chord), 2 (chord)

      const waltzChords = [
        { bass: this.NOTE.A3, chord: [this.NOTE.C4, this.NOTE.E4, this.NOTE.A4], melody: this.NOTE.E5 },
        { bass: this.NOTE.A3, chord: [this.NOTE.C4, this.NOTE.E4, this.NOTE.A4], melody: this.NOTE.C5 },
        { bass: this.NOTE.D3, chord: [this.NOTE.D4, this.NOTE.F4, this.NOTE.A4], melody: this.NOTE.F5 },
        { bass: this.NOTE.D3, chord: [this.NOTE.D4, this.NOTE.F4, this.NOTE.A4], melody: this.NOTE.D5 },
        { bass: this.NOTE.E3, chord: [this.NOTE.E4, this.NOTE.G4, this.NOTE.B4], melody: this.NOTE.B4 },
        { bass: this.NOTE.E3, chord: [this.NOTE.E4, this.NOTE.G4, this.NOTE.B4], melody: this.NOTE.G4 },
        { bass: this.NOTE.A3, chord: [this.NOTE.C4, this.NOTE.E4, this.NOTE.A4], melody: this.NOTE.A4 },
        { bass: this.NOTE.A3, chord: [this.NOTE.C4, this.NOTE.E4, this.NOTE.A4], melody: this.NOTE.C5 }
      ];

      const current = waltzChords[bar];
      if (beat === 0) {
        // Bass note
        this.playNote(current.bass, now, 0.4, 'guitar', 0.6);
        // Accordion melody note
        this.playNote(current.melody, now, 0.65, 'accordion', 0.5);
      } else {
        // Waltz rhythm chord strum
        current.chord.forEach((n, i) => {
          this.playNote(n, now + i * 0.015, 0.3, 'accordion', 0.35);
        });
      }

      this.step++;
      this.timerId = window.setTimeout(this.tick, 420);

    } else if (this.currentTrackId === 'lofi') {
      // 🌧️ Midnight Lofi (Warm 7th chords, slow 75 BPM)
      const chords = [
        [this.NOTE.F3, this.NOTE.A3, this.NOTE.C4, this.NOTE.E4], // Fmaj7
        [this.NOTE.E3, this.NOTE.G3, this.NOTE.B3, this.NOTE.D4], // Em7
        [this.NOTE.D3, this.NOTE.F3, this.NOTE.A3, this.NOTE.C4], // Dm7
        [this.NOTE.C3, this.NOTE.E3, this.NOTE.G3, this.NOTE.B3]  // Cmaj7
      ];
      const melodies = [this.NOTE.E5, this.NOTE.D5, this.NOTE.C5, this.NOTE.B4, this.NOTE.A4, this.NOTE.G4, this.NOTE.C5];

      const chordIdx = Math.floor(this.step / 4) % chords.length;
      const currentChord = chords[chordIdx];

      if (this.step % 4 === 0) {
        // Lush Rhodes chord strum
        currentChord.forEach((n, i) => {
          this.playNote(n, now + i * 0.03, 1.8, 'lofi', 0.5);
        });
      }
      // Gentle lofi top melody
      if (this.step % 2 === 0) {
        const melNote = melodies[this.step % melodies.length];
        this.playNote(melNote, now + 0.1, 0.8, 'lofi', 0.35);
      }

      this.step++;
      this.timerId = window.setTimeout(this.tick, 500);

    } else if (this.currentTrackId === 'guitar') {
      // 🎸 Sunset Acoustic Guitar Romance
      const patterns = [
        [this.NOTE.G3, this.NOTE.D4, this.NOTE.G4, this.NOTE.B4],
        [this.NOTE.E3, this.NOTE.B3, this.NOTE.E4, this.NOTE.G4],
        [this.NOTE.C3, this.NOTE.G3, this.NOTE.C4, this.NOTE.E4],
        [this.NOTE.D3, this.NOTE.A3, this.NOTE.D4, this.NOTE.F4]
      ];
      const chordIdx = Math.floor(this.step / 4) % patterns.length;
      const noteIdx = this.step % 4;
      const n = patterns[chordIdx][noteIdx];

      this.playNote(n, now, 0.7, 'guitar', noteIdx === 0 ? 0.6 : 0.4);

      this.step++;
      this.timerId = window.setTimeout(this.tick, 320);

    } else if (this.currentTrackId === 'bossa') {
      // 🎷 Bossa Nova Romance (Syncopated rhythm)
      const bossaChords = [
        [this.NOTE.D3, this.NOTE.F4, this.NOTE.A4, this.NOTE.C5],
        [this.NOTE.G3, this.NOTE.F4, this.NOTE.B4, this.NOTE.D5],
        [this.NOTE.C3, this.NOTE.E4, this.NOTE.G4, this.NOTE.B4],
        [this.NOTE.A3, this.NOTE.G4, this.NOTE.Db4, this.NOTE.E4]
      ];
      const chordIdx = Math.floor(this.step / 4) % bossaChords.length;
      const current = bossaChords[chordIdx];

      if (this.step % 4 === 0 || this.step % 4 === 2) {
        this.playNote(current[0], now, 0.4, 'guitar', 0.6); // Bass
      }
      if (this.step % 4 === 1 || this.step % 4 === 2 || this.step % 4 === 3) {
        current.slice(1).forEach((n, i) => {
          this.playNote(n, now + i * 0.01, 0.3, 'piano', 0.4);
        });
      }

      this.step++;
      this.timerId = window.setTimeout(this.tick, 360);

    } else {
      // 🎹 Candlelight Nocturne (Flowing piano arpeggios in E-flat / C minor)
      const nocturneBars = [
        [this.NOTE.Eb4, this.NOTE.G4, this.NOTE.Bb4, this.NOTE.Eb5, this.NOTE.G5, this.NOTE.Eb5],
        [this.NOTE.C4, this.NOTE.Eb4, this.NOTE.G4, this.NOTE.C5, this.NOTE.Eb5, this.NOTE.C5],
        [this.NOTE.Ab3, this.NOTE.C4, this.NOTE.Eb4, this.NOTE.Ab4, this.NOTE.C5, this.NOTE.Ab4],
        [this.NOTE.Bb3, this.NOTE.D4, this.NOTE.F4, this.NOTE.Bb4, this.NOTE.D5, this.NOTE.Bb4]
      ];
      const barIdx = Math.floor(this.step / 6) % nocturneBars.length;
      const noteIdx = this.step % 6;
      const n = nocturneBars[barIdx][noteIdx];

      this.playNote(n, now, 0.9, 'piano', noteIdx === 0 ? 0.6 : 0.4);

      this.step++;
      this.timerId = window.setTimeout(this.tick, 280);
    }
  };
}

class BackgroundMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private synth: ProceduralRomanticSynth = new ProceduralRomanticSynth();
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private volume: number = 0.45;
  private isUsingSynth: boolean = false;
  private tracks: AudioTrack[] = [
    {
      id: "chandelier",
      title: "Chandelier ❤️",
      artist: "Talel & Nour",
      src: "/audio/Chandelier.mp3",
      genre: "Our Song <3 💖"
    },
    {
      id: "paris",
      title: "Brahms Café Bistro Waltz",
      artist: "Parisian Acoustic Strings",
      src: "/audio/parisian-cafe.mp3",
      genre: "Café Jazz 🥐"
    },
    {
      id: "piano",
      title: "Pachelbel Canon in D",
      artist: "Intimate Romance Solo Piano",
      src: "/audio/candlelight-piano.mp3",
      genre: "Romantic Piano 🎹"
    },
    {
      id: "strings",
      title: "Bach Air on the G String",
      artist: "Warm Chamber Strings",
      src: "/audio/sunset-serenade.mp3",
      genre: "Sunset Strings 🎻"
    },
    {
      id: "vienna",
      title: "The Blue Danube Romance",
      artist: "Johann Strauss II · Vienna Symphony",
      src: "/audio/spring-waltz.mp3",
      genre: "Vienna Waltz ✨"
    },
    {
      id: "midnight",
      title: "Vivaldi Springtime Serenade",
      artist: "Midnight Romance Ensemble",
      src: "/audio/midnight-lofi.mp3",
      genre: "Midnight Serenade 🌙"
    }
  ];
  private listeners: Set<(state: { isPlaying: boolean; currentTrack: AudioTrack; volume: number }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = this.volume;

      // When HTML5 audio finishes or errors, smoothly fallback to procedural acoustic synth
      this.audio.addEventListener('error', () => {
        if (this.isPlaying) {
          this.switchToSynth();
        }
      });

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isUsingSynth = false;
        this.synth.stop();
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        if (!this.isUsingSynth) {
          this.isPlaying = false;
          this.notify();
        }
      });
    }
  }

  public setCustomTracks(customTracks: AudioTrack[]) {
    if (customTracks && customTracks.length > 0) {
      this.tracks = customTracks;
      this.currentTrackIndex = 0;
      this.notify();
    }
  }

  private switchToSynth() {
    this.isUsingSynth = true;
    this.isPlaying = true;
    const track = this.tracks[this.currentTrackIndex] || this.tracks[0];
    this.synth.setVolume(this.volume);
    this.synth.start(track.id);
    this.notify();
  }

  public async play(): Promise<boolean> {
    const track = this.tracks[this.currentTrackIndex] || this.tracks[0];
    this.isPlaying = true;

    if (this.audio && track.src) {
      try {
        this.audio.src = track.src;
        this.audio.volume = this.volume;
        await this.audio.play();
        this.isUsingSynth = false;
        this.synth.stop();
        this.notify();
        return true;
      } catch {
        // If file fails or not found, play immediate acoustic synth!
        this.switchToSynth();
        return true;
      }
    } else {
      this.switchToSynth();
      return true;
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.synth.stop();
    this.isPlaying = false;
    this.isUsingSynth = false;
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public selectTrack(index: number) {
    this.currentTrackIndex = (index + this.tracks.length) % this.tracks.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.synth.setVolume(this.volume);
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.tracks[this.currentTrackIndex] || this.tracks[0],
      currentTrackIndex: this.currentTrackIndex,
      tracks: this.tracks,
      volume: this.volume
    };
  }

  public subscribe(listener: (state: { isPlaying: boolean; currentTrack: AudioTrack; volume: number }) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }
}

export const bgMusic = new BackgroundMusicPlayer();
