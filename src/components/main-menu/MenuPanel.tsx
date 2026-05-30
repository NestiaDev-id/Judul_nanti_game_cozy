import { AnimatePresence, motion } from "framer-motion";
import {
  Gamepad2,
  History,
  Image as ImageIcon,
  LogOut,
  Music,
  Settings as SettingsIcon,
  Sparkles,
  Tv,
  X,
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
  const isPopupOpen = activeScreen !== "home" && activeScreen !== "splash";

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md pointer-events-auto">
      <div className="flex flex-col gap-3">
        <button
          onClick={onStartGame}
          onMouseEnter={() => onHoverOption("mulai")}
          onMouseLeave={() => onHoverOption(null)}
          className="pixel-button pixel-button--primary flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-800" />
          <span>Mulai Petualangan</span>
        </button>

        <button
          onClick={() => onNavigate("saves")}
          onMouseEnter={() => onHoverOption("lanjut")}
          onMouseLeave={() => onHoverOption(null)}
          className="pixel-button pixel-button--secondary flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
        >
          <History className="w-5 h-5 text-amber-800" />
          <span>Lanjutkan Game</span>
        </button>

        <button
          onClick={() => onNavigate("gallery")}
          onMouseEnter={() => onHoverOption("galeri")}
          onMouseLeave={() => onHoverOption(null)}
          className="pixel-button flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
        >
          <ImageIcon className="w-5 h-5 text-slate-700" />
          <span>Galeri Dunia</span>
        </button>

        <button
          onClick={() => onNavigate("settings")}
          onMouseEnter={() => onHoverOption("pengaturan")}
          onMouseLeave={() => onHoverOption(null)}
          className="pixel-button flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
        >
          <SettingsIcon className="w-5 h-5 text-slate-700" />
          <span>Pengaturan</span>
        </button>

        <button
          onMouseEnter={() => onHoverOption("keluar")}
          onMouseLeave={() => onHoverOption(null)}
          className="pixel-button pixel-button--danger flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-red-800" />
          <span>Keluar Game</span>
        </button>
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            key="popup-overlay"
            className="fixed inset-0 z-30 bg-black/40 flex items-start justify-center pt-10 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={`popup-${activeScreen}`}
              className="hanging-board w-[88vw] max-w-5xl"
              initial={{ y: -220, opacity: 0, rotate: -1.2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -200, opacity: 0, rotate: 0.8 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.9 }}
            >
              <motion.div
                className="hanging-board__rope hanging-board__rope--left"
                initial={{ scaleY: 0.4, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />
              <motion.div
                className="hanging-board__rope hanging-board__rope--right"
                initial={{ scaleY: 0.4, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />
              <div className="hanging-board__frame">
                <div className="hanging-board__paper relative">
                  <button
                    className="hanging-board__close"
                    onClick={() => onNavigate("home")}
                    aria-label="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {activeScreen === "saves" && (
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[12px] font-semibold tracking-[0.3em] uppercase text-[#5d442f]">
                        PILIH SLOT PETUALANGAN
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {saveSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={onStartGame}
                            className="pixel-panel pixel-panel--soft w-full text-left p-3 flex justify-between items-center gap-3 transition-transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold tracking-wide text-[#4b3324]">
                                  {slot.name}
                                </span>
                                <span className="pixel-badge text-[8px] px-1.5 py-0.5">
                                  {slot.day}
                                </span>
                              </div>
                              <p className="text-[10px] pixel-muted mt-1">
                                {slot.detail}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono pixel-muted">
                              {slot.playtime}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeScreen === "gallery" && (
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[12px] font-semibold tracking-[0.3em] uppercase text-[#5d442f]">
                        DOKUMENTASI DUNIA
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {galleryItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="pixel-panel pixel-panel--soft p-3 flex gap-3"
                          >
                            <div className="pixel-frame w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-[#4b3324]">
                                {item.title}
                              </h4>
                              <p className="text-[9px] font-mono tracking-wider mt-0.5 text-[#6a4c34]">
                                {item.region}
                              </p>
                              <p className="text-[10px] pixel-muted mt-1 leading-normal line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeScreen === "settings" && (
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[12px] font-semibold tracking-[0.3em] uppercase text-[#5d442f]">
                        PENGATURAN
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="pixel-panel p-4">
                          <div className="flex items-center gap-1.5 mb-3 text-[#5d442f]">
                            <Music className="w-4 h-4 text-amber-700" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                              PENGATURAN SUARA
                            </span>
                          </div>

                          <div className="flex flex-col gap-3 pl-1">
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] font-mono pixel-muted">
                                <span>VOLUME UTAMA</span>
                                <span>{masterVol}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={masterVol}
                                onChange={(e) =>
                                  onMasterVolChange(Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] font-mono pixel-muted">
                                <span>MUSIK LATAR (LOFI)</span>
                                <span>{bgmVol}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={bgmVol}
                                onChange={(e) =>
                                  onBgmVolChange(Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] font-mono pixel-muted">
                                <span>EFEK SUARA</span>
                                <span>{sfxVol}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={sfxVol}
                                onChange={(e) =>
                                  onSfxVolChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pixel-panel p-4">
                          <div className="flex items-center gap-1.5 mb-3 text-[#5d442f]">
                            <Tv className="w-4 h-4 text-emerald-700" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                              GRAFIS & TAMPILAN
                            </span>
                          </div>

                          <div className="flex flex-col gap-2.5 pl-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-[#4b3324] font-semibold">
                                LAYAR PENUH
                              </span>
                              <button
                                onClick={onToggleFullscreen}
                                className={`pixel-toggle ${isFullscreen ? "is-on" : ""}`}
                              >
                                <div className="pixel-toggle__thumb" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-[#4b3324] font-semibold">
                                V-SYNC
                              </span>
                              <button
                                onClick={onToggleVsync}
                                className={`pixel-toggle ${vsync ? "is-on" : ""}`}
                              >
                                <div className="pixel-toggle__thumb" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-[#4b3324] font-semibold">
                                KUALITAS GRAFIS
                              </span>
                              <div className="flex gap-1.5 p-0.5 rounded-lg">
                                {(["Sedang", "Tinggi"] as QualityOption[]).map(
                                  (q) => (
                                    <button
                                      key={q}
                                      onClick={() => onQualityChange(q)}
                                      className={`pixel-pill text-[9px] px-2 py-1 transition-colors ${quality === q ? "is-active" : ""}`}
                                    >
                                      {q}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pixel-panel p-4 md:col-span-2">
                          <div className="flex items-center gap-1.5 mb-2 text-[#5d442f]">
                            <Gamepad2 className="w-4 h-4 text-emerald-700" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                              KONTROL PERMAINAN
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono pixel-muted bg-[#f6ebd2] p-2.5 rounded-lg border-2 border-[#b88b5a]">
                            <div>W, A, S, D : Gerak Karakter</div>
                            <div>E / Klik : Interaksi</div>
                            <div>Tab / I : Inventaris</div>
                            <div>Esc : Menu Jeda</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
