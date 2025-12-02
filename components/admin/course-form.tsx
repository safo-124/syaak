"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createCourse, updateCourse } from "@/app/actions/courses"
import type { Course } from "@/app/generated/prisma/client"
import Link from "next/link"
import { useTransition } from "react"
import { 
  ArrowLeft, 
  BookOpen, 
  DollarSign, 
  Clock, 
  Layers, 
  Code, 
  Globe,
  Save,
  Loader2,
  CheckCircle2
} from "lucide-react"

interface CourseFormProps {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (course) {
        await updateCourse(course.id, formData)
      } else {
        await createCourse(formData)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {course ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {course 
              ? "Update course details and settings" 
              : "Add a new course to your training catalog"
            }
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Essential details about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={course?.title} 
                      placeholder="e.g. Data Science with Python" 
                      className="bg-background"
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
                        defaultValue={course?.slug} 
                        placeholder="data-science-python" 
                        className="rounded-l-none bg-background"
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
                    defaultValue={course?.shortSummary || ""} 
                    placeholder="A brief overview that appears on course cards..." 
                    className="bg-background"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed on course cards and search results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={course?.description || ""} 
                    placeholder="Detailed course description including what students will learn..." 
                    className="min-h-[160px] bg-background"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  <CardTitle className="text-lg">Course Details</CardTitle>
                </div>
                <CardDescription>
                  Level, duration, and format information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="level">Difficulty Level</Label>
                    <Select name="level" defaultValue={course?.level || "BEGINNER"}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-green-500" />
                            Beginner
                          </div>
                        </SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-500" />
                            Intermediate
                          </div>
                        </SelectItem>
                        <SelectItem value="ADVANCED">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-purple-500" />
                            Advanced
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="duration" 
                        name="duration" 
                        defaultValue={course?.duration || ""} 
                        placeholder="e.g. 6 weeks" 
                        className="bg-background pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="format" 
                        name="format" 
                        defaultValue={course?.format || ""} 
                        placeholder="Online, In-person" 
                        className="bg-background pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack & Tools</Label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input 
                      id="techStack" 
                      name="techStack" 
                      defaultValue={course?.techStack?.join(", ") || ""} 
                      placeholder="Python, Pandas, NumPy, Jupyter" 
                      className="bg-background pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Separate technologies with commas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  <CardTitle className="text-lg">What You'll Learn</CardTitle>
                </div>
                <CardDescription>
                  Key learning outcomes for this course (one per line)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea 
                    id="learningOutcomes" 
                    name="learningOutcomes" 
                    defaultValue={course?.learningOutcomes?.join("\n") || ""} 
                    placeholder="Build professional web applications from scratch
Master Python programming fundamentals
Work with databases and APIs
Deploy applications to the cloud
Collaborate using Git and GitHub" 
                    className="min-h-[160px] bg-background font-mono text-sm"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter each learning outcome on a new line. These will appear as bullet points on the course page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5 text-primary" />
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      defaultValue={course?.price || ""} 
                      placeholder="0" 
                      className="bg-background pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty or 0 for free courses
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <CardTitle className="text-lg">Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished" className="text-base font-medium">
                      Publish Course
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Make visible on the public site
                    </p>
                  </div>
                  <Switch 
                    id="isPublished" 
                    name="isPublished" 
                    defaultChecked={course?.isPublished} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-none bg-primary/5 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        {course ? "Update Course" : "Create Course"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/courses">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
