import { Volume2, VolumeX } from "lucide-react";

type FooterBarProps = {
  isPlayingLofi: boolean;
  onToggleLofi: () => void;
};

export function FooterBar({ isPlayingLofi, onToggleLofi }: FooterBarProps) {
  return (
    <div className="flex items-end justify-between pointer-events-auto">
      <div className="pixel-panel pixel-panel--soft flex items-center gap-3 py-2 px-3">
        <button
          onClick={onToggleLofi}
          className={`pixel-button ${isPlayingLofi ? "pixel-button--primary" : ""} w-8 h-8 rounded-full flex items-center justify-center cursor-pointer`}
        >
          {isPlayingLofi ? (
            <Volume2 className="w-4 h-4 text-emerald-800" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#6a4c34]" />
          )}
        </button>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#6a4c34]">
            MUSIK LATAR
          </span>
          <span className="text-[10px] font-semibold text-[#4b3324] truncate max-w-[160px]">
            {isPlayingLofi ? "Autumn Rain Campfire // Lofi" : "Musik Senyap"}
          </span>
          {isPlayingLofi && (
            <div className="flex gap-0.5 items-end h-2 mt-0.5">
              <span className="w-0.5 h-2 bg-emerald-700 animate-pulse"></span>
              <span className="w-0.5 h-1.5 bg-emerald-700 animate-pulse delay-75"></span>
              <span className="w-0.5 h-3 bg-emerald-700 animate-pulse delay-150"></span>
              <span className="w-0.5 h-1 bg-emerald-700 animate-pulse delay-100"></span>
            </div>
          )}
        </div>
      </div>

      <div className="text-[8px] font-mono tracking-widest pixel-muted uppercase text-right">
        <div>Cozy World // Alpha 0.4</div>
        <div className="mt-0.5">Nestia Dev &copy; 2026</div>
      </div>
    </div>
  );
}
