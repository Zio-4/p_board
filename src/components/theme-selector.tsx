"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Palette } from "lucide-react"
import { useTheme } from "../hooks/use-theme"

interface ThemeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { currentTheme, themes, changeTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Choose Theme
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                currentTheme.id === theme.id ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => changeTheme(theme.id)}
              style={{ backgroundColor: theme.colors.cardBackground }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: theme.colors.text }}>
                  {theme.name}
                </span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.background }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
