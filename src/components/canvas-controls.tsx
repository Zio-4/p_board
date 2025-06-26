"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, RotateCcw, Library, Palette } from "lucide-react"

interface CanvasControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onResetLayout: () => void
  onOpenWidgetLibrary: () => void
  onOpenThemeSelector: () => void
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onResetLayout,
  onOpenWidgetLibrary,
  onOpenThemeSelector,
}: CanvasControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <Button size="sm" onClick={onZoomIn} variant="outline">
        <Plus className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={onZoomOut} variant="outline">
        <Minus className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={onResetView} variant="outline">
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={onOpenWidgetLibrary} variant="outline">
        <Library className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={onOpenThemeSelector} variant="outline">
        <Palette className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={onResetLayout} variant="destructive">
        Reset Layout
      </Button>
      <Badge variant="secondary">Zoom: {Math.round(zoom * 100)}%</Badge>
    </div>
  )
}
