"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function ChatWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ScrollArea className="flex-1 mb-2">
          <div className="space-y-2 text-xs">
            <div className="bg-muted p-2 rounded">
              Hi! I can help you analyze your financial data or answer questions about your dashboard.
            </div>
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input placeholder="Ask me anything..." className="text-xs" />
          <Button size="sm" className="px-2">
            Send
          </Button>
        </div>
      </CardContent>
    </BaseWidget>
  )
}
