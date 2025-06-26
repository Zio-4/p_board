"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function ChartWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isDragging && (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={widget.data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Line type="monotone" dataKey="ally" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="robinhood" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {isDragging && (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            Chart hidden while dragging
          </div>
        )}
      </CardContent>
    </BaseWidget>
  )
}
