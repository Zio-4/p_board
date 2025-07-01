import type { IWidget, WidgetConfig, WidgetState, WidgetRenderProps } from '../types/widget'

export abstract class BaseWidgetClass<TData = any, TSettings = any> implements IWidget<TData, TSettings> {
  config: WidgetConfig
  state: WidgetState<TData>
  
  constructor(config: WidgetConfig) {
    this.config = config
    this.state = {
      data: null as TData,
      loading: false,
      error: null,
      lastUpdated: null
    }
  }

  async init(): Promise<void> {
    // Load saved state from localStorage
    const savedState = this.loadFromLocalStorage()
    if (savedState) {
      this.state = savedState
    }
    
    // Fetch initial data
    await this.fetchData()
  }

  abstract fetchData(): Promise<void>
  abstract render(props: WidgetRenderProps): React.ReactElement

  updateSettings(settings: Partial<TSettings>): void {
    this.config.settings = {
      ...this.config.settings,
      ...settings
    }
    this.saveToLocalStorage()
  }

  getData(): TData | null {
    return this.state.data
  }

  dispose(): void {
    // Clean up any intervals, listeners, etc.
  }

  protected setState(updates: Partial<WidgetState<TData>>): void {
    this.state = {
      ...this.state,
      ...updates
    }
    this.saveToLocalStorage()
  }

  protected saveToLocalStorage(): void {
    const key = `widget_${this.config.id}`
    const dataToSave = {
      config: this.config,
      state: this.state
    }
    localStorage.setItem(key, JSON.stringify(dataToSave))
  }

  protected loadFromLocalStorage(): WidgetState<TData> | null {
    const key = `widget_${this.config.id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Update config with saved settings
        if (parsed.config?.settings) {
          this.config.settings = parsed.config.settings
        }
        // Convert lastUpdated back to Date
        if (parsed.state?.lastUpdated) {
          parsed.state.lastUpdated = new Date(parsed.state.lastUpdated)
        }
        return parsed.state
      } catch (e) {
        console.error('Failed to parse saved widget data:', e)
      }
    }
    return null
  }
} 
