"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Play } from "lucide-react"
import { alphabetData } from "@/lib/alphabet-data"

interface AlphabetOverviewProps {
  completedLetters: number[]
  currentIndex: number
  onLetterSelect: (index: number) => void
  onClose: () => void
}

export function AlphabetOverview({ completedLetters, currentIndex, onLetterSelect, onClose }: AlphabetOverviewProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        {/* Header - Responsive text sizing and spacing */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-3 sm:mb-4 text-balance">
            Choose Your Letter!
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">Click any letter to start learning</p>
          <Button
            onClick={onClose}
            size="lg"
            variant="outline"
            className="rounded-full bg-transparent touch-manipulation"
          >
            Back to Current Letter
          </Button>
        </div>

        {/* Letter Grid - Improved responsive grid layout */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {alphabetData.map((letter, index) => {
            const isCompleted = completedLetters.includes(index)
            const isCurrent = index === currentIndex

            return (
              <Card
                key={letter.letter}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl touch-manipulation ${
                  isCurrent ? "ring-4 ring-primary shadow-2xl scale-105" : ""
                } ${isCompleted ? "bg-gradient-to-br from-secondary/20 to-accent/20" : ""}`}
                onClick={() => onLetterSelect(index)}
              >
                <div className="p-4 sm:p-5 md:p-6 text-center">
                  {/* Letter Display - Responsive letter sizing */}
                  <div
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 transition-colors"
                    style={{ color: letter.color }}
                  >
                    {letter.letter}
                  </div>

                  {/* Word - Responsive text sizing */}
                  <div className="text-xs sm:text-sm font-semibold text-foreground mb-2">{letter.word}</div>

                  {/* Status Indicators - Responsive icon sizing */}
                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-secondary">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                        <span className="text-xs font-bold">Done!</span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-primary">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                        <span className="text-xs font-bold">Current</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Ring for Completed Letters - Responsive positioning */}
                  {isCompleted && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-secondary rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Progress Summary - Responsive layout and sizing */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-card rounded-2xl sm:rounded-full px-6 sm:px-8 py-4 shadow-lg">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {completedLetters.length} / {alphabetData.length}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">Letters Completed</div>
            <div className="w-20 sm:w-24 h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${(completedLetters.length / alphabetData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
