import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [isConnecting, setIsConnecting] = useState(false);

  const launchGame = async () => {
    setIsConnecting(true);
    // Kirim pesan ke Godot lewat UDP port 9001
    await invoke("send_to_godot", { msg: "START_COZY_WORLD" });
    
    // Simulasi loading UI
    setTimeout(() => setIsConnecting(false), 2000);
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#050507] overflow-hidden relative font-sans text-white select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">
        
        {/* Logo / Title Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extralight tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-sm mb-2">
            COZY GAME
          </h1>
          <p className="text-[10px] tracking-[0.5em] text-cyan-500/50 uppercase font-light">
            Procedural World Launcher
          </p>
        </motion.div>

        {/* Action Area */}
        <div className="w-full flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={launchGame}
            disabled={isConnecting}
            className="group relative w-full py-4 bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 rounded-xl overflow-hidden transition-all duration-500 backdrop-blur-md"
          >
            {/* Hover Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative tracking-[0.3em] uppercase text-xs font-light text-cyan-50/80 group-hover:text-cyan-200 transition-colors">
              {isConnecting ? "Establishing Link..." : "Initialize Engine"}
            </span>
            
            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-500 opacity-50"></div>
          </motion.button>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 hover:border-white/10 transition-all">
              Gallery
            </button>
            <button className="flex-1 py-3 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 hover:border-white/10 transition-all">
              Settings
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 text-[8px] font-mono tracking-widest uppercase"
        >
          Bridge Protocol v2.0 // Port 9001 Active
        </motion.div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/10"></div>
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/10"></div>
    </main>
  );
}

export default App;
