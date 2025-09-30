"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, MicOff as MusicOff } from "lucide-react"

interface AudioControlsProps {
  isMuted: boolean
  backgroundMusicEnabled: boolean
  onToggleMute: () => void
  onToggleBackgroundMusic: () => void
}

export function AudioControls({
  isMuted,
  backgroundMusicEnabled,
  onToggleMute,
  onToggleBackgroundMusic,
}: AudioControlsProps) {
  return (
    <div className="fixed top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-50">
      <div className="flex flex-col gap-2 sm:gap-3 bg-card/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/20">
        {/* Mute/Unmute Button - Responsive sizing */}
        <Button
          onClick={onToggleMute}
          size="lg"
          variant={isMuted ? "destructive" : "secondary"}
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-manipulation"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
        </Button>

        {/* Background Music Toggle - Responsive sizing */}
        <Button
          onClick={onToggleBackgroundMusic}
          size="lg"
          variant={backgroundMusicEnabled ? "secondary" : "outline"}
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-manipulation"
          title={backgroundMusicEnabled ? "Turn off background music" : "Turn on background music"}
        >
          {backgroundMusicEnabled ? (
            <Music className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MusicOff className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </Button>

        {/* Audio Status Indicator - Responsive sizing */}
        <div className="text-center">
          <div
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mx-auto ${
              isMuted ? "bg-destructive" : "bg-green-500"
            } animate-pulse`}
          ></div>
          <p className="text-xs text-muted-foreground mt-1">{isMuted ? "Muted" : "Audio On"}</p>
        </div>
      </div>
    </div>
  )
}
