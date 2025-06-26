"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"
import { useTheme } from "../../hooks/use-theme"

export function NotesWidget({ widget, isDragging, onMouseDown, onDataUpdate }: WidgetProps) {
  const { currentTheme } = useTheme()

  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <StickyNote className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={widget.data.content}
          onChange={(e) => onDataUpdate(widget.id, { content: e.target.value })}
          className="resize-none border-none p-0 focus-visible:ring-0"
          style={{
            backgroundColor: "transparent",
            color: currentTheme.colors.text,
          }}
          placeholder="Add your notes here..."
        />
      </CardContent>
    </BaseWidget>
  )
}
