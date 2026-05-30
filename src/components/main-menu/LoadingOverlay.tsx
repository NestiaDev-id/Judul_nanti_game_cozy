import { AnimatePresence, motion } from "framer-motion";

type LoadingOverlayProps = {
  active: boolean;
};

export function LoadingOverlay({ active }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 bg-[#2b231b]/90 flex flex-col items-center justify-center text-center"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#6fa876] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#bfe8c4]/40 animate-pulse flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#6fa876]"></div>
              </div>
            </div>
          </div>

          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold tracking-[0.25em] uppercase text-[#f6f1e4]"
          >
            Memulai Petualangan
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] tracking-[0.15em] font-mono text-[#d7c39a] uppercase mt-2.5"
          >
            Menghubungkan ke Godot Bridge (Port 9001)
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
