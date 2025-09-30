"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface AudioOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
}

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true)
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize background music
  useEffect(() => {
    if (typeof window !== "undefined") {
      backgroundAudioRef.current = new Audio("/background-music.mp3")
      backgroundAudioRef.current.loop = true
      backgroundAudioRef.current.volume = 0.3

      // Start background music if enabled
      if (backgroundMusicEnabled && !isMuted) {
        backgroundAudioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log("Background music autoplay blocked")
        })
      }
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
        backgroundAudioRef.current = null
      }
    }
  }, [])

  // Handle background music state changes
  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (backgroundMusicEnabled && !isMuted) {
        backgroundAudioRef.current.play().catch(() => {})
      } else {
        backgroundAudioRef.current.pause()
      }
    }
  }, [backgroundMusicEnabled, isMuted])

  const playLetterAudio = useCallback(
    (letter: string, word: string, options: AudioOptions = {}) => {
      if (!("speechSynthesis" in window) || isMuted) return

      // Stop any current speech
      speechSynthesis.cancel()

      setIsPlaying(true)

      const text = `${letter} for ${word}`
      const utterance = new SpeechSynthesisUtterance(text)

      // Configure voice settings for child-friendly speech
      utterance.rate = options.rate || 0.7
      utterance.pitch = options.pitch || 1.3
      utterance.volume = options.volume || 0.9

      // Try to use a child-friendly voice if available
      const voices = speechSynthesis.getVoices()
      const childVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("child") ||
          voice.name.toLowerCase().includes("kid") ||
          voice.name.toLowerCase().includes("female"),
      )

      if (childVoice) {
        utterance.voice = childVoice
      }

      utterance.onstart = () => {
        // Lower background music during speech
        if (backgroundAudioRef.current && backgroundMusicEnabled) {
          backgroundAudioRef.current.volume = 0.1
        }
      }

      utterance.onend = () => {
        setIsPlaying(false)
        // Restore background music volume
        if (backgroundAudioRef.current && backgroundMusicEnabled) {
          backgroundAudioRef.current.volume = 0.3
        }
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        // Restore background music volume
        if (backgroundAudioRef.current && backgroundMusicEnabled) {
          backgroundAudioRef.current.volume = 0.3
        }
      }

      currentUtteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    },
    [isMuted, backgroundMusicEnabled],
  )

  const playSuccessSound = useCallback(() => {
    if (isMuted) return

    // Create a cheerful success sound using Web Audio API
    if (typeof window !== "undefined" && "AudioContext" in window) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create a simple melody for success
      const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15)
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.15 + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3)

        oscillator.start(audioContext.currentTime + index * 0.15)
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3)
      })
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    if (!isMuted) {
      // Stop current speech when muting
      speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }, [isMuted])

  const toggleBackgroundMusic = useCallback(() => {
    setBackgroundMusicEnabled((prev) => !prev)
  }, [])

  const stopAudio = useCallback(() => {
    speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  return {
    isPlaying,
    isMuted,
    backgroundMusicEnabled,
    playLetterAudio,
    playSuccessSound,
    toggleMute,
    toggleBackgroundMusic,
    stopAudio,
  }
}
