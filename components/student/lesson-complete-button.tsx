"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { updateProgressAction } from "@/app/actions/student"
import { toast } from "sonner"

interface LessonCompleteButtonProps {
  enrollmentId: string
  lessonId: string
  isCompleted: boolean
  nextLessonId?: string
}

export function LessonCompleteButton({
  enrollmentId,
  lessonId,
  isCompleted,
  nextLessonId,
}: LessonCompleteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [completed, setCompleted] = useState(isCompleted)

  const handleComplete = () => {
    startTransition(async () => {
      const result = await updateProgressAction({
        enrollmentId,
        lessonId,
        isCompleted: true,
      })

      if (result.success) {
        setCompleted(true)
        toast.success("Lesson marked as complete!")
        
        // Navigate to next lesson if available
        if (nextLessonId) {
          router.push(`/learn/courses/${enrollmentId}/lesson/${nextLessonId}`)
        } else {
          router.refresh()
        }
      } else {
        toast.error(result.error || "Failed to mark lesson complete")
      }
    })
  }

  if (completed) {
    return (
      <Button variant="outline" disabled className="bg-green-500/10 border-green-500/30 text-green-600">
        <CheckCircle className="mr-2 size-4" />
        Completed
      </Button>
    )
  }

  return (
    <Button onClick={handleComplete} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Marking Complete...
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 size-4" />
          Mark as Complete
        </>
      )}
    </Button>
  )
}
