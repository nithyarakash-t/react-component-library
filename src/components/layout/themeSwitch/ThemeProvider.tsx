import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
export type Theme = 'light' | 'dark';

const STORAGE_KEY = "theme-preference";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(getColorPreference() ?? 'light');

    useEffect(()=>{
        localStorage.setItem(STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
  
        window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ({matches:isDark}) => {
          setTheme(isDark ? 'dark' : 'light');
        });
  
    },[theme])

    // get color preference on page load
    function getColorPreference() {
        if (localStorage.getItem(STORAGE_KEY)) return localStorage.getItem(STORAGE_KEY) as Theme;
        else return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }   

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          {children}
        </ThemeContext.Provider>
    );
}

