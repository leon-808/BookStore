import { ReactNode, createContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/global.style";
import { ThemeName, getTheme } from "../styles/theme.style";

const DEFAULT_THEME_NAME = "light";
const THEME_LOCALSTORAGE_KEY = "book_store_theme";

interface State {
  themeName: ThemeName;
  toggleTheme: () => void;
}

const state = {
  themeName: DEFAULT_THEME_NAME as ThemeName,
  toggleTheme: (): void => {},
};

export const ThemeContext = createContext<State>(state);

export const BookStoreThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME_NAME);

  const toggleTheme = (): void => {
    setThemeName(
      themeName === DEFAULT_THEME_NAME ? "dark" : DEFAULT_THEME_NAME
    );
    localStorage.setItem(
      THEME_LOCALSTORAGE_KEY,
      themeName === DEFAULT_THEME_NAME ? "dark" : DEFAULT_THEME_NAME
    );
  };

  useEffect(() => {
    const savedThemeName = localStorage.getItem(
      THEME_LOCALSTORAGE_KEY
    ) as ThemeName;
    setThemeName(savedThemeName || DEFAULT_THEME_NAME);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={getTheme(themeName)}>
        <GlobalStyle themeName={themeName} />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
