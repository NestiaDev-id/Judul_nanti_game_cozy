import { motion } from "framer-motion";

export function TitleBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-2 pointer-events-auto"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="pixel-badge px-2 py-0.5 text-[9px]">ALPHA 0.4</span>
      </div>

      <h1 className="text-5xl font-extrabold tracking-[0.18em] pixel-title">
        COZY WORLD
      </h1>
      <p className="text-[11px] tracking-[0.35em] uppercase pixel-muted font-semibold">
        Eksplorasi & Relaksasi
      </p>
      <div className="w-24 h-[2px] bg-[#d7c39a] mt-2"></div>
    </motion.div>
  );
}
