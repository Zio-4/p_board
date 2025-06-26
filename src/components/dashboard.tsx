"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "./canvas"
import { CanvasControls } from "./canvas-controls"
import { WidgetFactory } from "./widget-factory"
import { WidgetLibrary } from "./widget-library"
import { ThemeSelector } from "./theme-selector"
import { useCanvas } from "../hooks/use-canvas"
import { useDrag } from "../hooks/use-drag"
import { useTheme } from "../hooks/use-theme"
import { initialWidgets } from "../data/mock-data"
import type { Widget, WidgetTemplate } from "../types/widget"
import { usePersistence } from "../hooks/use-persistence"

export default function PersonalDashboard() {
  const { loadWidgets, saveWidgets, clearSavedData } = usePersistence()
  const { currentTheme } = useTheme()
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWidgetLibraryOpen, setIsWidgetLibraryOpen] = useState(false)
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Load saved widgets on mount
  useEffect(() => {
    const savedWidgets = loadWidgets()
    if (savedWidgets && savedWidgets.length > 0) {
      setWidgets(savedWidgets)
    } else {
      setWidgets(initialWidgets)
    }
    setIsLoading(false)
  }, [loadWidgets])

  const { canvas, resetView, zoomIn, zoomOut, handleWheel, updatePan } = useCanvas()
  const { draggedWidget, handleMouseDown } = useDrag(widgets, setWidgets, canvas, canvasRef, updatePan)

  const updateWidgetData = useCallback(
    (widgetId: string, newData: any) => {
      setWidgets((prev) => {
        const updatedWidgets = prev.map((widget) =>
          widget.id === widgetId ? { ...widget, data: { ...widget.data, ...newData } } : widget,
        )
        saveWidgets(updatedWidgets)
        return updatedWidgets
      })
    },
    [saveWidgets],
  )

  const handleResetLayout = useCallback(async () => {
    await clearSavedData()
    setWidgets(initialWidgets)
    resetView()
  }, [clearSavedData, resetView])

  const handleAddWidget = useCallback(
    (template: WidgetTemplate) => {
      const newWidget: Widget = {
        id: `${template.type}-${Date.now()}`,
        type: template.type,
        title: template.name,
        x: Math.random() * 300 + 100, // Random position
        y: Math.random() * 300 + 100,
        width: template.defaultWidth,
        height: template.defaultHeight,
        data: template.defaultData,
      }

      setWidgets((prev) => {
        const updatedWidgets = [...prev, newWidget]
        saveWidgets(updatedWidgets)
        return updatedWidgets
      })
      setIsWidgetLibraryOpen(false)
    },
    [saveWidgets],
  )

  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div style={{ color: currentTheme.colors.text }} className="text-lg">
          Loading your dashboard...
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <CanvasControls
        zoom={canvas.zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onResetLayout={handleResetLayout}
        onOpenWidgetLibrary={() => setIsWidgetLibraryOpen(true)}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
      />

      <Canvas ref={canvasRef} canvas={canvas} onMouseDown={handleMouseDown} onWheel={handleWheel}>
        {widgets.map((widget) => (
          <WidgetFactory
            key={widget.id}
            widget={widget}
            isDragging={draggedWidget === widget.id}
            onMouseDown={handleMouseDown}
            onDataUpdate={updateWidgetData}
          />
        ))}
      </Canvas>

      <WidgetLibrary
        isOpen={isWidgetLibraryOpen}
        onClose={() => setIsWidgetLibraryOpen(false)}
        onAddWidget={handleAddWidget}
      />

      <ThemeSelector isOpen={isThemeSelectorOpen} onClose={() => setIsThemeSelectorOpen(false)} />

      {/* Instructions */}
      <div
        className="absolute bottom-4 right-4 p-3 rounded-lg shadow-lg text-xs max-w-xs"
        style={{
          backgroundColor: currentTheme.colors.cardBackground,
          color: currentTheme.colors.text,
          border: `1px solid ${currentTheme.colors.cardBorder}`,
        }}
      >
        <div className="font-medium mb-1">Controls:</div>
        <div>• Drag widgets to move them</div>
        <div>• Scroll to zoom in/out</div>
        <div>• Drag empty space to pan</div>
        <div>• Click Library to add widgets</div>
        <div>• Click Palette to change themes</div>
        <div className="text-green-600 mt-2">✅ Auto-saves your layout</div>
      </div>
    </div>
  )
}
