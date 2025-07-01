"use client"

import React, { useEffect, useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind, MapPin, AlertCircle } from "lucide-react"
import { BaseWidget } from "../base-widget"
import { BaseWidgetClass } from "../../lib/widget-base"
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

// Weather widget class
export class WeatherWidgetClass extends BaseWidgetClass<WeatherData, WeatherSettings> {
  private refreshInterval?: NodeJS.Timeout

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

  async init(): Promise<void> {
    await super.init()
    
    // Set up auto-refresh
    const interval = (this.config.settings?.refreshInterval || 30) * 60 * 1000
    this.refreshInterval = setInterval(() => {
      this.fetchData()
    }, interval)
  }

  async fetchData(): Promise<void> {
    const { apiKey, location, units } = this.config.settings || {}
    
    if (!apiKey) {
      this.setState({
        loading: false,
        error: "API key not configured. Please add your OpenWeatherMap API key in settings."
      })
      return
    }

    if (!location) {
      this.setState({
        loading: false,
        error: "Location not set. Please configure your location in settings."
      })
      return
    }

    this.setState({ loading: true, error: null })

    try {
      const url = `https://api.openweathermap.org/data/2.5/wea      // OpenWeatherMap API endpoint
ther?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units || 'imperial'}`
      
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
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        location: `${data.name}, ${data.sys.country}`,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        icon: data.weather[0].icon
      }

      this.setState({
        data: weatherData,
        loading: false,
        error: null,
        lastUpdated: new Date()
      })
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch weather data"
      })
    }
  }

  dispose(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }

  render(props: WidgetRenderProps): React.ReactElement {
    return <WeatherWidgetComponent widget={this} {...props} />
  }
}

// React component for rendering
function WeatherWidgetComponent({ 
  widget, 
  isDragging, 
  onMouseDown,
  onSettingsUpdate 
}: WidgetRenderProps & { widget: WeatherWidgetClass }) {
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
    data: widget.state.data
  }

  const handleSaveSettings = () => {
    widget.updateSettings({
      apiKey,
      location
    })
    setShowSettings(false)
    // Refetch data with new settings
    widget.fetchData()
  }

  useEffect(() => {
    // Check if we need to show settings on first load
    if (!widget.config.settings?.apiKey) {
      setShowSettings(true)
    }
  }, [])

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
        ) : widget.state.loading ? (
          <div className="text-center py-4" style={{ color: currentTheme.colors.textMuted }}>
            Loading...
          </div>
        ) : widget.state.error ? (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: currentTheme.colors.textMuted }} />
            <div className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
              {widget.state.error}
            </div>
          </div>
        ) : widget.state.data ? (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                {widget.state.data.temperature}°{widget.config.settings?.units === 'metric' ? 'C' : 'F'}
              </div>
              <div className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
                {widget.state.data.condition}
              </div>
              <div className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                Feels like {widget.state.data.feelsLike}°
              </div>
              <div className="flex items-center justify-center gap-1 text-xs mt-1" style={{ color: currentTheme.colors.textMuted }}>
                <MapPin className="w-3 h-3" />
                {widget.state.data.location}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
                <Droplets className="w-3 h-3" />
                {widget.state.data.humidity}%
              </div>
              <div className="flex items-center gap-1" style={{ color: currentTheme.colors.textMuted }}>
                <Wind className="w-3 h-3" />
                {widget.state.data.windSpeed} {widget.config.settings?.units === 'metric' ? 'km/h' : 'mph'}
              </div>
            </div>
            {widget.state.lastUpdated && (
              <div className="text-xs text-center" style={{ color: currentTheme.colors.textMuted }}>
                Updated: {widget.state.lastUpdated.toLocaleTimeString()}
              </div>
            )}
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
