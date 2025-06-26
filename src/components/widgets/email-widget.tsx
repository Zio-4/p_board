"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function EmailWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {widget.data.map((email: any, index: number) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <div className="text-xs font-medium truncate">{email.from}</div>
                <div className="text-xs text-muted-foreground truncate">{email.subject}</div>
                <div className="text-xs text-muted-foreground">{email.time}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </BaseWidget>
  )
}
