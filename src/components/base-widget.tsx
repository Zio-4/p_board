"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import type { Widget } from "../types/widget"
import { useTheme } from "../hooks/use-theme"

interface BaseWidgetProps {
  widget: Widget
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, widgetId: string) => void
  children: React.ReactNode
}

export function BaseWidget({ widget, isDragging, onMouseDown, children }: BaseWidgetProps) {
  const { currentTheme } = useTheme()

  return (
    <Card
      className={`absolute cursor-move border-2 transition-colors hover:shadow-lg ${
        isDragging ? "will-change-transform shadow-xl" : ""
      }`}
      style={
        {
          left: widget.x,
          top: widget.y,
          width: widget.width,
          height: widget.height,
          transform: isDragging ? "translateZ(0)" : undefined,
          backgroundColor: currentTheme.colors.cardBackground,
          borderColor: isDragging ? currentTheme.colors.accent : currentTheme.colors.cardBorder,
          color: currentTheme.colors.text,
          "--muted-foreground": currentTheme.colors.textMuted,
        } as React.CSSProperties
      }
      onMouseDown={(e) => onMouseDown(e, widget.id)}
    >
      <div style={{ color: currentTheme.colors.text }}>{children}</div>
    </Card>
  )
}
