export function BackgroundLayer() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src="/cozy_cabin.png"
        alt="Cozy World Background"
        className="w-full h-full object-cover"
      />
      {/* Warm pastel color grading overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2f2317]/60 via-[#2f2317]/30 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2f2317]/50 via-transparent to-[#2f2317]/20"></div>
    </div>
  );
}
