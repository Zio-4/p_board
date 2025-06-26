"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"

export function CryptoWidget({ widget, isDragging, onMouseDown }: WidgetProps) {
  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">₿ {widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {widget.data.coins.map((coin: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">{coin.symbol}</div>
                <div className="text-xs text-muted-foreground">{coin.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold">${coin.price.toLocaleString()}</div>
                <Badge
                  variant="outline"
                  className={`text-xs ${coin.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                >
                  {coin.change.startsWith("+") ? (
                    <TrendingUp className="w-2 h-2 mr-1" />
                  ) : (
                    <TrendingDown className="w-2 h-2 mr-1" />
                  )}
                  {coin.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </BaseWidget>
  )
}
