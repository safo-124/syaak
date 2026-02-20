import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTestimonialById } from "@/lib/testimonials"
import { TestimonialForm } from "@/components/admin/testimonial-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)

  if (!testimonial) notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Testimonial</h1>
          <p className="text-muted-foreground">{testimonial.name}</p>
        </div>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
