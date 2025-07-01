import type React from "react"

// Core widget data structure
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

// New widget configuration structure
export interface WidgetConfig {
  id: string
  name: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  settings?: Record<string, any> // For API keys, refresh intervals, etc.
}

// Widget state interface
export interface WidgetState<T = any> {
  data: T
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

// Base widget interface that all widgets must implement
export interface IWidget<TData = any, TSettings = any> {
  config: WidgetConfig
  state: WidgetState<TData>
  
  // Lifecycle methods
  init(): Promise<void>
  fetchData(): Promise<void>
  render(props: WidgetRenderProps): React.ReactElement
  dispose?(): void
  
  // State management
  updateSettings(settings: Partial<TSettings>): void
  getData(): TData | null
}

// Props passed to widget render method
export interface WidgetRenderProps {
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, widgetId: string) => void
  onDataUpdate: (widgetId: string, newData: any) => void
  onSettingsUpdate: (widgetId: string, settings: any) => void
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
