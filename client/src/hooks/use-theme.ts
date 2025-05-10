import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "@/components/ui/theme-provider";

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Always return dark theme during SSR to avoid hydration mismatch
  const currentTheme = isMounted ? theme : "dark";
  
  return {
    theme: currentTheme,
    setTheme,
    isDarkTheme: currentTheme === "dark",
    isLightTheme: currentTheme === "light",
    toggleTheme: () => setTheme(currentTheme === "dark" ? "light" : "dark"),
  };
}
