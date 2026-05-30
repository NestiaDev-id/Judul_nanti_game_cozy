import { motion } from "framer-motion";

export function TitleBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-1.5 pointer-events-auto"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
        <span className="text-[10px] tracking-[0.3em] font-medium text-amber-400/90 uppercase">
          Alpha 0.4
        </span>
      </div>

      <h1 className="text-5xl font-extralight tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 drop-shadow-lg">
        COZY WORLD
      </h1>
      <p className="text-[11px] tracking-[0.45em] text-cyan-300/50 uppercase font-light">
        Eksplorasi & Relaksasi
      </p>
      <div className="w-24 h-[1px] bg-gradient-to-r from-cyan-400/50 to-transparent mt-2"></div>
    </motion.div>
  );
}
