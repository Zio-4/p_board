"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Widget, CanvasState } from "../types/widget"
import { usePersistence } from "./use-persistence"

export function useDrag(
  widgets: Widget[],
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>,
  canvas: CanvasState,
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updatePan: (panX: number, panY: number) => void,
) {
  const { saveWidgets } = usePersistence()
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, widgetId?: string) => {
      if (widgetId) {
        const widget = widgets.find((w) => w.id === widgetId)
        if (widget) {
          setDraggedWidget(widgetId)
          const rect = e.currentTarget.getBoundingClientRect()
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        }
      } else {
        setIsPanning(true)
        setPanStart({ x: e.clientX - canvas.panX, y: e.clientY - canvas.panY })
      }
    },
    [widgets, canvas],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (draggedWidget) {
          const canvasRect = canvasRef.current?.getBoundingClientRect()
          if (canvasRect) {
            const newX = (e.clientX - canvasRect.left - dragOffset.x - canvas.panX) / canvas.zoom
            const newY = (e.clientY - canvasRect.top - dragOffset.y - canvas.panY) / canvas.zoom

            setWidgets((prev) =>
              prev.map((widget) => (widget.id === draggedWidget ? { ...widget, x: newX, y: newY } : widget)),
            )
          }
        } else if (isPanning) {
          updatePan(e.clientX - panStart.x, e.clientY - panStart.y)
        }
      })
    },
    [
      draggedWidget,
      dragOffset,
      canvas.zoom,
      canvas.panX,
      canvas.panY,
      isPanning,
      panStart,
      canvasRef,
      setWidgets,
      updatePan,
    ],
  )

  const handleMouseUp = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (draggedWidget) {
      saveWidgets(widgets)
    }

    setDraggedWidget(null)
    setIsPanning(false)
  }, [draggedWidget, widgets, saveWidgets])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleMouseMove, handleMouseUp])

  return {
    draggedWidget,
    handleMouseDown,
  }
}
