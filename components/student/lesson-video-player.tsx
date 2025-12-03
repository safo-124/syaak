"use client"

import { useRef, useEffect, useState } from "react"
import { updateProgressAction } from "@/app/actions/student"

interface LessonVideoPlayerProps {
  videoUrl: string
  enrollmentId: string
  lessonId: string
  initialPosition?: number
}

export function LessonVideoPlayer({
  videoUrl,
  enrollmentId,
  lessonId,
  initialPosition = 0,
}: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [lastSavedPosition, setLastSavedPosition] = useState(initialPosition)
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Determine video type (YouTube, Vimeo, or direct)
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
  const isVimeo = videoUrl.includes("vimeo.com")

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = ""
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search)
      videoId = urlParams.get("v") || ""
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
    }
    return `https://www.youtube.com/embed/${videoId}?start=${Math.floor(initialPosition)}`
  }

  // Get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0] || ""
    return `https://player.vimeo.com/video/${videoId}#t=${Math.floor(initialPosition)}s`
  }

  // Save progress periodically for direct video
  useEffect(() => {
    if (isYouTube || isVimeo) return

    const video = videoRef.current
    if (!video) return

    // Set initial position
    if (initialPosition > 0) {
      video.currentTime = initialPosition
    }

    const saveProgress = async () => {
      if (!video) return
      const currentTime = Math.floor(video.currentTime)
      
      // Only save if position changed significantly (5+ seconds)
      if (Math.abs(currentTime - lastSavedPosition) >= 5) {
        await updateProgressAction({
          enrollmentId,
          lessonId,
          lastPosition: currentTime,
          watchTime: currentTime,
        })
        setLastSavedPosition(currentTime)
      }
    }

    // Save every 30 seconds
    saveIntervalRef.current = setInterval(saveProgress, 30000)

    // Save on pause
    video.addEventListener("pause", saveProgress)

    // Save when leaving page
    const handleBeforeUnload = () => saveProgress()
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
      video.removeEventListener("pause", saveProgress)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // Final save
      saveProgress()
    }
  }, [enrollmentId, lessonId, initialPosition, lastSavedPosition, isYouTube, isVimeo])

  if (isYouTube) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (isVimeo) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={getVimeoEmbedUrl(videoUrl)}
          className="size-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Direct video
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full aspect-video"
      controls
      playsInline
    />
  )
}
