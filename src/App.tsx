import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { audio } from "./lib/cozy-audio";
import {
  BackgroundLayer,
  FooterBar,
  LoadingOverlay,
  MenuPanel,
  SplashScreen,
  TitleBlock
} from "./components/main-menu";
import type { GalleryItem, MainMenuScreen, MainMenuView, QualityOption, SaveSlot } from "./components/main-menu";

export default function App() {
  // Screens: 'splash' | 'home' | 'settings' | 'gallery' | 'saves'
  const [activeScreen, setActiveScreen] = useState<MainMenuView>("splash");
  
  // Splash Loading States
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Inisialisasi sistem engine...");

  useEffect(() => {
    if (activeScreen !== "splash") return;
    
    let progress = 0;
    const interval = setInterval(() => {
      // Simulate random loading jumps
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      setLoadingProgress(progress);

      if (progress < 30) setLoadingText("Memuat tekstur dunia & model 3D...");
      else if (progress < 60) setLoadingText("Menghubungkan Bridge Tauri -> Godot...");
      else if (progress < 90) setLoadingText("Mempersiapkan efek suara Lofi & Ambient...");
      else setLoadingText("Aset berhasil dimuat!");

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveScreen("home");
          audio.playSfx("click"); // Play a soft chime when ready
        }, 800);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [activeScreen]);
  
  // States
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  
  // Settings Volume States
  const [masterVol, setMasterVol] = useState(70);
  const [bgmVol, setBgmVol] = useState(50);
  const [sfxVol, setSfxVol] = useState(65);
  
  // Settings Toggle States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vsync, setVsync] = useState(true);
  const [quality, setQuality] = useState<QualityOption>("Tinggi");

  // Save files
  const saveSlots: SaveSlot[] = [
    { id: 1, name: "Desa Greenvale", day: "Hari 15", time: "18:42", detail: "Kabin Kayu, Cuaca Hujan", playtime: "12 Jam" },
    { id: 2, name: "Lembah Emas", day: "Hari 4", time: "09:15", detail: "Tenda Tepi Sungai, Cuaca Cerah", playtime: "2.5 Jam" },
    { id: 3, name: "Pesisir Sunyi", day: "Hari 1", time: "06:00", detail: "Pondok Pantai, Cuaca Berkabut", playtime: "25 Menit" }
  ];

  // Gallery regions
  const galleryItems: GalleryItem[] = [
    { title: "Kabin Musim Gugur", region: "Hutan Greenvale", desc: "Tempat berlindung hangat di bawah naungan pohon pinus merah.", img: "/cozy_cabin.png" },
    { title: "Sungai Gemericik", region: "Lembah Embun", desc: "Aliran air jernih dengan gemericik santai tempat memancing ikan trout.", img: "/cozy_cabin.png" }, // reusing main beautiful image for demo
    { title: "Perapian Tenang", region: "Kabin Utama", desc: "Suara kayu bakar terbakar perlahan menemani malam yang damai.", img: "/cozy_cabin.png" }
  ];

  const handleScreenChange = (screen: MainMenuScreen) => {
    if (screen === "home") {
      audio.playSfx("back");
    } else {
      audio.playSfx("click");
    }
    setActiveScreen(screen);
  };

  const handleHover = (option: string | null) => {
    if (option) {
      audio.playSfx("hover");
    }
  };

  const handleToggleLofi = () => {
    audio.playSfx("click");
    const nextState = !isPlayingLofi;
    setIsPlayingLofi(nextState);
    audio.toggleLofiMusic(nextState);
  };

  const handleToggleFullscreen = () => {
    audio.playSfx("click");
    setIsFullscreen((prev) => !prev);
  };

  const handleToggleVsync = () => {
    audio.playSfx("click");
    setVsync((prev) => !prev);
  };

  const handleQualityChange = (nextQuality: QualityOption) => {
    audio.playSfx("click");
    setQuality(nextQuality);
  };

  // Sync volume state to audio engine
  useEffect(() => {
    audio.updateVolumes(masterVol, bgmVol, sfxVol);
  }, [masterVol, bgmVol, sfxVol]);

  const launchGame = async () => {
    audio.playSfx("click");
    setIsConnecting(true);
    try {
      // Send UDP startup code to Godot via Tauri bridge
      await invoke("send_to_godot", { msg: "START_COZY_WORLD" });
    } catch (e) {
      console.warn("Tauri bridge not detected, simulating connection in standalone browser:", e);
    }
    
    // Smooth loading UI simulation
    setTimeout(() => {
      setIsConnecting(false);
    }, 2500);
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden font-sans text-white select-none bg-[#07080c]">
      <SplashScreen
        active={activeScreen === "splash"}
        loadingProgress={loadingProgress}
        loadingText={loadingText}
      />

      <BackgroundLayer />

      <div className="absolute inset-0 z-10 flex flex-col justify-between py-14 px-14 pointer-events-none">
        <TitleBlock />

        <MenuPanel
          activeScreen={activeScreen}
          saveSlots={saveSlots}
          galleryItems={galleryItems}
          onStartGame={launchGame}
          onNavigate={handleScreenChange}
          onHoverOption={handleHover}
          masterVol={masterVol}
          bgmVol={bgmVol}
          sfxVol={sfxVol}
          isFullscreen={isFullscreen}
          vsync={vsync}
          quality={quality}
          onMasterVolChange={setMasterVol}
          onBgmVolChange={setBgmVol}
          onSfxVolChange={setSfxVol}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleVsync={handleToggleVsync}
          onQualityChange={handleQualityChange}
        />

        <FooterBar isPlayingLofi={isPlayingLofi} onToggleLofi={handleToggleLofi} />
      </div>

      <LoadingOverlay active={isConnecting} />
    </main>
  );
}
