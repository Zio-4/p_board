"use client"

import { useState, useCallback, useEffect } from "react"
import { themes } from "../data/themes"
import type { Theme } from "../types/widget"

const THEME_STORAGE_KEY = "dashboard-theme"

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  useEffect(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedThemeId) {
      const theme = themes.find((t) => t.id === savedThemeId)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
  }, [])

  const changeTheme = useCallback((themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem(THEME_STORAGE_KEY, themeId)
    }
  }, [])

  return {
    currentTheme,
    themes,
    changeTheme,
  }
}
