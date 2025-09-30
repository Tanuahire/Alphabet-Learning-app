"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Puzzle, Target, X } from "lucide-react"

interface GameSelectorProps {
  letter: string
  onGameSelect: (gameType: "tracing" | "matching" | "find-letter") => void
  onClose: () => void
}

export function GameSelector({ letter, onGameSelect, onClose }: GameSelectorProps) {
  const games = [
    {
      id: "tracing" as const,
      title: "Letter Tracing",
      description: `Trace the letter ${letter} with your finger`,
      icon: Pencil,
      color: "bg-primary",
    },
    {
      id: "matching" as const,
      title: "Picture Matching",
      description: `Find the picture that starts with ${letter}`,
      icon: Puzzle,
      color: "bg-secondary",
    },
    {
      id: "find-letter" as const,
      title: "Letter Hunt",
      description: `Find all the ${letter} letters in the grid`,
      icon: Target,
      color: "bg-accent",
    },
  ]

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card shadow-2xl border-4 border-border/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-foreground mb-2">Choose a Game!</h2>
              <p className="text-lg text-muted-foreground">Pick a fun activity to practice the letter {letter}</p>
            </div>
            <Button onClick={onClose} size="lg" variant="ghost" className="rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Game Options */}
          <div className="grid gap-6">
            {games.map((game) => {
              const IconComponent = game.icon

              return (
                <Card
                  key={game.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-primary/20"
                  onClick={() => onGameSelect(game.id)}
                >
                  <div className="p-6 flex items-center gap-6">
                    {/* Icon */}
                    <div className={`${game.color} rounded-2xl p-4 text-white`}>
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{game.title}</h3>
                      <p className="text-muted-foreground">{game.description}</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-muted-foreground">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">Complete games to earn stars and unlock new letters!</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
