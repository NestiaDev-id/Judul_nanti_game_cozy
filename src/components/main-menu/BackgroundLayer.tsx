export function BackgroundLayer() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src="/cozy_cabin.png"
        alt="Cozy World Background"
        className="w-full h-full object-cover"
      />
      {/* Warm cinematic color grading overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
    </div>
  );
}
