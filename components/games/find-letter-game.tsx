"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shuffle, CheckCircle, Target } from "lucide-react"

interface FindLetterGameProps {
  targetLetter: string
  onComplete: () => void
  onClose: () => void
}

export function FindLetterGame({ targetLetter, onComplete, onClose }: FindLetterGameProps) {
  const [letters, setLetters] = useState<{ letter: string; isTarget: boolean; isFound: boolean; id: string }[]>([])
  const [foundCount, setFoundCount] = useState(0)
  const [totalTargets, setTotalTargets] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const generateLetterGrid = useCallback(() => {
    const gridSize = 16 // 4x4 grid
    const targetCount = 4 // Number of target letters to find
    const newLetters: { letter: string; isTarget: boolean; isFound: boolean; id: string }[] = []

    // Add target letters
    for (let i = 0; i < targetCount; i++) {
      newLetters.push({
        letter: targetLetter,
        isTarget: true,
        isFound: false,
        id: `target-${i}`,
      })
    }

    // Add random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const otherLetters = alphabet.replace(targetLetter, "")

    for (let i = targetCount; i < gridSize; i++) {
      const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)]
      newLetters.push({
        letter: randomLetter,
        isTarget: false,
        isFound: false,
        id: `other-${i}`,
      })
    }

    // Shuffle the array
    const shuffledLetters = newLetters.sort(() => Math.random() - 0.5)
    setLetters(shuffledLetters)
    setTotalTargets(targetCount)
    setFoundCount(0)
    setIsCompleted(false)
    setScore(0)
  }, [targetLetter])

  const handleLetterClick = useCallback(
    (letterId: string) => {
      if (isCompleted) return

      setLetters((prev) =>
        prev.map((letter) => {
          if (letter.id === letterId && !letter.isFound) {
            if (letter.isTarget) {
              setFoundCount((count) => count + 1)
              setScore((s) => s + 10)
              return { ...letter, isFound: true }
            } else {
              // Wrong letter clicked - small penalty
              setScore((s) => Math.max(0, s - 2))
            }
          }
          return letter
        }),
      )
    },
    [isCompleted],
  )

  useEffect(() => {
    if (foundCount === totalTargets && totalTargets > 0) {
      setIsCompleted(true)
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }, [foundCount, totalTargets, onComplete])

  useEffect(() => {
    generateLetterGrid()
  }, [generateLetterGrid])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card shadow-2xl border-4 border-border/20">
        <div className="p-8 text-center">
          <h2 className="text-3xl font-black text-foreground mb-2">Find the Letters!</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Find all the <span className="text-4xl font-black text-primary">{targetLetter}</span> letters in the grid
          </p>

          {/* Progress and Score */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {foundCount} / {totalTargets}
              </div>
              <div className="text-sm text-muted-foreground">Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>

          {/* Letter Grid */}
          <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
            {letters.map((letter) => {
              const isFound = letter.isFound
              const isTarget = letter.isTarget

              return (
                <Button
                  key={letter.id}
                  onClick={() => handleLetterClick(letter.id)}
                  size="lg"
                  variant={isFound ? (isTarget ? "default" : "secondary") : "outline"}
                  className={`h-16 text-2xl font-black rounded-2xl transition-all duration-300 ${
                    isFound && isTarget
                      ? "bg-primary text-primary-foreground animate-bounce-in"
                      : isFound
                        ? "bg-muted text-muted-foreground"
                        : "hover:scale-110 hover:shadow-lg"
                  }`}
                  disabled={isFound}
                >
                  {letter.letter}
                  {isFound && isTarget && <CheckCircle className="w-4 h-4 ml-1" />}
                </Button>
              )
            })}
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="mb-6 animate-pop-in">
              <div className="text-center">
                <Target className="w-16 h-16 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary">Fantastic!</p>
                <p className="text-lg text-muted-foreground">You found all the {targetLetter} letters!</p>
                <p className="text-xl font-bold text-secondary mt-2">Final Score: {score} points</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button onClick={generateLetterGrid} size="lg" variant="outline" className="rounded-full bg-transparent">
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
