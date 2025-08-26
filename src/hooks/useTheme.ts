import { useState, useEffect } from 'react';
import { Theme } from '@/types/assignment';

const THEME_STORAGE_KEY = 'homework-tracker-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('white-gold');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidTheme(stored)) {
      setTheme(stored as Theme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme data attributes
    const themes: Theme[] = ['white-gold', 'sunset', 'ocean', 'forest', 'cherry', 'midnight'];
    themes.forEach(t => root.removeAttribute(`data-theme`));
    
    // Apply current theme (except for default white-gold)
    if (theme !== 'white-gold') {
      root.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}

function isValidTheme(value: string): value is Theme {
  return ['white-gold', 'sunset', 'ocean', 'forest', 'cherry', 'midnight'].includes(value);
}