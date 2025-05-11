import { createContext, useContext } from "react";
import { Theme } from "./ThemeProvider";

export type ThemeContextType = {
    theme:Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
  