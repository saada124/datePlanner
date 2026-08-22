class Win95SoundPlayer {
  private isMuted: boolean = false;

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private play(src: string, volume = 1) {
    if (this.isMuted) return;
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      void audio.play();
    } catch {
      // Audio not ready
    }
  }

  // ============================================================
  // AUTHENTIC WINDOWS 95 SOUND SCHEME (original WAV samples)
  // ============================================================

  // ding.wav — single warning bell (confirmations / OK clicks)
  public playChime() {
    this.play('/audio/ding.wav');
  }

  // chord.wav at low volume — soft tick for navigation clicks
  public playPageTurn() {
    this.play('/audio/chord.wav', 0.35);
  }

  // chord.wav — soft double-boop warning (errors / escaping button)
  public playFlutter() {
    this.play('/audio/chord.wav');
  }

  // chimes.wav — bright ascending bell arpeggio (step complete)
  public playChapterComplete() {
    this.play('/audio/chimes.wav');
  }

  // tada.wav — rising two-note fanfare (success / celebration)
  public playCelebrationTune() {
    this.play('/audio/tada.wav');
  }

  // The Microsoft Sound — Brian Eno's rising chord swell (boot)
  public playStartup() {
    this.play('/audio/startup.wav');
  }

  // Critical error — Windows 95 played DING.WAV for critical errors
  public playCriticalStop() {
    this.play('/audio/chord.wav');
  }
}

export const sound = new Win95SoundPlayer();