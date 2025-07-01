# Widget Development Guide

This guide explains how to create custom widgets for the personal dashboard using our modular widget system.

## Widget Structure

All widgets must extend the `BaseWidgetClass` and implement the `IWidget` interface. This ensures consistency and allows the community to easily add new widgets.

### Core Concepts

1. **Widget Configuration**: Stores widget metadata, position, size, and settings (like API keys)
2. **Widget State**: Manages the widget's data, loading state, errors, and last update time
3. **Lifecycle Methods**: Initialize, fetch data, render, and cleanup
4. **Local Storage**: Automatic persistence of widget state and settings

## Creating a New Widget

Here's a step-by-step guide to create a custom widget:

### 1. Define Your Data Types

```typescript
// Define the data structure your widget will display
interface MyWidgetData {
  title: string
  value: number
  // Add other fields as needed
}

// Define settings structure (for user configuration)
interface MyWidgetSettings {
  apiKey?: string
  refreshInterval?: number
  // Add other settings as needed
}
```

### 2. Create the Widget Class

```typescript
import { BaseWidgetClass } from "@/lib/widget-base"
import type { WidgetConfig, WidgetRenderProps } from "@/types/widget"

export class MyWidgetClass extends BaseWidgetClass<MyWidgetData, MyWidgetSettings> {
  constructor(config: WidgetConfig) {
    super(config)
    
    // Initialize default settings if needed
    if (!this.config.settings) {
      this.config.settings = {
        refreshInterval: 30 // minutes
      }
    }
  }

  async fetchData(): Promise<void> {
    // Set loading state
    this.setState({ loading: true, error: null })

    try {
      // Fetch your data here
      const data = await fetchMyData(this.config.settings)
      
      // Update state with fetched data
      this.setState({
        data: data,
        loading: false,
        error: null,
        lastUpdated: new Date()
      })
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data"
      })
    }
  }

  render(props: WidgetRenderProps): React.ReactElement {
    return <MyWidgetComponent widget={this} {...props} />
  }
}
```

### 3. Create the React Component

```typescript
function MyWidgetComponent({ 
  widget, 
  isDragging, 
  onMouseDown 
}: WidgetRenderProps & { widget: MyWidgetClass }) {
  const { currentTheme } = useTheme()
  
  // Convert to legacy widget format for BaseWidget
  const widgetProps = {
    id: widget.config.id,
    type: "my-widget",
    title: widget.config.name,
    x: widget.config.position.x,
    y: widget.config.position.y,
    width: widget.config.size.width,
    height: widget.config.size.height,
    data: widget.state.data
  }

  return (
    <BaseWidget widget={widgetProps} isDragging={isDragging} onMouseDown={onMouseDown}>
      {/* Your widget UI here */}
    </BaseWidget>
  )
}
```

## Widget Features

### Auto-Save to LocalStorage

The `BaseWidgetClass` automatically saves widget state and settings to localStorage. This happens whenever:
- State is updated via `setState()`
- Settings are updated via `updateSettings()`

### Settings Management

Widgets can have user-configurable settings (API keys, locations, etc.):

```typescript
widget.updateSettings({
  apiKey: "new-api-key",
  location: "London"
})
```

### Auto-Refresh

Set up automatic data refresh in your widget's `init()` method:

```typescript
async init(): Promise<void> {
  await super.init()
  
  // Set up auto-refresh
  const interval = (this.config.settings?.refreshInterval || 30) * 60 * 1000
  this.refreshInterval = setInterval(() => {
    this.fetchData()
  }, interval)
}

dispose(): void {
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval)
  }
}
```

## Registering Your Widget

Add your widget to the widget registry in `widget-factory-v2.tsx`:

```typescript
const widgetRegistry: Record<string, new (config: WidgetConfig) => IWidget> = {
  'notes-v2': NotesWidgetClass,
  'weather-v2': WeatherWidgetClass,
  'my-widget': MyWidgetClass, // Add your widget here
}
```

And add a template in `widget-templates.ts`:

```typescript
{
  id: "my-widget",
  name: "My Custom Widget",
  description: "Description of what your widget does",
  type: "my-widget",
  defaultWidth: 300,
  defaultHeight: 200,
  defaultData: {},
  icon: "🎯",
  category: "Custom",
}
```

## Best Practices

1. **Error Handling**: Always handle errors gracefully and show user-friendly messages
2. **Loading States**: Show loading indicators while fetching data
3. **Settings UI**: Provide an intuitive settings interface for configuration
4. **Responsive Design**: Ensure your widget works well at different sizes
5. **Theme Support**: Use the theme system for consistent styling
6. **Performance**: Implement cleanup in `dispose()` method
7. **Documentation**: Include clear documentation for your widget's features and settings

## Example Widgets

Check out these example implementations:
- `notes-widget-v2.tsx`: Simple widget with local data storage
- `weather-widget-v2.tsx`: Widget with API integration and settings management 
