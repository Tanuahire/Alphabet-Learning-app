"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shuffle, CheckCircle, X } from "lucide-react"
import { alphabetData } from "@/lib/alphabet-data"

interface MatchingGameProps {
  currentLetter: string
  onComplete: () => void
  onClose: () => void
}

interface MatchingOption {
  id: string
  letter: string
  word: string
  image: string
  isCorrect: boolean
}

export function MatchingGame({ currentLetter, onComplete, onClose }: MatchingGameProps) {
  const [options, setOptions] = useState<MatchingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const generateOptions = useCallback(() => {
    const currentData = alphabetData.find((item) => item.letter === currentLetter)
    if (!currentData) return

    // Get 3 random incorrect options
    const incorrectOptions = alphabetData
      .filter((item) => item.letter !== currentLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => ({
        id: `incorrect-${item.letter}`,
        letter: item.letter,
        word: item.word,
        image: item.image,
        isCorrect: false,
      }))

    // Add the correct option
    const correctOption: MatchingOption = {
      id: `correct-${currentData.letter}`,
      letter: currentData.letter,
      word: currentData.word,
      image: currentData.image,
      isCorrect: true,
    }

    // Shuffle all options
    const allOptions = [...incorrectOptions, correctOption].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
  }, [currentLetter])

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      if (showResult) return

      setSelectedOption(optionId)
      const selected = options.find((opt) => opt.id === optionId)
      if (!selected) return

      setIsCorrect(selected.isCorrect)
      setShowResult(true)

      if (selected.isCorrect) {
        setTimeout(() => {
          setIsCompleted(true)
          setTimeout(() => {
            onComplete()
          }, 1500)
        }, 1000)
      } else {
        setTimeout(() => {
          setShowResult(false)
          setSelectedOption(null)
        }, 2000)
      }
    },
    [options, showResult, onComplete],
  )

  useEffect(() => {
    generateOptions()
  }, [generateOptions])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card shadow-2xl border-4 border-border/20">
        <div className="p-8 text-center">
          <h2 className="text-3xl font-black text-foreground mb-2">Find the Match!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Which picture matches the letter <span className="text-4xl font-black text-primary">{currentLetter}</span>?
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {options.map((option) => {
              const isSelected = selectedOption === option.id
              const showCorrect = showResult && option.isCorrect
              const showIncorrect = showResult && isSelected && !option.isCorrect

              return (
                <Card
                  key={option.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected ? "ring-4 ring-primary" : ""
                  } ${showCorrect ? "ring-4 ring-green-500 bg-green-50" : ""} ${
                    showIncorrect ? "ring-4 ring-red-500 bg-red-50" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="p-6">
                    {/* Image */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-muted">
                      <img
                        src={option.image || `/placeholder.svg?height=96&width=96&query=${option.word}`}
                        alt={option.word}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Word */}
                    <p className="text-lg font-bold text-foreground">{option.word}</p>

                    {/* Result Icons */}
                    {showCorrect && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-8 h-8 text-green-500 animate-bounce-in" />
                      </div>
                    )}
                    {showIncorrect && (
                      <div className="absolute top-2 right-2">
                        <X className="w-8 h-8 text-red-500 animate-bounce-in" />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="mb-6">
              {isCorrect ? (
                <div className="text-center animate-bounce-in">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">Perfect! That's correct!</p>
                </div>
              ) : (
                <div className="text-center animate-bounce-in">
                  <X className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">Try again! Look for {currentLetter}.</p>
                </div>
              )}
            </div>
          )}

          {/* Completion Message */}
          {isCompleted && (
            <div className="mb-6 animate-pop-in">
              <div className="text-center">
                <Shuffle className="w-16 h-16 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary">Amazing work!</p>
                <p className="text-lg text-muted-foreground">You found the right match!</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={generateOptions}
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent"
              disabled={showResult}
            >
              <Shuffle className="w-5 h-5 mr-2" />
              New Game
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
