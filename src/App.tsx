import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  History, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Music,
  Gamepad2,
  Tv,
  Compass,
  Monitor,
  Heart
} from "lucide-react";
import "./App.css";

// --- Audio Engine (Procedural Sound Design) ---
class CozyAudioEngine {
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
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Setup gains
      this.nodes.masterGain = this.ctx.createGain();
      this.nodes.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
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
      this.nodes.masterGain.gain.linearRampToValueAtTime(this.masterVol, this.ctx.currentTime + 0.1);
    }
    if (this.nodes.bgmGain && this.ctx) {
      this.nodes.bgmGain.gain.linearRampToValueAtTime(this.bgmVol, this.ctx.currentTime + 0.1);
    }
    if (this.nodes.sfxGain && this.ctx) {
      this.nodes.sfxGain.gain.linearRampToValueAtTime(this.sfxVol, this.ctx.currentTime + 0.1);
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
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter to simulate rain rumble + gentle vinyl crackle
      output[i] = (lastOut * 0.98 + white * 0.02);
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
        (this.nodes as any).rainGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.5);
      }
      return;
    }

    // Boost rain crackle volume when music plays
    if ((this.nodes as any).rainGain) {
      (this.nodes as any).rainGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);
    }

    // Lofi chord progression: Cmaj9 -> Am9 -> Fmaj9 -> G13
    const chords = [
      [130.81, 164.81, 196.00, 246.94, 293.66], // C3, E3, G3, B3, D4
      [110.07, 146.83, 164.81, 196.00, 246.94], // A2, D3, E3, G3, B3
      [87.31, 130.81, 174.61, 220.00, 261.63],  // F2, C3, F3, A3, C4
      [98.00, 146.83, 174.61, 246.94, 293.66]   // G2, D3, F3, B3, D4
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
        gain.gain.linearRampToValueAtTime(0.025 - (idx * 0.002), t + attack + (idx * 0.05));
        gain.gain.setValueAtTime(0.025 - (idx * 0.002), t + attack + sustain);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + sustain + release);

        osc.start(t + (idx * 0.05));
        osc.stop(t + attack + sustain + release + 0.1);
      });
    };

    // Play first chord immediately
    playChord();
    
    // Play new chord every 6 seconds
    this.lofiInterval = setInterval(playChord, 6000);
  }
}

// Instantiate audio manager
const audio = new CozyAudioEngine();

export default function App() {
  // Screens: 'home' | 'settings' | 'gallery' | 'saves'
  const [activeScreen, setActiveScreen] = useState<"home" | "settings" | "gallery" | "saves">("home");
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  
  // States
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  
  // Settings Volume States
  const [masterVol, setMasterVol] = useState(70);
  const [bgmVol, setBgmVol] = useState(50);
  const [sfxVol, setSfxVol] = useState(65);
  
  // Settings Toggle States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vsync, setVsync] = useState(true);
  const [quality, setQuality] = useState("Tinggi");

  // Save files
  const saveSlots = [
    { id: 1, name: "Desa Greenvale", day: "Hari 15", time: "18:42", detail: "Kabin Kayu, Cuaca Hujan", playtime: "12 Jam" },
    { id: 2, name: "Lembah Emas", day: "Hari 4", time: "09:15", detail: "Tenda Tepi Sungai, Cuaca Cerah", playtime: "2.5 Jam" },
    { id: 3, name: "Pesisir Sunyi", day: "Hari 1", time: "06:00", detail: "Pondok Pantai, Cuaca Berkabut", playtime: "25 Menit" }
  ];

  // Gallery regions
  const galleryItems = [
    { title: "Kabin Musim Gugur", region: "Hutan Greenvale", desc: "Tempat berlindung hangat di bawah naungan pohon pinus merah.", img: "/cozy_cabin.png" },
    { title: "Sungai Gemericik", region: "Lembah Embun", desc: "Aliran air jernih dengan gemericik santai tempat memancing ikan trout.", img: "/cozy_cabin.png" }, // reusing main beautiful image for demo
    { title: "Perapian Tenang", region: "Kabin Utama", desc: "Suara kayu bakar terbakar perlahan menemani malam yang damai.", img: "/cozy_cabin.png" }
  ];

  const handleScreenChange = (screen: "home" | "settings" | "gallery" | "saves") => {
    if (screen === "home") {
      audio.playSfx("back");
    } else {
      audio.playSfx("click");
    }
    setActiveScreen(screen);
  };

  const handleHover = (option: string | null) => {
    setHoveredOption(option);
    if (option) {
      audio.playSfx("hover");
    }
  };

  const handleToggleLofi = () => {
    audio.playSfx("click");
    const nextState = !isPlayingLofi;
    setIsPlayingLofi(nextState);
    audio.toggleLofiMusic(nextState);
  };

  // Sync volume state to audio engine
  useEffect(() => {
    audio.updateVolumes(masterVol, bgmVol, sfxVol);
  }, [masterVol, bgmVol, sfxVol]);

  const launchGame = async () => {
    audio.playSfx("click");
    setIsConnecting(true);
    try {
      // Send UDP startup code to Godot via Tauri bridge
      await invoke("send_to_godot", { msg: "START_COZY_WORLD" });
    } catch (e) {
      console.warn("Tauri bridge not detected, simulating connection in standalone browser:", e);
    }
    
    // Smooth loading UI simulation
    setTimeout(() => {
      setIsConnecting(false);
    }, 2500);
  };

  // Descriptive text helper based on hovered option to show on description pane
  const getDescription = () => {
    switch (hoveredOption) {
      case "mulai":
        return "Bangun dunia impian baru, jelajahi hutan misterius, bangun kabin impian, dan nikmati petualangan tanpa batas.";
      case "lanjut":
        return "Lanjutkan petualangan Anda yang tersimpan. Menghubungkan ke save file terakhir Anda.";
      case "galeri":
        return "Lihat tangkapan layar pemandangan indah, satwa liar, dan kabin-kabin unik yang telah Anda dokumentasikan.";
      case "pengaturan":
        return "Atur kualitas grafis, kontrol keyboard, serta sesuaikan volume musik lofi dan efek suara untuk kenyamanan maksimal.";
      case "keluar":
        return "Tutup permainan dan simpan semua kemajuan petualangan Anda dengan aman.";
      default:
        return "Selamat datang di Cozy World. Sebuah ruang damai di mana Anda dapat melarikan diri, membangun, dan mendengarkan alunan musik yang menenangkan.";
    }
  };

  return (
    <main className="w-screen h-screen flex bg-[#07080c] overflow-hidden relative font-sans text-white select-none">
      
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[140px]"></div>
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]"></div>

      {/* Decorative Grid Lines overlay (Premium details) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* LEFT COLUMN: MAIN MENU PANELS (Aligned Left) */}
      <div className="w-[34%] min-w-[400px] h-full flex flex-col justify-between py-14 pl-14 pr-8 relative z-20 glass-panel border-r border-white/5">
        
        {/* TOP: Title & Header Area */}
        <div className="flex flex-col gap-2">
          {/* Logo Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-[10px] tracking-[0.3em] font-medium text-amber-500/90 uppercase">
              Now Launching: Alpha 0.4
            </span>
          </div>
          
          <h1 className="text-4xl font-extralight tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 drop-shadow-lg">
            COZY WORLD
          </h1>
          <p className="text-[11px] tracking-[0.45em] text-cyan-400/50 uppercase font-light">
            Eksplorasi & Relaksasi
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-cyan-500/40 to-transparent mt-3"></div>
        </div>

        {/* CENTER: Main Interactive Screen Controller */}
        <div className="flex-1 my-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* Screen 1: MAIN MENU HOME */}
            {activeScreen === "home" && (
              <motion.div
                key="home-menu"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-4 w-full"
              >
                {/* 1. Mulai Petualangan */}
                <button
                  onClick={launchGame}
                  onMouseEnter={() => handleHover("mulai")}
                  onMouseLeave={() => handleHover(null)}
                  className="group relative w-full flex items-center justify-between py-4 px-5 rounded-xl border border-cyan-500/10 hover:border-cyan-400/40 bg-white/[0.01] hover:bg-cyan-950/10 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <Sparkles className="w-5 h-5 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
                    <span className="text-sm font-light tracking-[0.25em] uppercase text-slate-300 group-hover:text-white transition-colors">
                      Mulai Petualangan
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 group-hover:scale-125 transition-all"></div>
                </button>

                {/* 2. Lanjutkan Perjalanan */}
                <button
                  onClick={() => handleScreenChange("saves")}
                  onMouseEnter={() => handleHover("lanjut")}
                  onMouseLeave={() => handleHover(null)}
                  className="group relative w-full flex items-center justify-between py-4 px-5 rounded-xl border border-white/5 hover:border-amber-500/30 bg-white/[0.01] hover:bg-amber-950/10 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <History className="w-5 h-5 text-amber-500/60 group-hover:text-amber-400 transition-colors" />
                    <span className="text-sm font-light tracking-[0.25em] uppercase text-slate-400 group-hover:text-amber-100 transition-colors">
                      Lanjutkan Game
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-amber-400 transition-all"></div>
                </button>

                {/* 3. Galeri Dunia */}
                <button
                  onClick={() => handleScreenChange("gallery")}
                  onMouseEnter={() => handleHover("galeri")}
                  onMouseLeave={() => handleHover(null)}
                  className="group relative w-full flex items-center justify-between py-4 px-5 rounded-xl border border-white/5 hover:border-slate-400/30 bg-white/[0.01] hover:bg-slate-800/10 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <ImageIcon className="w-5 h-5 text-slate-400/70 group-hover:text-slate-300 transition-colors" />
                    <span className="text-sm font-light tracking-[0.25em] uppercase text-slate-400 group-hover:text-white transition-colors">
                      Galeri Dunia
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-slate-300 transition-all"></div>
                </button>

                {/* 4. Pengaturan */}
                <button
                  onClick={() => handleScreenChange("settings")}
                  onMouseEnter={() => handleHover("pengaturan")}
                  onMouseLeave={() => handleHover(null)}
                  className="group relative w-full flex items-center justify-between py-4 px-5 rounded-xl border border-white/5 hover:border-cyan-500/25 bg-white/[0.01] hover:bg-cyan-950/10 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <SettingsIcon className="w-5 h-5 text-slate-400/70 group-hover:text-cyan-400/80 transition-colors" />
                    <span className="text-sm font-light tracking-[0.25em] uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                      Pengaturan
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-cyan-400 transition-all"></div>
                </button>

                {/* 5. Keluar Game */}
                <button
                  onMouseEnter={() => handleHover("keluar")}
                  onMouseLeave={() => handleHover(null)}
                  className="group relative w-full flex items-center justify-between py-4 px-5 rounded-xl border border-white/5 hover:border-red-500/30 bg-white/[0.01] hover:bg-red-950/10 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <LogOut className="w-5 h-5 text-red-500/50 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-light tracking-[0.25em] uppercase text-slate-400 group-hover:text-red-300 transition-colors">
                      Keluar Game
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-red-400 transition-all"></div>
                </button>
              </motion.div>
            )}

            {/* Screen 2: SAVE SLOTS */}
            {activeScreen === "saves" && (
              <motion.div
                key="saves-menu"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4 w-full"
              >
                <button 
                  onClick={() => handleScreenChange("home")}
                  className="flex items-center gap-2 text-xs tracking-wider text-amber-500/80 hover:text-amber-400 transition-colors mb-2 self-start cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
                </button>
                
                <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase mb-1">
                  PILIH SLOT PETUALANGAN
                </h3>

                {saveSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={launchGame}
                    className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-amber-500/[0.03] hover:border-amber-500/30 transition-all duration-300 flex justify-between items-center group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium tracking-wide text-slate-200 group-hover:text-amber-300 transition-colors">
                          {slot.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                          {slot.day}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{slot.detail}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 transition-colors">
                      {slot.playtime}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Screen 3: GALLERY SUBMENU */}
            {activeScreen === "gallery" && (
              <motion.div
                key="gallery-menu"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4 w-full"
              >
                <button 
                  onClick={() => handleScreenChange("home")}
                  className="flex items-center gap-2 text-xs tracking-wider text-cyan-400/80 hover:text-cyan-300 transition-colors mb-2 self-start cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
                </button>

                <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase mb-1">
                  DOKUMENTASI DUNIA
                </h3>

                <div className="flex flex-col gap-3">
                  {galleryItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex gap-3 group"
                    >
                      <div className="w-14 h-14 rounded-lg bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                        <p className="text-[9px] text-cyan-400/70 font-mono tracking-wider mt-0.5">{item.region}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Screen 4: SETTINGS SCREEN */}
            {activeScreen === "settings" && (
              <motion.div
                key="settings-menu"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4 w-full h-[380px] overflow-y-auto pr-1"
              >
                <button 
                  onClick={() => handleScreenChange("home")}
                  className="flex items-center gap-2 text-xs tracking-wider text-cyan-400/80 hover:text-cyan-300 transition-colors mb-2 self-start cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
                </button>

                {/* Section A: Audio */}
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-2.5">
                    <Music className="w-4 h-4 text-amber-500/70" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">PENGATURAN SUARA</span>
                  </div>
                  
                  <div className="flex flex-col gap-3 pl-1">
                    {/* Master */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>VOLUME UTAMA</span>
                        <span>{masterVol}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={masterVol} 
                        onChange={(e) => setMasterVol(Number(e.target.value))}
                      />
                    </div>
                    {/* BGM */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>MUSIK LATAR (LOFI)</span>
                        <span>{bgmVol}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={bgmVol} 
                        onChange={(e) => setBgmVol(Number(e.target.value))}
                      />
                    </div>
                    {/* SFX */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>EFEK SUARA</span>
                        <span>{sfxVol}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sfxVol} 
                        onChange={(e) => setSfxVol(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 my-1"></div>

                {/* Section B: Display/Graphics */}
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-3">
                    <Tv className="w-4 h-4 text-cyan-400/70" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">GRAFIS & TAMPILAN</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 pl-1">
                    {/* Fullscreen Toggle */}
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-300 font-light">LAYAR PENUH</span>
                      <button 
                        onClick={() => { audio.playSfx("click"); setIsFullscreen(!isFullscreen); }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${isFullscreen ? 'bg-cyan-500' : 'bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isFullscreen ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    {/* VSync Toggle */}
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-300 font-light">V-SYNC</span>
                      <button 
                        onClick={() => { audio.playSfx("click"); setVsync(!vsync); }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${vsync ? 'bg-cyan-500' : 'bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${vsync ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    {/* Quality selector */}
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-300 font-light">KUALITAS GRAFIS</span>
                      <div className="flex gap-1.5 bg-slate-900 border border-white/5 p-0.5 rounded-lg">
                        {["Sedang", "Tinggi"].map((q) => (
                          <button
                            key={q}
                            onClick={() => { audio.playSfx("click"); setQuality(q); }}
                            className={`text-[9px] px-2 py-1 rounded-md transition-colors ${quality === q ? 'bg-cyan-500 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 my-1"></div>

                {/* Section C: Controls Helper */}
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                    <Gamepad2 className="w-4 h-4 text-cyan-400/50" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">KONTROL PERMAINAN</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-400 bg-white/[0.01] p-2.5 rounded-lg border border-white/5">
                    <div>W, A, S, D : Gerak Karakter</div>
                    <div>E / Klik : Interaksi</div>
                    <div>Tab / I : Inventaris</div>
                    <div>Esc : Menu Jeda</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM: System Status & Decorative Info */}
        <div className="flex flex-col gap-4 mt-auto">
          {/* Decorative Divider */}
          <div className="h-[1px] bg-gradient-to-r from-white/5 via-white/10 to-transparent w-full"></div>

          {/* User/System Card */}
          <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-slate-500 uppercase">
            <span>Tauri Engine: 2.1.2</span>
            <span>Port 9001 Aktif</span>
          </div>

          <div className="text-[7px] text-slate-600 font-mono uppercase text-center mt-1">
            Didesain oleh Nestia Dev &copy; 2026
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: WORLD PREVIEW, DYNAMIC DESC & PLAYER WIDGET */}
      <div className="flex-1 h-full relative flex items-center justify-center p-14 z-10">
        
        {/* Main Cozy Cabin Canvas Frame */}
        <div className="w-full max-w-4xl aspect-[16/10] glass-panel rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10">
          
          {/* Framed Background Image (Stunning preview generated previously) */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/cozy_cabin.png" 
              alt="Latar Hutan Musim Gugur" 
              className="w-full h-full object-cover brightness-[0.4] contrast-[1.05] transition-transform duration-1000 scale-[1.02] group-hover:scale-105"
            />
            {/* Smooth warm color grading gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080c]/60 via-transparent to-transparent"></div>
          </div>

          {/* TOP RIGHT WIDGETS: Ambient Details */}
          <div className="relative z-10 flex justify-between items-start w-full">
            {/* Dynamic Status / Location Tag */}
            <div className="flex flex-col gap-1 bg-black/40 backdrop-blur-md border border-white/5 py-2 px-4 rounded-xl">
              <span className="text-[8px] tracking-[0.25em] font-bold text-amber-500 uppercase">LOKASI SEKARANG</span>
              <span className="text-[11px] font-light tracking-[0.05em] text-slate-100 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Kabin Hutan Musim Gugur
              </span>
            </div>

            {/* Weather / Time HUD widget */}
            <div className="flex gap-4 bg-black/40 backdrop-blur-md border border-white/5 py-2 px-4 rounded-xl font-mono text-[9px] text-slate-300">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase">CUACA</span>
                <span className="text-cyan-400 font-semibold tracking-wider">HUJAN RINGAN</span>
              </div>
              <div className="w-[1px] bg-white/10 self-stretch"></div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase">WAKTU</span>
                <span className="text-amber-400 font-bold">19:42 MALAM</span>
              </div>
            </div>
          </div>

          {/* CENTER WIDGET: Dynamic Option Descriptions (WOW factor) */}
          <div className="relative z-10 my-auto max-w-xl text-left bg-black/25 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredOption || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  <span className="text-[9px] tracking-[0.3em] font-bold text-cyan-400 uppercase">
                    INFORMASI MENU
                  </span>
                </div>
                <p className="text-sm font-light text-slate-200 leading-relaxed min-h-[50px]">
                  {getDescription()}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM WIDGETS: Beautiful Interactive Lofi Music Player & Launcher State */}
          <div className="relative z-10 flex justify-between items-end w-full">
            
            {/* Interactive BGM Lofi Player widget */}
            <div className="flex items-center gap-4 bg-slate-950/70 backdrop-blur-md border border-white/10 py-3 px-5 rounded-2xl max-w-xs shadow-xl">
              <button 
                onClick={handleToggleLofi}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isPlayingLofi ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-white/10 text-white hover:bg-white/20'} cursor-pointer`}
              >
                {isPlayingLofi ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">MUSIK LATAR</span>
                <span className="text-[10px] font-light text-slate-200 truncate max-w-[150px]">
                  {isPlayingLofi ? "Autumn Rain Campfire // Lofi loop" : "Musik Latar Senyap"}
                </span>
                {isPlayingLofi && (
                  <div className="flex gap-0.5 items-end h-2 mt-1">
                    <span className="w-0.5 h-2 bg-amber-500 animate-pulse"></span>
                    <span className="w-0.5 h-1.5 bg-amber-500 animate-pulse delay-75"></span>
                    <span className="w-0.5 h-3 bg-amber-500 animate-pulse delay-150"></span>
                    <span className="w-0.5 h-1 bg-amber-500 animate-pulse delay-100"></span>
                  </div>
                )}
              </div>
            </div>

            {/* Standalone Status Info */}
            <div className="text-right flex flex-col items-end gap-1.5">
              <div className="text-[9px] font-mono text-slate-500 uppercase">
                LAUNCHER STATUS
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 border border-white/5 py-1.5 px-3 rounded-lg text-[9px] font-mono">
                <span className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
                <span className="text-slate-300 font-light">
                  {isConnecting ? "MENGHUBUNGKAN KONEKSI..." : "SIAP DIMAINKAN"}
                </span>
              </div>
            </div>

          </div>

          {/* Launcher Loading Modal Overlay */}
          <AnimatePresence>
            {isConnecting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#07080c]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative mb-6">
                  {/* Outer glowing progress spinner */}
                  <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin"></div>
                  {/* Inner logo/pulsing core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 animate-pulse flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-cyan-400"></div>
                    </div>
                  </div>
                </div>

                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-light tracking-[0.25em] uppercase text-cyan-200"
                >
                  Memulai Petualangan
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] tracking-[0.15em] font-mono text-slate-400 uppercase mt-2.5"
                >
                  Menghubungkan ke Godot Bridge (Port 9001) // Membaca Save Data
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Decorative Corner Borders */}
      <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-white/10 z-30 pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-white/10 z-30 pointer-events-none"></div>
    </main>
  );
}
