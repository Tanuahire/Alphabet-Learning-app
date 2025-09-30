"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, CheckCircle } from "lucide-react"

interface LetterTracingGameProps {
  letter: string
  color: string
  onComplete: () => void
  onClose: () => void
}

export function LetterTracingGame({ letter, color, onComplete, onClose }: LetterTracingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathRef = useRef<{ x: number; y: number }[]>([])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawLetterOutline(ctx, canvas.width, canvas.height)
    pathRef.current = []
    setProgress(0)
    setIsCompleted(false)
  }, [])

  const drawLetterOutline = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = color + "40"
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.font = `${height * 0.7}px Arial Black`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw letter outline
      ctx.strokeText(letter, width / 2, height / 2)

      // Add dotted guide lines
      ctx.setLineDash([10, 10])
      ctx.strokeStyle = color + "60"
      ctx.lineWidth = 4
      ctx.strokeText(letter, width / 2, height / 2)
      ctx.setLineDash([])
    },
    [letter, color],
  )

  const startDrawing = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      setIsDrawing(true)
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY

      const x = clientX - rect.left
      const y = clientY - rect.top

      pathRef.current = [{ x, y }]
    },
    [],
  )

  const draw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY

      const x = clientX - rect.left
      const y = clientY - rect.top

      pathRef.current.push({ x, y })

      // Draw the user's stroke
      ctx.strokeStyle = color
      ctx.lineWidth = 6
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (pathRef.current.length > 1) {
        const prevPoint = pathRef.current[pathRef.current.length - 2]
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Update progress based on path length
      const newProgress = Math.min((pathRef.current.length / 100) * 100, 100)
      setProgress(newProgress)

      // Check if tracing is complete
      if (newProgress >= 80 && !isCompleted) {
        setIsCompleted(true)
        setTimeout(() => {
          onComplete()
        }, 1000)
      }
    },
    [isDrawing, color, isCompleted, onComplete],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 400

    drawLetterOutline(ctx, canvas.width, canvas.height)
  }, [drawLetterOutline])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card shadow-2xl border-4 border-border/20">
        <div className="p-8 text-center">
          <h2 className="text-3xl font-black text-foreground mb-2">Trace the Letter!</h2>
          <p className="text-lg text-muted-foreground mb-6">Follow the dotted lines to trace the letter {letter}</p>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Canvas */}
          <div className="relative mb-6">
            <canvas
              ref={canvasRef}
              className="border-4 border-border/20 rounded-2xl bg-background/50 cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {/* Completion Overlay */}
            {isCompleted && (
              <div className="absolute inset-0 bg-primary/20 rounded-2xl flex items-center justify-center animate-pop-in">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">Great Job!</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button onClick={clearCanvas} size="lg" variant="outline" className="rounded-full bg-transparent">
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button onClick={onClose} size="lg" variant="secondary" className="rounded-full">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
