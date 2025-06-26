"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"
import { useTheme } from "../../hooks/use-theme"

export function FinancialWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  const { currentTheme } = useTheme()

  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <DollarSign className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
            Ally Bank
          </span>
          <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
            ${widget.data.ally.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
            Robinhood
          </span>
          <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
            ${widget.data.robinhood.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between items-center pt-2"
          style={{ borderTopColor: currentTheme.colors.cardBorder, borderTopWidth: "1px" }}
        >
          <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
            Total
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: currentTheme.colors.text }}>
              ${(widget.data.ally + widget.data.robinhood).toLocaleString()}
            </span>
            <Badge variant="secondary" className="text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {widget.data.change}
            </Badge>
          </div>
        </div>
      </CardContent>
    </BaseWidget>
  )
}
