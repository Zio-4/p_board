"use client"

import type React from "react"
import { forwardRef, useMemo } from "react"
import type { CanvasState } from "../types/widget"
import { useTheme } from "../hooks/use-theme"

interface CanvasProps {
  canvas: CanvasState
  onMouseDown: (e: React.MouseEvent) => void
  onWheel: (e: React.WheelEvent) => void
  children: React.ReactNode
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({ canvas, onMouseDown, onWheel, children }, ref) => {
  const { currentTheme } = useTheme()

  const canvasTransform = useMemo(
    () => ({
      transform: `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`,
    }),
    [canvas.panX, canvas.panY, canvas.zoom],
  )

  return (
    <div
      ref={ref}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onWheel={onWheel}
    >
      <div
        className="relative origin-top-left will-change-transform"
        style={{
          ...canvasTransform,
          width: "200%",
          height: "200%",
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
                linear-gradient(to right, ${currentTheme.colors.grid} 1px, transparent 1px),
                linear-gradient(to bottom, ${currentTheme.colors.grid} 1px, transparent 1px)
              `,
            backgroundSize: "50px 50px",
          }}
        />
        {children}
      </div>
    </div>
  )
})

Canvas.displayName = "Canvas"
