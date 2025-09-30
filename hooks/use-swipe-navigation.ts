"use client"

import { useCallback, useEffect, useRef } from "react"

interface SwipeNavigationOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
  preventScroll?: boolean
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventScroll = true,
}: SwipeNavigationOptions) {
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isSwiping = useRef(false)

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return

      const touch = event.touches[0]
      const deltaX = Math.abs(touch.clientX - touchStartX.current)
      const deltaY = Math.abs(touch.clientY - touchStartY.current)

      // Determine if this is a horizontal swipe
      if (deltaX > deltaY && deltaX > threshold / 2) {
        isSwiping.current = true
        if (preventScroll) {
          event.preventDefault()
        }
      }
    },
    [threshold, preventScroll],
  )

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!touchStartX.current || !isSwiping.current) {
        touchStartX.current = null
        touchStartY.current = null
        return
      }

      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = Math.abs(touch.clientY - (touchStartY.current || 0))

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          onSwipeRight() // Swipe right (previous letter)
        } else {
          onSwipeLeft() // Swipe left (next letter)
        }
      }

      touchStartX.current = null
      touchStartY.current = null
      isSwiping.current = false
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  useEffect(() => {
    const element = document.body

    element.addEventListener("touchstart", handleTouchStart, { passive: false })
    element.addEventListener("touchmove", handleTouchMove, { passive: false })
    element.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return { isSwiping: isSwiping.current }
}
