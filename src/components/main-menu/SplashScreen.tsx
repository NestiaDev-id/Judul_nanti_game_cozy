import { AnimatePresence, motion } from "framer-motion";

type SplashScreenProps = {
  active: boolean;
  loadingProgress: number;
  loadingText: string;
};

export function SplashScreen({
  active,
  loadingProgress,
  loadingText,
}: SplashScreenProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2b231b]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <h1 className="text-4xl font-extrabold tracking-[0.25em] text-[#f6f1e4] drop-shadow-lg mb-10">
              COZY WORLD
            </h1>
            
            <div className="w-full h-2 bg-[#d8c7a5] rounded-full overflow-hidden mb-4 relative border-2 border-[#b88b5a]">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#6fa876]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>
            
            <div className="flex justify-between w-full text-[9px] font-mono tracking-[0.2em] text-[#d7c39a] uppercase">
              <span className="truncate pr-4">{loadingText}</span>
              <span>{Math.floor(loadingProgress)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
