"use client"

import React, { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind, MapPin, AlertCircle, RefreshCw } from "lucide-react"
import { BaseWidget } from "../base-widget"
import { BaseWidgetClass } from "../../lib/widget-base"
import { useWidgetQuery } from "../../hooks/use-widget-query"
import type { WidgetConfig, WidgetRenderProps } from "../../types/widget"
import { useTheme } from "../../hooks/use-theme"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Define the data structure for weather
interface WeatherData {
  temperature: number
  feelsLike: number
  condition: string
  description: string
  location: string
  humidity: number
  windSpeed: number
  icon: string
}

// Define settings structure
interface WeatherSettings {
  apiKey?: string
  location?: string
  units?: 'metric' | 'imperial'
  refreshInterval?: number // in minutes
}

// Weather widget class using React Query
export class WeatherWidget extends BaseWidgetClass<WeatherSettings> {
  constructor(config: WidgetConfig) {
    super(config)
    
    // Initialize with default settings
    if (!this.config.settings) {
      this.config.settings = {
        units: 'imperial',
        refreshInterval: 30,
        location: 'New York'
      }
    }
  }

  getQueryConfig() {
    const { apiKey, location, refreshInterval } = this.config.settings || {}
    
    return {
      queryKey: ['weather', this.config.id, location, apiKey],
      enabled: !!(apiKey && location),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: refreshInterval ? refreshInterval * 60 * 1000 : 1000 * 60 * 30, // 30 minutes default
    }
  }

  async fetchData(): Promise<WeatherData> {
    const { apiKey, location, units } = this.config.settings || {}
    
    if (!apiKey) {
      throw new Error("API key not configured. Please add your OpenWeatherMap API key in settings.")
    }

    if (!location) {
      throw new Error("Location not set. Please configure your location in settings.")
    }

    // OpenWeatherMap API endpoint
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units || 'imperial'}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key")
      } else if (response.status === 404) {
        throw new Error("Location not found")
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    }

    const data = await response.json()
    
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      location: `${data.name}, ${data.sys.country}`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      icon: data.weather[0].icon
    }
  }

  render(props: WidgetRenderProps & { 
    data: WeatherData | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }): React.ReactElement {
    return <WeatherWidgetComponent widget={this} {...props} />
  }
}

// React component for rendering with React Query integration
function WeatherWidgetComponent({ 
  widget, 
  isDragging, 
  onMouseDown,
  data,
  isLoading,
  error,
  refetch
}: WidgetRenderProps & { 
  widget: WeatherWidget
  data: WeatherData | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}) {
  const { currentTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(widget.config.settings?.apiKey || '')
  const [location, setLocation] = useState(widget.config.settings?.location || '')

  // Create a widget object that matches the expected structure
  const widgetProps = {
    id: widget.config.id,
    type: "weather",
    title: widget.config.name,
    x: widget.config.position.x,
    y: widget.config.position.y,
    width: widget.config.size.width,
    height: widget.config.size.height,
    data: data
  }

  const handleSaveSettings = () => {
    widget.updateSettings({
      apiKey,
      location
    })
    setShowSettings(false)
    // React Query will automatically refetch when queryKey changes
  }

  useEffect(() => {
    // Check if we need to show settings on first load
    if (!widget.config.settings?.apiKey) {
      setShowSettings(true)
    }
  }, [widget.config.settings?.apiKey])

  return (
    <BaseWidget widget={widgetProps} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <Cloud className="w-4 h-4" />
          {widget.config.name}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-6 w-6 p-0"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showSettings ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                API Key (Get one free at openweathermap.org)
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., London, UK"
                className="mt-1"
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-4" style={{ color: currentTheme.colors.textMuted }}>
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
            Loading weather data...
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: currentTheme.colors.textMuted }} />
            <div className="text-xs mb-2" style={{ color: currentTheme.colors.textMuted }}>
              {error.message}
            </div>
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                {data.temperature}°{widget.config.settings?.units === 'metric' ? 'C' : 'F'}
              </div>
              <div className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
                {data.condition}
              </div>
              <div className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                Feels like {data.feelsLike}°
              </div>
              <div className="flex items-center justify-center gap-1 text-xs mt-1" style={{ color: currentTheme.colors.textMuted }}>
                <MapPin className="w-3 h-3" />
                {data.location}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
                <Droplets className="w-3 h-3" />
                {data.humidity}%
              </div>
              <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
                <Wind className="w-3 h-3" />
                {data.windSpeed} {widget.config.settings?.units === 'metric' ? 'km/h' : 'mph'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4" style={{ color: currentTheme.colors.textMuted }}>
            No data available
          </div>
        )}
      </CardContent>
    </BaseWidget>
  )
} 
