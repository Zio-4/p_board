"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function SpotifyWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Music className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm font-medium">{widget.data.track}</div>
          <div className="text-xs text-muted-foreground">by {widget.data.artist}</div>
          <div className="text-xs text-muted-foreground">from "{widget.data.playlist}"</div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-green-500 h-1 rounded-full" style={{ width: "45%" }}></div>
          </div>
        </div>
      </CardContent>
    </BaseWidget>
  )
}
