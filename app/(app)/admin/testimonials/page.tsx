import Link from "next/link"
import Image from "next/image"
import { Plus, Star, Eye, EyeOff, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllTestimonialsAdmin } from "@/lib/testimonials"
import { TestimonialDeleteButton } from "@/components/admin/testimonial-delete-button"

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage student and client testimonials shown on the homepage.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="mr-2 size-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Star className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold">{testimonials.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Eye className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{testimonials.filter(t => t.isVisible).length}</p>
              <p className="text-sm text-muted-foreground">Visible</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Home className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{testimonials.filter(t => t.showOnHomepage).length}</p>
              <p className="text-sm text-muted-foreground">On Homepage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Star className="mx-auto mb-4 size-10 opacity-30" />
            <p className="font-medium">No testimonials yet</p>
            <p className="text-sm mt-1">Add your first testimonial to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/testimonials/new">Add Testimonial</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.imageUrl ? (
                      <Image
                        src={t.imageUrl}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover size-10"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {t.showOnHomepage && (
                      <Badge variant="secondary" className="text-xs">
                        <Home className="mr-1 size-3" />
                        Homepage
                      </Badge>
                    )}
                    {!t.isVisible && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        <EyeOff className="mr-1 size-3" />
                        Hidden
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${t.rating >= s ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{t.content}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Order: {t.order}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/testimonials/${t.id}/edit`}>Edit</Link>
                    </Button>
                    <TestimonialDeleteButton id={t.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
