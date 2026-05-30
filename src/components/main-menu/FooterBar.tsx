import { Volume2, VolumeX } from "lucide-react";

type FooterBarProps = {
  isPlayingLofi: boolean;
  onToggleLofi: () => void;
};

export function FooterBar({ isPlayingLofi, onToggleLofi }: FooterBarProps) {
  return (
    <div className="flex items-end justify-between pointer-events-auto">
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/[0.08] py-2.5 px-4 rounded-xl">
        <button
          onClick={onToggleLofi}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${isPlayingLofi ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {isPlayingLofi ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
            MUSIK LATAR
          </span>
          <span className="text-[10px] font-light text-slate-200 truncate max-w-[160px]">
            {isPlayingLofi ? "Autumn Rain Campfire // Lofi" : "Musik Senyap"}
          </span>
          {isPlayingLofi && (
            <div className="flex gap-0.5 items-end h-2 mt-0.5">
              <span className="w-0.5 h-2 bg-amber-500 animate-pulse"></span>
              <span className="w-0.5 h-1.5 bg-amber-500 animate-pulse delay-75"></span>
              <span className="w-0.5 h-3 bg-amber-500 animate-pulse delay-150"></span>
              <span className="w-0.5 h-1 bg-amber-500 animate-pulse delay-100"></span>
            </div>
          )}
        </div>
      </div>

      <div className="text-[8px] font-mono tracking-widest text-white/30 uppercase text-right">
        <div>Cozy World // Alpha 0.4</div>
        <div className="mt-0.5">Nestia Dev &copy; 2026</div>
      </div>
    </div>
  );
}
