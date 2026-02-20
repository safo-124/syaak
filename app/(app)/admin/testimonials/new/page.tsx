import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialForm } from "@/components/admin/testimonial-form"

export default function NewTestimonialPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Testimonial</h1>
          <p className="text-muted-foreground">Create a new testimonial</p>
        </div>
      </div>
      <TestimonialForm />
    </div>
  )
}
