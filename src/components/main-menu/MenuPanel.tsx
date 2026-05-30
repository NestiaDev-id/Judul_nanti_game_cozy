import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Gamepad2,
  History,
  Image as ImageIcon,
  LogOut,
  Music,
  Settings as SettingsIcon,
  Sparkles,
  Tv,
} from "lucide-react";
import type {
  GalleryItem,
  MainMenuScreen,
  MainMenuView,
  QualityOption,
  SaveSlot,
} from "./types";

type MenuPanelProps = {
  activeScreen: MainMenuView;
  saveSlots: SaveSlot[];
  galleryItems: GalleryItem[];
  onStartGame: () => void;
  onNavigate: (screen: MainMenuScreen) => void;
  onHoverOption: (option: string | null) => void;
  masterVol: number;
  bgmVol: number;
  sfxVol: number;
  isFullscreen: boolean;
  vsync: boolean;
  quality: QualityOption;
  onMasterVolChange: (value: number) => void;
  onBgmVolChange: (value: number) => void;
  onSfxVolChange: (value: number) => void;
  onToggleFullscreen: () => void;
  onToggleVsync: () => void;
  onQualityChange: (quality: QualityOption) => void;
};

export function MenuPanel({
  activeScreen,
  saveSlots,
  galleryItems,
  onStartGame,
  onNavigate,
  onHoverOption,
  masterVol,
  bgmVol,
  sfxVol,
  isFullscreen,
  vsync,
  quality,
  onMasterVolChange,
  onBgmVolChange,
  onSfxVolChange,
  onToggleFullscreen,
  onToggleVsync,
  onQualityChange,
}: MenuPanelProps) {
  return (
    <div className="flex-1 flex flex-col justify-center max-w-md pointer-events-auto">
      <AnimatePresence mode="wait">
        {/* ── HOME MENU ── */}
        {activeScreen === "home" && (
          <motion.div
            key="home-menu"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={onStartGame}
              onMouseEnter={() => onHoverOption("mulai")}
              onMouseLeave={() => onHoverOption(null)}
              className="group relative flex items-center gap-4 py-3 px-5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-cyan-400/40 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
              <span className="text-sm font-light tracking-[0.2em] uppercase text-slate-200 group-hover:text-white transition-colors">
                Mulai Petualangan
              </span>
            </button>

            <button
              onClick={() => onNavigate("saves")}
              onMouseEnter={() => onHoverOption("lanjut")}
              onMouseLeave={() => onHoverOption(null)}
              className="group relative flex items-center gap-4 py-3 px-5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-amber-400/30 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <History className="w-5 h-5 text-amber-500/60 group-hover:text-amber-400 transition-colors" />
              <span className="text-sm font-light tracking-[0.2em] uppercase text-slate-300 group-hover:text-amber-100 transition-colors">
                Lanjutkan Game
              </span>
            </button>

            <button
              onClick={() => onNavigate("gallery")}
              onMouseEnter={() => onHoverOption("galeri")}
              onMouseLeave={() => onHoverOption(null)}
              className="group relative flex items-center gap-4 py-3 px-5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-slate-300/20 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 text-slate-400/70 group-hover:text-slate-300 transition-colors" />
              <span className="text-sm font-light tracking-[0.2em] uppercase text-slate-300 group-hover:text-white transition-colors">
                Galeri Dunia
              </span>
            </button>

            <button
              onClick={() => onNavigate("settings")}
              onMouseEnter={() => onHoverOption("pengaturan")}
              onMouseLeave={() => onHoverOption(null)}
              className="group relative flex items-center gap-4 py-3 px-5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-cyan-400/25 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <SettingsIcon className="w-5 h-5 text-slate-400/70 group-hover:text-cyan-400/80 transition-colors" />
              <span className="text-sm font-light tracking-[0.2em] uppercase text-slate-300 group-hover:text-slate-100 transition-colors">
                Pengaturan
              </span>
            </button>

            <button
              onMouseEnter={() => onHoverOption("keluar")}
              onMouseLeave={() => onHoverOption(null)}
              className="group relative flex items-center gap-4 py-3 px-5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-red-500/30 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-red-500/50 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-light tracking-[0.2em] uppercase text-slate-300 group-hover:text-red-300 transition-colors">
                Keluar Game
              </span>
            </button>
          </motion.div>
        )}

        {/* ── SAVE SLOTS ── */}
        {activeScreen === "saves" && (
          <motion.div
            key="saves-menu"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 text-xs tracking-wider text-amber-400/80 hover:text-amber-300 transition-colors mb-1 self-start cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
            </button>

            <h3 className="text-sm font-semibold tracking-widest text-slate-200 uppercase mb-1">
              PILIH SLOT PETUALANGAN
            </h3>

            {saveSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={onStartGame}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:bg-amber-500/[0.06] hover:border-amber-400/30 transition-all duration-300 flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium tracking-wide text-slate-200 group-hover:text-amber-300 transition-colors">
                      {slot.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono">
                      {slot.day}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {slot.detail}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 transition-colors">
                  {slot.playtime}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* ── GALLERY ── */}
        {activeScreen === "gallery" && (
          <motion.div
            key="gallery-menu"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 text-xs tracking-wider text-cyan-400/80 hover:text-cyan-300 transition-colors mb-1 self-start cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
            </button>

            <h3 className="text-sm font-semibold tracking-widest text-slate-200 uppercase mb-1">
              DOKUMENTASI DUNIA
            </h3>

            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-white/15 transition-all flex gap-3 group"
              >
                <div className="w-14 h-14 rounded-lg bg-black/30 border border-white/10 overflow-hidden flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-cyan-400/70 font-mono tracking-wider mt-0.5">
                    {item.region}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── SETTINGS (overlay panel, centered) ── */}
        {activeScreen === "settings" && (
          <motion.div
            key="settings-menu"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4 w-full max-h-[60vh] overflow-y-auto pr-1"
          >
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 text-xs tracking-wider text-cyan-400/80 hover:text-cyan-300 transition-colors mb-1 self-start cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI
            </button>

            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-slate-300 mb-3">
                <Music className="w-4 h-4 text-amber-500/70" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  PENGATURAN SUARA
                </span>
              </div>

              <div className="flex flex-col gap-3 pl-1">
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
                    onChange={(e) => onMasterVolChange(Number(e.target.value))}
                  />
                </div>
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
                    onChange={(e) => onBgmVolChange(Number(e.target.value))}
                  />
                </div>
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
                    onChange={(e) => onSfxVolChange(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-slate-300 mb-3">
                <Tv className="w-4 h-4 text-cyan-400/70" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  GRAFIS & TAMPILAN
                </span>
              </div>

              <div className="flex flex-col gap-2.5 pl-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-300 font-light">
                    LAYAR PENUH
                  </span>
                  <button
                    onClick={onToggleFullscreen}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${isFullscreen ? "bg-cyan-500" : "bg-slate-800"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isFullscreen ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-300 font-light">
                    V-SYNC
                  </span>
                  <button
                    onClick={onToggleVsync}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${vsync ? "bg-cyan-500" : "bg-slate-800"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${vsync ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-300 font-light">
                    KUALITAS GRAFIS
                  </span>
                  <div className="flex gap-1.5 bg-black/30 border border-white/5 p-0.5 rounded-lg">
                    {(["Sedang", "Tinggi"] as QualityOption[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => onQualityChange(q)}
                        className={`text-[9px] px-2 py-1 rounded-md transition-colors ${quality === q ? "bg-cyan-500 text-white font-semibold" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-slate-300 mb-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400/50" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  KONTROL PERMAINAN
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-400 bg-black/20 p-2.5 rounded-lg border border-white/5">
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
  );
}
