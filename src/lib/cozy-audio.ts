// --- Audio Engine (Procedural Sound Design) ---
export class CozyAudioEngine {
  ctx: AudioContext | null = null;
  lofiInterval: any = null;
  isPlayingLofi = false;
  nodes: {
    bgmGain?: GainNode;
    sfxGain?: GainNode;
    masterGain?: GainNode;
    rainNode?: AudioWorkletNode | ScriptProcessorNode;
  } = {};

  // Volume levels (0 - 1)
  masterVol = 0.5;
  bgmVol = 0.4;
  sfxVol = 0.6;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();

      // Setup gains
      this.nodes.masterGain = this.ctx.createGain();
      this.nodes.masterGain.gain.setValueAtTime(
        this.masterVol,
        this.ctx.currentTime,
      );
      this.nodes.masterGain.connect(this.ctx.destination);

      this.nodes.bgmGain = this.ctx.createGain();
      this.nodes.bgmGain.gain.setValueAtTime(this.bgmVol, this.ctx.currentTime);
      this.nodes.bgmGain.connect(this.nodes.masterGain);

      this.nodes.sfxGain = this.ctx.createGain();
      this.nodes.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.nodes.sfxGain.connect(this.nodes.masterGain);

      // Start ambient vinyl crackle/rain generator
      this.startRainCrackle();
    } catch (e) {
      console.error("Gagal menginisialisasi audio engine:", e);
    }
  }

  updateVolumes(master: number, bgm: number, sfx: number) {
    this.masterVol = master / 100;
    this.bgmVol = bgm / 100;
    this.sfxVol = sfx / 100;

    if (this.nodes.masterGain && this.ctx) {
      this.nodes.masterGain.gain.linearRampToValueAtTime(
        this.masterVol,
        this.ctx.currentTime + 0.1,
      );
    }
    if (this.nodes.bgmGain && this.ctx) {
      this.nodes.bgmGain.gain.linearRampToValueAtTime(
        this.bgmVol,
        this.ctx.currentTime + 0.1,
      );
    }
    if (this.nodes.sfxGain && this.ctx) {
      this.nodes.sfxGain.gain.linearRampToValueAtTime(
        this.sfxVol,
        this.ctx.currentTime + 0.1,
      );
    }
  }

  playSfx(type: "hover" | "click" | "back") {
    this.init();
    if (!this.ctx || !this.nodes.sfxGain) return;

    // Resume context if suspended
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.nodes.sfxGain);

    if (type === "hover") {
      // Soft organic wooden click/pluck
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === "click") {
      // Arpeggiated warm chime
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.nodes.sfxGain);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.15); // E5
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, t + 0.06); // E5
      osc2.frequency.exponentialRampToValueAtTime(783.99, t + 0.2); // G5
      gain2.gain.setValueAtTime(0.08, t + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.start(t);
      osc.stop(t + 0.2);
      osc2.start(t + 0.06);
      osc2.stop(t + 0.25);
    } else if (type === "back") {
      // Warm downward slide
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.15);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  startRainCrackle() {
    if (!this.ctx || !this.nodes.bgmGain) return;

    // Generate vinyl crackle / rain procedurally using white noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(
      1,
      bufferSize,
      this.ctx.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter to simulate rain rumble + gentle vinyl crackle
      output[i] = lastOut * 0.98 + white * 0.02;
      lastOut = output[i];

      // Random crackling impulses
      if (Math.random() < 0.00015) {
        output[i] += (Math.random() - 0.5) * 0.4;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter to make it muddy and warm
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.nodes.bgmGain);

    noise.start();
    (this.nodes as any).rainSource = noise;
    (this.nodes as any).rainGain = rainGain;
  }

  // Plays a beautiful lofi synth chord progression procedurally
  toggleLofiMusic(play: boolean) {
    this.init();
    if (!this.ctx || !this.nodes.bgmGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlayingLofi = play;

    if (!play) {
      if (this.lofiInterval) {
        clearInterval(this.lofiInterval);
        this.lofiInterval = null;
      }
      if ((this.nodes as any).rainGain) {
        (this.nodes as any).rainGain.gain.linearRampToValueAtTime(
          0.04,
          this.ctx.currentTime + 0.5,
        );
      }
      return;
    }

    // Boost rain crackle volume when music plays
    if ((this.nodes as any).rainGain) {
      (this.nodes as any).rainGain.gain.linearRampToValueAtTime(
        0.12,
        this.ctx.currentTime + 0.5,
      );
    }

    // Lofi chord progression: Cmaj9 -> Am9 -> Fmaj9 -> G13
    const chords = [
      [130.81, 164.81, 196.0, 246.94, 293.66], // C3, E3, G3, B3, D4
      [110.07, 146.83, 164.81, 196.0, 246.94], // A2, D3, E3, G3, B3
      [87.31, 130.81, 174.61, 220.0, 261.63], // F2, C3, F3, A3, C4
      [98.0, 146.83, 174.61, 246.94, 293.66], // G2, D3, F3, B3, D4
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlayingLofi || !this.ctx || !this.nodes.bgmGain) return;
      const t = this.ctx.currentTime;
      const chord = chords[chordIdx];

      // Cycle through chords
      chordIdx = (chordIdx + 1) % chords.length;

      // Play soft warm sine nodes for the chord
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.nodes.bgmGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        // Filter out extreme highs
        const chordFilter = this.ctx.createBiquadFilter();
        chordFilter.type = "lowpass";
        chordFilter.frequency.setValueAtTime(800, t);

        osc.connect(chordFilter);
        chordFilter.connect(gain);
        gain.connect(this.nodes.bgmGain);

        // Very slow attack, long release
        const attack = 1.0;
        const sustain = 3.5;
        const release = 1.5;

        gain.gain.setValueAtTime(0, t);
        // Slightly stagger chord notes (strum effect)
        gain.gain.linearRampToValueAtTime(
          0.025 - idx * 0.002,
          t + attack + idx * 0.05,
        );
        gain.gain.setValueAtTime(0.025 - idx * 0.002, t + attack + sustain);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          t + attack + sustain + release,
        );

        osc.start(t + idx * 0.05);
        osc.stop(t + attack + sustain + release + 0.1);
      });
    };

    // Play first chord immediately
    playChord();

    // Play new chord every 6 seconds
    this.lofiInterval = setInterval(playChord, 6000);
  }
}

export const audio = new CozyAudioEngine();
