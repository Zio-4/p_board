"use client"

import { useCallback } from "react"
import type { Widget, CanvasState } from "../types/widget"

const WIDGETS_STORAGE_KEY = "dashboard-widgets"
const CANVAS_STORAGE_KEY = "dashboard-canvas"

// Mock server API calls - replace with real API calls later
const mockServerDelay = () => new Promise((resolve) => setTimeout(resolve, 100))

export function usePersistence() {
  // Widget persistence
  const saveWidgets = useCallback(async (widgets: Widget[]) => {
    try {
      // Mock server call
      await mockServerDelay()
      console.log("Saving widgets to server...", widgets.length, "widgets")

      // For now, save to localStorage
      localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets))
      console.log("✅ Widgets saved successfully")
    } catch (error) {
      console.error("❌ Failed to save widgets:", error)
    }
  }, [])

  const loadWidgets = useCallback((): Widget[] | null => {
    try {
      console.log("Loading widgets from server...")
      const stored = localStorage.getItem(WIDGETS_STORAGE_KEY)
      if (stored) {
        const widgets = JSON.parse(stored)
        console.log("✅ Loaded", widgets.length, "widgets from storage")
        return widgets
      }
      console.log("No saved widgets found")
      return null
    } catch (error) {
      console.error("❌ Failed to load widgets:", error)
      return null
    }
  }, [])

  // Canvas state persistence
  const saveCanvasState = useCallback(async (canvasState: CanvasState) => {
    try {
      // Debounce canvas saves to avoid too many calls
      const timeoutId = setTimeout(async () => {
        await mockServerDelay()
        localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(canvasState))
      }, 300)

      // Store timeout ID for potential cleanup
      ;(saveCanvasState as any).timeoutId = timeoutId
    } catch (error) {
      console.error("❌ Failed to save canvas state:", error)
    }
  }, [])

  const loadCanvasState = useCallback((): CanvasState => {
    try {
      const stored = localStorage.getItem(CANVAS_STORAGE_KEY)
      if (stored) {
        const canvasState = JSON.parse(stored)
        console.log("✅ Loaded canvas state from storage")
        return canvasState
      }
    } catch (error) {
      console.error("❌ Failed to load canvas state:", error)
    }

    // Return default canvas state
    return { zoom: 1, panX: 0, panY: 0 }
  }, [])

  // Clear all saved data
  const clearSavedData = useCallback(async () => {
    try {
      await mockServerDelay()
      localStorage.removeItem(WIDGETS_STORAGE_KEY)
      localStorage.removeItem(CANVAS_STORAGE_KEY)
      console.log("✅ Cleared all saved data")
    } catch (error) {
      console.error("❌ Failed to clear saved data:", error)
    }
  }, [])

  return {
    saveWidgets,
    loadWidgets,
    saveCanvasState,
    loadCanvasState,
    clearSavedData,
  }
}
