"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2, RotateCcw, Gamepad2 } from "lucide-react"

interface AlphabetData {
  letter: string
  word: string
  image: string
  color: string
  animation: "bounce-in" | "swing-in" | "pop-in"
}

interface AlphabetCardProps {
  data: AlphabetData
  isActive: boolean
  onAudioPlay: () => void
  onSuccess?: () => void
  onGameOpen?: () => void
}

export function AlphabetCard({ data, isActive, onAudioPlay, onSuccess, onGameOpen }: AlphabetCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true)
      setHasInteracted(false)

      // Auto-play audio when card becomes active (with delay for animation)
      const audioTimer = setTimeout(() => {
        onAudioPlay()
      }, 600)

      // Reset animation state
      const animationTimer = setTimeout(() => {
        setIsAnimating(false)
      }, 1200)

      return () => {
        clearTimeout(audioTimer)
        clearTimeout(animationTimer)
      }
    }
  }, [isActive, onAudioPlay])

  const handleReplay = () => {
    setIsAnimating(true)
    setHasInteracted(true)
    onAudioPlay()

    // Play success sound after interaction
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 1000)
    }

    setTimeout(() => setIsAnimating(false), 1200)
  }

  const handleLetterClick = () => {
    handleReplay()
  }

  const handleGameOpen = () => {
    if (onGameOpen) {
      onGameOpen()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Main Letter Display */}
      <Card
        className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 shadow-2xl border-4 border-border/20 mb-6 sm:mb-8 cursor-pointer transition-transform hover:scale-105 w-full max-w-2xl"
        onClick={handleLetterClick}
      >
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 text-center">
          {/* Interactive Letter - Improved responsive sizing */}
          <div
            className={`text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] xl:text-[16rem] font-black leading-none mb-4 sm:mb-6 select-none transition-all duration-300 hover:scale-110 ${
              isAnimating ? `animate-${data.animation}` : ""
            }`}
            style={{
              color: data.color,
              textShadow: "0 8px 32px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.1)",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            }}
          >
            {data.letter}
          </div>

          {/* Word Display with Phonetic Helper - Better responsive text sizing */}
          <div className="mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 text-balance">
              {data.letter} for {data.word}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Click the letter to hear it again!
            </div>
          </div>

          {/* Image with Interactive Border - Responsive image sizing */}
          <div className="relative mx-auto mb-6 sm:mb-8">
            <div
              className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl shadow-xl border-4 border-white/50 overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                isAnimating ? "animate-pop-in" : ""
              } ${hasInteracted ? "ring-4 ring-primary/50" : ""}`}
              style={{ backgroundColor: data.color + "20" }}
            >
              <img
                src={data.image || `/placeholder.svg?height=384&width=384&query=${data.word}`}
                alt={`${data.word} for ${data.letter}`}
                className="w-full h-full object-cover transition-transform hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>

          {/* Enhanced Audio Control Buttons - Responsive button sizing and layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              onClick={handleReplay}
              size="lg"
              className="rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90 touch-manipulation"
            >
              <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </Button>

            <Button
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => setIsAnimating(false), 1200)
              }}
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 touch-manipulation"
            >
              <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </Button>

            <Button
              onClick={handleGameOpen}
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-accent hover:bg-accent/90 text-accent-foreground border-accent touch-manipulation"
            >
              <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Encouraging Message with Audio Feedback - Responsive text sizing */}
      <div className="text-center px-4">
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-muted-foreground text-balance mb-2">
          {hasInteracted ? "Excellent! You're learning so well!" : `Great job learning the letter ${data.letter}!`}
        </p>
        <p className="text-base sm:text-lg text-muted-foreground text-balance">
          {hasInteracted ? "Try the games or next letter!" : "Click anywhere to hear it again, or try a game!"}
        </p>
      </div>
    </div>
  )
}
