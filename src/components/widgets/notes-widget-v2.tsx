"use client"

import React from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote } from "lucide-react"
import { BaseWidget } from "../base-widget"
import { BaseWidgetClass } from "../../lib/widget-base"
import type { WidgetConfig, WidgetRenderProps } from "../../types/widget"
import { useTheme } from "../../hooks/use-theme"

// Define the data structure for notes
interface NotesData {
  content: string
}

// Define settings structure (none for notes widget)
type NotesSettings = Record<string, never>

// Notes widget class
export class NotesWidgetClass extends BaseWidgetClass<NotesData, NotesSettings> {
  constructor(config: WidgetConfig) {
    super(config)
    
    // Initialize with default data if not loaded from localStorage
    if (!this.state.data) {
      this.state.data = {
        content: ""
      }
    }
  }

  async fetchData(): Promise<void> {
    // Notes widget doesn't fetch external data
    // Just ensure data is initialized
    if (!this.state.data) {
      this.setState({
        data: { content: "" },
        loading: false,
        lastUpdated: new Date()
      })
    }
  }

  updateContent(content: string): void {
    this.setState({
      data: { content },
      lastUpdated: new Date()
    })
  }

  render(props: WidgetRenderProps): React.ReactElement {
    return <NotesWidgetComponent widget={this} {...props} />
  }
}

// React component for rendering
function NotesWidgetComponent({ 
  widget, 
  isDragging, 
  onMouseDown 
}: WidgetRenderProps & { widget: NotesWidgetClass }) {
  const { currentTheme } = useTheme()
  const data = widget.state.data || { content: "" }

  // Create a widget object that matches the expected structure
  const widgetProps = {
    id: widget.config.id,
    type: "notes",
    title: widget.config.name,
    x: widget.config.position.x,
    y: widget.config.position.y,
    width: widget.config.size.width,
    height: widget.config.size.height,
    data: data
  }

  return (
    <BaseWidget widget={widgetProps} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <StickyNote className="w-4 h-4" />
          {widget.config.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={data.content}
          onChange={(e) => widget.updateContent(e.target.value)}
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
