"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckSquare, Plus } from "lucide-react"
import { BaseWidget } from "../base-widget"
import type { WidgetProps } from "../../types/widget"
import { useState } from "react"
import { useTheme } from "../../hooks/use-theme"

export function TodoWidget({ widget, isDragging, onMouseDown, onDataUpdate }: WidgetProps) {
  const { currentTheme } = useTheme()
  const [newTask, setNewTask] = useState("")

  const toggleTask = (taskId: number) => {
    const updatedTasks = widget.data.tasks.map((task: any) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )
    onDataUpdate(widget.id, { tasks: updatedTasks })
  }

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      }
      const updatedTasks = [...widget.data.tasks, newTaskObj]
      onDataUpdate(widget.id, { tasks: updatedTasks })
      setNewTask("")
    }
  }

  return (
    <BaseWidget widget={widget} isDragging={isDragging} onMouseDown={onMouseDown}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
          <CheckSquare className="w-4 h-4" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {widget.data.tasks.map((task: any) => (
              <div key={task.id} className="flex items-center gap-2">
                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                <span
                  className={`text-xs flex-1 ${task.completed ? "line-through" : ""}`}
                  style={{
                    color: task.completed ? currentTheme.colors.textMuted : currentTheme.colors.text,
                  }}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="text-xs"
            style={{
              backgroundColor: "transparent",
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.cardBorder,
            }}
          />
          <Button size="sm" onClick={addTask} className="px-2">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </BaseWidget>
  )
}
