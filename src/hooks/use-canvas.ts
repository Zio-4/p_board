"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { CanvasState } from "../types/widget"

export function useCanvas() {
  const [canvas, setCanvas] = useState<CanvasState>({ zoom: 1, panX: 0, panY: 0 })

  const resetView = useCallback(() => {
    setCanvas({ zoom: 1, panX: 0, panY: 0 })
  }, [])

  const zoomIn = useCallback(() => {
    setCanvas((prev) => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.2) }))
  }, [])

  const zoomOut = useCallback(() => {
    setCanvas((prev) => ({ ...prev, zoom: Math.max(0.1, prev.zoom * 0.8) }))
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(3, canvas.zoom * delta))
      setCanvas((prev) => ({ ...prev, zoom: newZoom }))
    },
    [canvas.zoom],
  )

  const updatePan = useCallback((panX: number, panY: number) => {
    setCanvas((prev) => ({ ...prev, panX, panY }))
  }, [])

  return {
    canvas,
    resetView,
    zoomIn,
    zoomOut,
    handleWheel,
    updatePan,
  }
}
