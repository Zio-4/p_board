import type React from "react"

export interface Widget {
  id: string
  type: string
  title: string
  x: number
  y: number
  width: number
  height: number
  data?: any
}

export interface CanvasState {
  zoom: number
  panX: number
  panY: number
}

export interface WidgetProps {
  widget: Widget
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, widgetId: string) => void
  onDataUpdate: (widgetId: string, newData: any) => void
}

export interface WidgetTemplate {
  id: string
  name: string
  description: string
  type: string
  defaultWidth: number
  defaultHeight: number
  defaultData: any
  icon: string
  category: string
}

export interface Theme {
  id: string
  name: string
  colors: {
    background: string
    cardBackground: string
    cardBorder: string
    text: string
    textMuted: string
    accent: string
    grid: string
  }
}
