"use client"

import { useEffect, useRef, useState } from "react"
import type { Widget, WidgetConfig, WidgetRenderProps } from "../types/widget"
import { useWidgetQuery } from "../hooks/use-widget-query"
import { BaseWidgetClass } from "../lib/widget-base"

// Import existing widgets for backward compatibility
import { TodoWidget } from "./widgets/todo-widget"
import { ChartWidget } from "./widgets/chart-widget"
import { EmailWidget } from "./widgets/email-widget"
import { FinancialWidget } from "./widgets/financial-widget"
import { GithubWidget } from "./widgets/github-widget"
import { SpotifyWidget } from "./widgets/spotify-widget"
import { ChatWidget } from "./widgets/chat-widget"
import { CryptoWidget } from "./widgets/crypto-widget"
import { WeatherWidget } from "./widgets/weather-widget"
// import { NotesWidget } from "./widgets/notes-widget"

// Widget registry for React Query widgets
const reactQueryWidgetRegistry: Record<string, new (config: WidgetConfig) => BaseWidgetClass> = {
  'weather': WeatherWidget,
}

interface WidgetFactoryProps {
  widget: Widget
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, widgetId: string) => void
  onDataUpdate: (widgetId: string, newData: any) => void
}

export function WidgetFactory({ widget, isDragging, onMouseDown, onDataUpdate }: WidgetFactoryProps) {
  const [widgetInstance, setWidgetInstance] = useState<BaseWidgetClass | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const instanceRef = useRef<BaseWidgetClass | null>(null)

  // Use React Query for widgets that support it
  const queryResult = useWidgetQuery(widgetInstance!)

  useEffect(() => {
    // Check if this is a React Query widget
    const isReactQueryWidget = reactQueryWidgetRegistry[widget.type]
    
    if (isReactQueryWidget) {
      // Create widget config from widget data
      const config: WidgetConfig = {
        id: widget.id,
        name: widget.title,
        position: {
          x: widget.x,
          y: widget.y
        },
        size: {
          width: widget.width,
          height: widget.height
        },
        settings: widget.data?.settings || {}
      }

      // Create new widget instance
      const WidgetClass = reactQueryWidgetRegistry[widget.type]
      const instance = new WidgetClass(config)
      instance.init()
      
      instanceRef.current = instance
      setWidgetInstance(instance)
      setIsInitialized(true)

      console.log("React Query widget initialized", instance)
    } else {
      // For legacy widgets, mark as initialized immediately
      setIsInitialized(true)
    }
  }, [widget.id, widget.type])

  // Handle settings update
  const handleSettingsUpdate = (widgetId: string, settings: any) => {
    if (instanceRef.current) {
      instanceRef.current.updateSettings(settings)
      // React Query will automatically refetch when queryKey changes
    }
  }

  // Handle data update for legacy widgets
  const handleDataUpdate = (widgetId: string, newData: any) => {
    // For legacy widgets, pass through to parent
    if (!reactQueryWidgetRegistry[widget.type]) {
      onDataUpdate(widgetId, newData)
    }
  }

  // Render React Query widget
  if (widgetInstance && isInitialized && reactQueryWidgetRegistry[widget.type]) {
    const renderProps: WidgetRenderProps & {
      data: any
      isLoading: boolean
      error: Error | null
      refetch: () => void
    } = {
      isDragging,
      onMouseDown,
      onDataUpdate: handleDataUpdate,
      onSettingsUpdate: handleSettingsUpdate,
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      error: queryResult.error,
      refetch: queryResult.refetch
    }
    
    return widgetInstance.render(renderProps)
  }

  // Render legacy widgets
  const props = { widget, isDragging, onMouseDown, onDataUpdate }
  
  switch (widget.type) {
    case "todo":
      return <TodoWidget {...props} />
    case "weather":
      return new WeatherWidget(props).render()
    // case "notes":
    //   return <NotesWidget {...props} />
    case "chart":
      return <ChartWidget {...props} />
    case "email":
      return <EmailWidget {...props} />
    case "financial":
      return <FinancialWidget {...props} />
    case "github":
      return <GithubWidget {...props} />
    case "spotify":
      return <SpotifyWidget {...props} />
    case "chat":
      return <ChatWidget {...props} />
    case "crypto":
      return <CryptoWidget {...props} />
    default:
      return <div>Unknown widget type: {widget.type}</div>
  }
} 
