"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"
import { useTheme } from "../../hooks/use-theme"

export function WeatherWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  const { currentTheme } = useTheme()

  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <Cloud className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
            {widget.data.temperature}°F
          </div>
          <div className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
            {widget.data.condition}
          </div>
          <div className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
            {widget.data.location}
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
            <Droplets className="w-3 h-3" />
            {widget.data.humidity}%
          </div>
          <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
            <Wind className="w-3 h-3" />
            {widget.data.windSpeed} mph
          </div>
        </div>
      </CardContent>
    </BaseWidget>
  )
}
