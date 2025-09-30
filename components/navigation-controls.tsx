"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Home, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface NavigationControlsProps {
  currentIndex: number
  totalLetters: number
  onPrevious: () => void
  onNext: () => void
  onHome: () => void
  completedLetters?: number[]
}

export function NavigationControls({
  currentIndex,
  totalLetters,
  onPrevious,
  onNext,
  onHome,
  completedLetters = [],
}: NavigationControlsProps) {
  const progressPercentage = ((currentIndex + 1) / totalLetters) * 100
  const isFirstLetter = currentIndex === 0
  const isLastLetter = currentIndex === totalLetters - 1

  return (
    <>
      {/* Main Navigation Bar - Improved responsive positioning and sizing */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 bg-card/95 backdrop-blur-sm rounded-full p-3 sm:p-4 md:p-6 shadow-2xl border border-border/20 max-w-sm sm:max-w-md md:max-w-lg">
          {/* Previous Button - Responsive button sizing */}
          <Button
            onClick={onPrevious}
            disabled={isFirstLetter}
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed bg-transparent text-2xl font-bold touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />
          </Button>

          {/* Home Button - Responsive sizing */}
          <Button
            onClick={onHome}
            size="lg"
            variant="secondary"
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-manipulation"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </Button>

          {/* Progress Display - Responsive text and progress bar sizing */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-foreground">{currentIndex + 1}</span>
              <span className="text-base sm:text-lg md:text-xl text-muted-foreground">/</span>
              <span className="text-lg sm:text-xl md:text-2xl font-black text-muted-foreground">{totalLetters}</span>
            </div>
            <div className="w-16 sm:w-20 md:w-24 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Next Button - Responsive sizing */}
          <Button
            onClick={onNext}
            disabled={isLastLetter}
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed bg-transparent text-2xl font-bold touch-manipulation"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />
          </Button>
        </div>
      </div>

      {/* Letter Grid Navigation - Better responsive positioning and sizing */}
      <div className="fixed right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-xl border border-border/20 max-h-80 md:max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5 md:gap-2 max-w-20 md:max-w-24">
            {Array.from({ length: totalLetters }, (_, index) => {
              const letter = String.fromCharCode(65 + index) // A-Z
              const isActive = index === currentIndex
              const isCompleted = completedLetters.includes(index)

              return (
                <Button
                  key={letter}
                  onClick={() => {
                    // This would need to be passed as a prop
                    // onLetterSelect(index)
                  }}
                  size="sm"
                  variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 touch-manipulation ${
                    isActive ? "scale-110 shadow-lg" : "hover:scale-105"
                  }`}
                >
                  {isCompleted && !isActive ? <Star className="w-3 h-3 md:w-4 md:h-4" /> : letter}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar at Top - Responsive height */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress
          value={progressPercentage}
          className="h-1 sm:h-1.5 md:h-2 rounded-none bg-muted/50"
          style={{
            background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
          }}
        />
      </div>
    </>
  )
}
