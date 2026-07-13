import { useState } from "react";
import { PaletteKey, FontKey } from "@/types";
import { PALETTES } from "@/i18n/content";

export function useTheme() {
  const [palette, setPaletteState] = useState<PaletteKey>(
    () => (typeof window !== "undefined" && window.localStorage.getItem("astris_palette") as PaletteKey) || "verde"
  );
  const [darkMode, setDarkModeState] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("astris_dark") === "true"
  );
  const [font, setFontState] = useState<FontKey>(
    () => (typeof window !== "undefined" && window.localStorage.getItem("astris_font") as FontKey) || "inter"
  );

  const setPalette = (p: PaletteKey) => { 
    setPaletteState(p); 
    window.localStorage.setItem("astris_palette", p); 
  };
  
  const setDarkMode = (d: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const next = typeof d === "function" ? d(prev) : d;
      window.localStorage.setItem("astris_dark", String(next));
      return next;
    });
  };
  
  const setFont = (f: FontKey) => { 
    setFontState(f); 
    window.localStorage.setItem("astris_font", f); 
  };

  const fontFamily = font === "lexend" ? "'Lexend', Inter, sans-serif" : "'Inter', sans-serif";

  const darkRootStyle: Record<string, string> = darkMode ? {
    "--background": "#0D1824",
    "--foreground": "#E8EDF5",
    "--card": "#152030",
    "--popover": "#152030",
    "--primary": "#4B8EC8",
    "--primary-foreground": "#0D1824",
    "--secondary": "#1A2D42",
    "--secondary-foreground": "#E8EDF5",
    "--muted": "#152030",
    "--muted-foreground": "#7A9CC0",
    "--accent": "#3D9BC5",
    "--accent-foreground": "#0D1824",
    "--border": "rgba(255,255,255,0.1)",
    "--input-background": "#152030",
    "--card-foreground": "#E8EDF5",
  } : {};

  const pal = PALETTES[palette];
  const palStyle: Record<string, string> = {
    "--background": darkMode ? "#1A1A2E" : pal.bg,
    "--foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--card": darkMode ? "#252535" : pal.card,
    "--card-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--primary": pal.accent,
    "--primary-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--secondary": darkMode ? "#303045" : pal.border,
    "--secondary-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--border": darkMode ? "rgba(255,255,255,0.1)" : pal.border,
    "--muted": darkMode ? "#2A2A3E" : pal.bg,
    "--muted-foreground": darkMode ? "#A8A8C8" : "#6A6A66",
    "--accent": pal.accent,
    "--accent-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--input-background": darkMode ? "#1A1A2E" : pal.card,
  };

  return {
    palette,
    darkMode,
    font,
    setPalette,
    setDarkMode,
    setFont,
    fontFamily,
    darkRootStyle,
    palStyle
  };
}
