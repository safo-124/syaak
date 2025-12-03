"use client"

import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { createCourseAction, updateCourseAction } from "@/app/actions/instructor"
import Link from "next/link"

interface CourseFormProps {
  course?: {
    id: string
    title: string
    slug: string
    shortSummary: string | null
    description: string | null
    level: string
    format: string | null
    duration: string | null
    price: number
    techStack: string[]
    tags: string[]
    learningOutcomes: string[]
    heroImageUrl: string | null
    isPublished: boolean
    maxStudents: number | null
  }
}

export function InstructorCourseForm({ course }: CourseFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(course?.title || "")
  const [slug, setSlug] = useState(course?.slug || "")

  // Auto-generate slug from title
  useEffect(() => {
    if (!course) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setSlug(generatedSlug)
    }
  }, [title, course])

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = course
        ? await updateCourseAction(course.id, formData)
        : await createCourseAction(formData)

      if (result && !result.success) {
        setError(result.error || "Something went wrong")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Python for Data Science"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
              /courses/
            </span>
            <Input
              id="slug"
              name="slug"
              placeholder="python-data-science"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-l-none"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortSummary">Short Summary</Label>
        <Textarea
          id="shortSummary"
          name="shortSummary"
          placeholder="A brief overview of what students will learn..."
          rows={2}
          defaultValue={course?.shortSummary || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Detailed course description with curriculum overview..."
          rows={5}
          defaultValue={course?.description || ""}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            name="level"
            defaultValue={course?.level || "BEGINNER"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Input
            id="format"
            name="format"
            placeholder="e.g. Online, In-person"
            defaultValue={course?.format || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="e.g. 6 weeks"
            defaultValue={course?.duration || ""}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (GHS)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="0 for free"
            defaultValue={course?.price || 0}
          />
          <p className="text-xs text-muted-foreground">
            Enter 0 for free courses
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxStudents">Max Students</Label>
          <Input
            id="maxStudents"
            name="maxStudents"
            type="number"
            placeholder="Leave empty for unlimited"
            defaultValue={course?.maxStudents || ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImageUrl">Cover Image URL</Label>
        <Input
          id="heroImageUrl"
          name="heroImageUrl"
          placeholder="https://example.com/image.jpg"
          defaultValue={course?.heroImageUrl || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Tech Stack / Tools</Label>
        <Input
          id="techStack"
          name="techStack"
          placeholder="Python, Pandas, NumPy, Jupyter"
          defaultValue={course?.techStack?.join(", ") || ""}
        />
        <p className="text-xs text-muted-foreground">
          Separate with commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="data-science, python, beginners"
          defaultValue={course?.tags?.join(", ") || ""}
        />
        <p className="text-xs text-muted-foreground">
          Separate with commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
        <Textarea
          id="learningOutcomes"
          name="learningOutcomes"
          placeholder="Write each outcome on a new line:
Build real-world data analysis projects
Master Python fundamentals
Create visualizations with Matplotlib"
          rows={4}
          defaultValue={course?.learningOutcomes?.join("\n") || ""}
        />
        <p className="text-xs text-muted-foreground">
          One outcome per line
        </p>
      </div>

      {course && (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="isPublished" className="text-base font-medium">
              Publish Course
            </Label>
            <p className="text-xs text-muted-foreground">
              Make this course visible to students
            </p>
          </div>
          <Switch
            id="isPublished"
            name="isPublished"
            defaultChecked={course.isPublished}
          />
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/instructor/courses">
            <ArrowLeft className="mr-2 size-4" />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {course ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              {course ? "Update Course" : "Create Course"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
