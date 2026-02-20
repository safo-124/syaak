"use client"

import { useState, useTransition } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitRatingAction, deleteRatingAction } from "@/app/actions/ratings"
import { cn } from "@/lib/utils"

interface Props {
  studentId: string
  courseId: string
  enrollmentId: string
  existingRating?: { rating: number; review: string | null } | null
}

export function CourseRatingForm({ studentId, courseId, enrollmentId, existingRating }: Props) {
  const [rating, setRating] = useState(existingRating?.rating ?? 0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState(existingRating?.review ?? "")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating")
      return
    }
    startTransition(async () => {
      const res = await submitRatingAction({ studentId, courseId, enrollmentId, rating, review: review || null })
      if (res.error) toast.error(res.error)
      else toast.success(existingRating ? "Rating updated!" : "Rating submitted!")
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteRatingAction({ studentId, courseId, enrollmentId })
      if (res.error) toast.error(res.error)
      else {
        setRating(0)
        setReview("")
        toast.success("Rating removed")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  "size-7 transition-colors",
                  (hovered || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground self-center">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Review (optional)</p>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this course..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : existingRating ? "Update Rating" : "Submit Rating"}
        </Button>
        {existingRating && (
          <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isPending}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
