export type MainMenuView = "splash" | "home" | "settings" | "gallery" | "saves";
export type MainMenuScreen = Exclude<MainMenuView, "splash">;

export type QualityOption = "Sedang" | "Tinggi";

export type SaveSlot = {
  id: number;
  name: string;
  day: string;
  time: string;
  detail: string;
  playtime: string;
};

export type GalleryItem = {
  title: string;
  region: string;
  desc: string;
  img: string;
};
