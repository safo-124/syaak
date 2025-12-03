"use client"

import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Check } from "lucide-react"
import { createCategoryAction, updateCategoryAction } from "@/app/actions/blog"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
  }
}

export function CategoryForm({ category }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(category?.name || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const router = useRouter()

  // Auto-generate slug from name
  useEffect(() => {
    if (!category) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setSlug(generatedSlug)
    }
  }, [name, category])

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, formData)
        : await createCategoryAction(formData)

      if (!result.success) {
        setError(result.error || "Something went wrong")
      } else {
        router.push("/admin/blog")
        router.refresh()
      }
    })
  }

  const predefinedColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="category-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          URL-friendly identifier (auto-generated from name)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of this category..."
          rows={3}
          defaultValue={category?.description || ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={category?.color === color}
                className="sr-only peer"
              />
              <div
                className="size-8 rounded-full border-2 border-transparent peer-checked:border-foreground peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-offset-background transition-all flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Check className="size-4 text-white opacity-0 peer-checked:opacity-100" />
              </div>
            </label>
          ))}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="color"
              value=""
              defaultChecked={!category?.color}
              className="sr-only peer"
            />
            <div className="size-8 rounded-full border-2 border-dashed border-muted-foreground peer-checked:border-foreground peer-checked:bg-muted transition-all" />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose a color for this category badge
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {category ? "Updating..." : "Creating..."}
            </>
          ) : (
            category ? "Update Category" : "Create Category"
          )}
        </Button>
      </div>
    </form>
  )
}
