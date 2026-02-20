import { Star, StarHalf } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  rating: number
  review: string | null
  createdAt: Date
  student: { id: string; name: string; avatar: string | null }
}

interface Props {
  average: number
  count: number
  reviews: Review[]
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "md" ? "size-5" : "size-4"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const full = rating >= s
        const half = !full && rating >= s - 0.5
        return (
          <span key={s} className="relative inline-block">
            {half ? (
              <StarHalf className={cn(sz, "fill-amber-400 text-amber-400")} />
            ) : (
              <Star className={cn(sz, full ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
            )}
          </span>
        )
      })}
    </div>
  )
}

export function CourseRatingDisplay({ average, count, reviews }: Props) {
  if (count === 0) {
    return (
      <p className="text-sm text-muted-foreground">No ratings yet. Be the first to rate this course!</p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{average.toFixed(1)}</div>
          <StarDisplay rating={average} size="md" />
          <div className="text-sm text-muted-foreground mt-1">{count} {count === 1 ? "rating" : "ratings"}</div>
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.filter(r => r.review).length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Student Reviews</h4>
          {reviews.filter(r => r.review).map((r) => (
            <div key={r.id} className="flex gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={r.student.avatar ?? undefined} />
                <AvatarFallback>{r.student.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{r.student.name}</span>
                  <StarDisplay rating={r.rating} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.review}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
