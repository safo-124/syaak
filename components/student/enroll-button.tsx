"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, BookOpen } from "lucide-react"
import { enrollAction } from "@/app/actions/student"
import { toast } from "sonner"

interface EnrollButtonProps {
  courseId: string
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollAction(courseId)

      if (result.success) {
        toast.success("Successfully enrolled in course!")
        router.push("/learn/courses")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to enroll")
      }
    })
  }

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          <BookOpen className="mr-2 size-4" />
          Enroll Now
        </>
      )}
    </Button>
  )
}
