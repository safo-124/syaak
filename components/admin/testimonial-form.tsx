"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { createTestimonialAction, updateTestimonialAction } from "@/app/actions/testimonials"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
  imageUrl: string | null
  companyLogo: string | null
  order: number
  isVisible: boolean
  showOnHomepage: boolean
}

interface Props {
  testimonial?: Testimonial | null
}

export function TestimonialForm({ testimonial }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(testimonial?.rating ?? 5)
  const [hovered, setHovered] = useState(0)
  const [isVisible, setIsVisible] = useState(testimonial?.isVisible ?? true)
  const [showOnHomepage, setShowOnHomepage] = useState(testimonial?.showOnHomepage ?? true)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("rating", rating.toString())
    formData.set("isVisible", isVisible.toString())
    formData.set("showOnHomepage", showOnHomepage.toString())

    startTransition(async () => {
      const res = testimonial
        ? await updateTestimonialAction(testimonial.id, formData)
        : await createTestimonialAction(formData)

      if (res?.error) toast.error(res.error)
      else {
        toast.success(testimonial ? "Testimonial updated!" : "Testimonial created!")
        router.push("/admin/testimonials")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={testimonial?.name ?? ""} required placeholder="e.g. Kwame Mensah" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role / Position</Label>
          <Input id="role" name="role" defaultValue={testimonial?.role ?? ""} placeholder="e.g. Data Analyst at MTN" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Testimonial *</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={testimonial?.content ?? ""}
          required
          rows={4}
          placeholder="What did they say about the course or programme?"
        />
      </div>

      <div className="space-y-2">
        <Label>Star Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
            >
              <Star className={cn("size-6 transition-colors", (hovered || rating) >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Photo URL</Label>
          <Input id="imageUrl" name="imageUrl" defaultValue={testimonial?.imageUrl ?? ""} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo URL</Label>
          <Input id="companyLogo" name="companyLogo" defaultValue={testimonial?.companyLogo ?? ""} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input id="order" name="order" type="number" defaultValue={testimonial?.order ?? 0} className="w-28" />
      </div>

      <div className="flex gap-8">
        <div className="flex items-center gap-3">
          <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
          <Label htmlFor="isVisible">Visible</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="showOnHomepage" checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
          <Label htmlFor="showOnHomepage">Show on Homepage</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : testimonial ? "Update Testimonial" : "Create Testimonial"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/testimonials")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
