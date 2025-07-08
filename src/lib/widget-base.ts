import type { WidgetConfig, WidgetRenderProps } from '../types/widget'

export abstract class BaseWidgetClass<TSettings = any> {
  config: WidgetConfig
  
  constructor(config: WidgetConfig) {
    this.config = config
  }

  // Abstract method for rendering - data will be passed from React Query
  abstract render(props: WidgetRenderProps & { 
    data: any
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }): React.ReactElement

  // Settings management (still handled by the class)
  updateSettings(settings: Partial<TSettings>): void {
    this.config.settings = {
      ...this.config.settings,
      ...settings
    }
    this.saveToLocalStorage()
  }

  // Configuration for React Query (query key, enabled state, etc.)
  abstract getQueryConfig(): {
    queryKey: string[]
    enabled: boolean
    staleTime?: number
    refetchInterval?: number
  }

  // Data fetching function to be used by React Query
  abstract fetchData(): Promise<any>

  private saveToLocalStorage(): void {
    const key = `widget_${this.config.id}`
    const dataToSave = {
      config: this.config
    }
    localStorage.setItem(key, JSON.stringify(dataToSave))
  }

  protected loadFromLocalStorage(): void {
    const key = `widget_${this.config.id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Update config with saved settings
        if (parsed.config?.settings) {
          this.config.settings = parsed.config.settings
        }
      } catch (e) {
        console.error('Failed to parse saved widget data:', e)
      }
    }
  }

  // Initialize method to load saved settings
  init(): void {
    this.loadFromLocalStorage()
  }
} 
