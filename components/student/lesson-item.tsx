"use client"

import Link from "next/link"
import { CheckCircle, Clock, FileText, Lock, Play, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: number | null
  isFree: boolean
  videoUrl: string | null
  content: string | null
}

interface LessonItemProps {
  lesson: Lesson
  lessonNumber: number
  enrollmentId: string
  isCompleted: boolean
  isNext: boolean
}

export function LessonItem({
  lesson,
  lessonNumber,
  enrollmentId,
  isCompleted,
  isNext,
}: LessonItemProps) {
  const hasVideo = !!lesson.videoUrl
  const duration = lesson.duration
    ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, "0")}`
    : null

  return (
    <Link
      href={`/learn/courses/${enrollmentId}/lesson/${lesson.id}`}
      className={cn(
        "flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg transition-colors hover:bg-muted/50",
        isNext && "bg-primary/5 hover:bg-primary/10"
      )}
    >
      {/* Status Icon */}
      <div className="shrink-0">
        {isCompleted ? (
          <CheckCircle className="size-5 text-green-500" />
        ) : isNext ? (
          <div className="relative">
            <div className="size-5 rounded-full border-2 border-primary animate-pulse" />
            <Play className="absolute inset-0 m-auto size-3 text-primary" />
          </div>
        ) : (
          <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {lessonNumber}.
          </span>
          <span className={cn(
            "font-medium truncate",
            isCompleted && "text-muted-foreground"
          )}>
            {lesson.title}
          </span>
          {lesson.isFree && (
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          )}
        </div>
      </div>

      {/* Type & Duration */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {hasVideo ? (
          <Video className="size-4" />
        ) : (
          <FileText className="size-4" />
        )}
        {duration && (
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {duration}
          </span>
        )}
      </div>
    </Link>
  )
}
