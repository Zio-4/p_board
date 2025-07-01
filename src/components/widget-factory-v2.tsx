"use client"

import { useEffect, useRef, useState } from "react"
import type { Widget, WidgetConfig, IWidget, WidgetRenderProps } from "../types/widget"
import { NotesWidgetClass } from "./widgets/notes-widget-v2"
import { WeatherWidgetClass } from "./widgets/weather-widget-v2"

// Import existing widgets for backward compatibility
import { TodoWidget } from "./widgets/todo-widget"
import { ChartWidget } from "./widgets/chart-widget"
import { EmailWidget } from "./widgets/email-widget"
import { FinancialWidget } from "./widgets/financial-widget"
import { GithubWidget } from "./widgets/github-widget"
import { SpotifyWidget } from "./widgets/spotify-widget"
import { ChatWidget } from "./widgets/chat-widget"
import { CryptoWidget } from "./widgets/crypto-widget"

// Widget registry for new modular widgets
const widgetRegistry: Record<string, new (config: WidgetConfig) => IWidget> = {
  'notes-v2': NotesWidgetClass,
  'weather-v2': WeatherWidgetClass,
}

interface WidgetFactoryV2Props {
  widget: Widget
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, widgetId: string) => void
  onDataUpdate: (widgetId: string, newData: any) => void
}

export function WidgetFactoryV2({ widget, isDragging, onMouseDown, onDataUpdate }: WidgetFactoryV2Props) {
  const [widgetInstance, setWidgetInstance] = useState<IWidget | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const instanceRef = useRef<IWidget | null>(null)

  useEffect(() => {
    // Check if this is a new modular widget type
    const isModularWidget = widget.type.endsWith('-v2')
    
    if (isModularWidget && widgetRegistry[widget.type]) {
      // Create widget config from legacy widget data
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
      const WidgetClass = widgetRegistry[widget.type]
      const instance = new WidgetClass(config)
      instanceRef.current = instance
      setWidgetInstance(instance)

      // Initialize the widget
      instance.init().then(() => {
        setIsInitialized(true)
      })

      // Cleanup on unmount
      return () => {
        if (instanceRef.current?.dispose) {
          instanceRef.current.dispose()
        }
      }
    } else {
      // For legacy widgets, mark as initialized immediately
      setIsInitialized(true)
    }
  }, [widget.id, widget.type])

  // Handle settings update
  const handleSettingsUpdate = (widgetId: string, settings: any) => {
    if (instanceRef.current) {
      instanceRef.current.updateSettings(settings)
    }
  }

  // Handle data update for modular widgets
  const handleDataUpdate = (widgetId: string, newData: any) => {
    // For legacy widgets, pass through to parent
    if (!widget.type.endsWith('-v2')) {
      onDataUpdate(widgetId, newData)
      return
    }
    
    // For modular widgets, handle differently based on widget type
    if (widget.type === 'notes-v2' && instanceRef.current) {
      (instanceRef.current as NotesWidgetClass).updateContent(newData.content)
    }
  }

  // Render modular widget
  if (widgetInstance && isInitialized) {
    const renderProps: WidgetRenderProps = {
      isDragging,
      onMouseDown,
      onDataUpdate: handleDataUpdate,
      onSettingsUpdate: handleSettingsUpdate
    }
    
    return widgetInstance.render(renderProps)
  }

  // Render legacy widgets
  const props = { widget, isDragging, onMouseDown, onDataUpdate }
  
  switch (widget.type) {
    case "todo":
      return <TodoWidget {...props} />
    case "weather":
      return <WeatherWidget {...props} />
    case "notes":
      return <NotesWidget {...props} />
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

// Need to import legacy NotesWidget for backward compatibility
import { NotesWidget } from "./widgets/notes-widget"
import { WeatherWidget } from "./widgets/weather-widget" 
