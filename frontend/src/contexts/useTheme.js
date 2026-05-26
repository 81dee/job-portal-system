import { useContext } from "react";
import { ThemeContext } from "./ThemeContextBase.jsx";

export function useTheme() {
  return useContext(ThemeContext);
}

