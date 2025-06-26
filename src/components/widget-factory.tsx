import { FinancialWidget } from "./widgets/financial-widget"
import { ChartWidget } from "./widgets/chart-widget"
import { NotesWidget } from "./widgets/notes-widget"
import { EmailWidget } from "./widgets/email-widget"
import { GithubWidget } from "./widgets/github-widget"
import { SpotifyWidget } from "./widgets/spotify-widget"
import { ChatWidget } from "./widgets/chat-widget"
import { WeatherWidget } from "./widgets/weather-widget"
import { TodoWidget } from "./widgets/todo-widget"
import { CryptoWidget } from "./widgets/crypto-widget"
import type { WidgetProps } from "../types/widget"

export function WidgetFactory(props: WidgetProps) {
  switch (props.widget.type) {
    case "financial":
      return <FinancialWidget {...props} />
    case "chart":
      return <ChartWidget {...props} />
    case "notes":
      return <NotesWidget {...props} />
    case "email":
      return <EmailWidget {...props} />
    case "github":
      return <GithubWidget {...props} />
    case "spotify":
      return <SpotifyWidget {...props} />
    case "chat":
      return <ChatWidget {...props} />
    case "weather":
      return <WeatherWidget {...props} />
    case "todo":
      return <TodoWidget {...props} />
    case "crypto":
      return <CryptoWidget {...props} />
    default:
      return null
  }
}
