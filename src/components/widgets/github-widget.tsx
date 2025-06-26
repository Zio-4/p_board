"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function GithubWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Github className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {widget.data.map((repo: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">{repo.name}</div>
                <div className="text-xs text-muted-foreground">{repo.language}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                ⭐ {repo.stars}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </BaseWidget>
  )
}
