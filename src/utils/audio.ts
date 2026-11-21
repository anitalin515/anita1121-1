class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmTimer: number | null = null;
  private stepIndex = 0;

  // Relaxing Japanese music-box pentatonic loop (frequencies in Hz)
  private readonly melodyNotes = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    659.25, // E5
    880.0,  // A5
    783.99, // G5
    659.25, // E5
    587.33, // D5
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    659.25, // E5
    587.33, // D5
    523.25, // C5
    0,      // Rest
  ];

  private readonly bassNotes = [
    261.63, // C4
    0,
    196.0,  // G3
    0,
    220.0,  // A3
    0,
    196.0,  // G3
    0,
    174.61, // F3
    0,
    196.0,  // G3
    0,
    261.63, // C4
    0,
    196.0,  // G3
    0,
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Ignore autoplay restrictions until user interaction
      });
    }
    return this.ctx;
  }

  public unlock() {
    this.ensureContext();
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.stopBgm();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0,
    slideToFreq?: number
  ) {
    if (!this.sfxEnabled && volume > 0.03) return;
    const ctx = this.ensureContext();
    if (!ctx || freq <= 0) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playBgmNote(freq: number, duration: number, volume: number, type: OscillatorType) {
    const ctx = this.ensureContext();
    if (!ctx || freq <= 0 || !this.bgmEnabled) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public startBgm() {
    if (!this.bgmEnabled) return;
    this.stopBgm();
    this.ensureContext();

    this.bgmTimer = window.setInterval(() => {
      if (!this.bgmEnabled) return;
      const idx = this.stepIndex % this.melodyNotes.length;
      const melody = this.melodyNotes[idx];
      const bass = this.bassNotes[idx];

      if (melody > 0) {
        this.playBgmNote(melody, 0.36, 0.028, 'sine');
      }
      if (bass > 0) {
        this.playBgmNote(bass, 0.55, 0.02, 'triangle');
      }
      this.stepIndex++;
    }, 420);
  }

  public stopBgm() {
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public playMove() {
    if (!this.sfxEnabled) return;
    this.playTone(480, 0.055, 'triangle', 0.05, 0, 560);
  }

  public playDrop() {
    if (!this.sfxEnabled) return;
    this.playTone(540, 0.14, 'sine', 0.06, 0, 290);
  }

  public playLand() {
    if (!this.sfxEnabled) return;
    this.playTone(220, 0.09, 'triangle', 0.07, 0, 150);
  }

  public playMatch(comboLevel: number, isWild = false) {
    if (!this.sfxEnabled) return;
    const basePitch = 523.25 * Math.pow(1.08, Math.min(comboLevel - 1, 6));
    this.playTone(basePitch, 0.16, 'sine', 0.085, 0);
    this.playTone(basePitch * 1.25, 0.18, 'sine', 0.08, 0.055);
    if (comboLevel >= 2 || isWild) {
      this.playTone(basePitch * 1.5, 0.24, 'triangle', 0.085, 0.11);
    }
    if (isWild) {
      this.playTone(basePitch * 2, 0.28, 'sine', 0.075, 0.16);
    }
  }

  public playRowPush() {
    if (!this.sfxEnabled) return;
    this.playTone(260, 0.08, 'triangle', 0.05, 0);
    this.playTone(310, 0.1, 'triangle', 0.05, 0.07);
  }

  public playGameOver() {
    if (!this.sfxEnabled) return;
    this.playTone(440, 0.22, 'sine', 0.075, 0);
    this.playTone(392, 0.22, 'sine', 0.07, 0.18);
    this.playTone(329.63, 0.35, 'triangle', 0.07, 0.36);
  }
}

export const soundEngine = new SoundEngine();
