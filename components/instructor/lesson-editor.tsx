"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Save,
  Loader2,
  Video,
  FileText,
  Code,
  Link as LinkIcon,
  Upload,
  Eye,
  ArrowLeft,
  Clock,
  GripVertical,
  Plus,
  Trash2,
  Image,
  Youtube,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface LessonEditorProps {
  lesson?: {
    id: string
    title: string
    slug: string
    content: string | null
    videoUrl: string | null
    duration: number | null
    order: number
    isPreview: boolean
    moduleId: string
  }
  moduleId: string
  courseSlug: string
  onSave?: (data: LessonData) => Promise<{ success: boolean; error?: string }>
}

interface LessonData {
  title: string
  slug: string
  content: string
  videoUrl: string
  duration: number
  order: number
  isPreview: boolean
  contentType: string
  resources: Resource[]
}

interface Resource {
  id: string
  type: "file" | "link" | "code"
  title: string
  url?: string
  content?: string
}

export function LessonEditor({
  lesson,
  moduleId,
  courseSlug,
  onSave,
}: LessonEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  // Form state
  const [title, setTitle] = useState(lesson?.title || "")
  const [slug, setSlug] = useState(lesson?.slug || "")
  const [content, setContent] = useState(lesson?.content || "")
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || "")
  const [duration, setDuration] = useState(lesson?.duration || 0)
  const [isPreview, setIsPreview] = useState(lesson?.isPreview || false)
  const [contentType, setContentType] = useState<"video" | "text" | "mixed">("mixed")
  const [resources, setResources] = useState<Resource[]>([])
  
  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!lesson) {
      setSlug(generateSlug(value))
    }
  }

  const addResource = (type: "file" | "link" | "code") => {
    setResources([
      ...resources,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: "",
        url: "",
        content: "",
      },
    ])
  }

  const removeResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id))
  }

  const updateResource = (id: string, field: keyof Resource, value: string) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a lesson title")
      return
    }

    const data: LessonData = {
      title,
      slug: slug || generateSlug(title),
      content,
      videoUrl,
      duration,
      order: lesson?.order || 0,
      isPreview,
      contentType,
      resources,
    }

    startTransition(async () => {
      if (onSave) {
        const result = await onSave(data)
        if (result.success) {
          toast.success(lesson ? "Lesson updated!" : "Lesson created!")
          router.push(`/instructor/courses/${courseSlug}/curriculum`)
        } else {
          toast.error(result.error || "Something went wrong")
        }
      } else {
        // Simulate save for demo
        toast.success(lesson ? "Lesson updated!" : "Lesson created!")
        router.push(`/instructor/courses/${courseSlug}/curriculum`)
      }
    })
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )
    return match ? match[1] : null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/instructor/courses/${courseSlug}/curriculum`}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {lesson ? "Edit Lesson" : "Create Lesson"}
            </h1>
            <p className="text-muted-foreground">
              Build engaging lesson content
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="mr-2 size-4" />
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Lesson
              </>
            )}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <CardTitle>{title || "Untitled Lesson"}</CardTitle>
            {duration > 0 && (
              <CardDescription className="flex items-center gap-2">
                <Clock className="size-4" />
                {duration} minutes
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {videoUrl && (
              <div className="aspect-video overflow-hidden rounded-lg bg-black">
                {extractYouTubeId(videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                    className="h-full w-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoUrl} controls className="h-full w-full" />
                )}
              </div>
            )}
            {content && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
                <CardDescription>
                  Basic information about this lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Introduction to Variables"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      placeholder="introduction-to-variables"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select
                      value={contentType}
                      onValueChange={(v) => setContentType(v as "video" | "text" | "mixed")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <span className="flex items-center gap-2">
                            <Video className="size-4" />
                            Video Only
                          </span>
                        </SelectItem>
                        <SelectItem value="text">
                          <span className="flex items-center gap-2">
                            <FileText className="size-4" />
                            Text Only
                          </span>
                        </SelectItem>
                        <SelectItem value="mixed">
                          <span className="flex items-center gap-2">
                            <FileText className="size-4" />
                            Mixed Content
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>
                  Write the main content for this lesson. You can use Markdown formatting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your lesson content here...

You can include:
- Explanations and concepts
- Step-by-step instructions
- Code examples
- Tips and best practices"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Supports Markdown formatting for headings, lists, code blocks, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Content</CardTitle>
                <CardDescription>
                  Add a video to this lesson from YouTube or upload your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="videoUrl"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Upload className="mr-2 size-4" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Video</DialogTitle>
                          <DialogDescription>
                            Upload a video file for this lesson
                          </DialogDescription>
                        </DialogHeader>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Video className="mx-auto size-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your video here, or click to browse
                          </p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                          <p className="mt-2 text-xs text-muted-foreground">
                            MP4, WebM or MOV. Max 500MB.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button disabled>Upload</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube, Vimeo, or direct video URL
                  </p>
                </div>

                {/* Video Preview */}
                {videoUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                      {extractYouTubeId(videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                          className="h-full w-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Video className="size-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick YouTube Link */}
                <div className="flex items-center gap-2 rounded-lg border p-4 bg-muted/30">
                  <Youtube className="size-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Using YouTube?</p>
                    <p className="text-xs text-muted-foreground">
                      Just paste the video URL and we'll embed it automatically
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lesson Resources</CardTitle>
                    <CardDescription>
                      Add downloadable files, links, or code snippets
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addResource("file")}
                    >
                      <Image className="mr-2 size-4" />
                      File
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addResource("link")}
                    >
                      <LinkIcon className="mr-2 size-4" />
                      Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addResource("code")}
                    >
                      <Code className="mr-2 size-4" />
                      Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resources.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="size-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium">No resources yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add files, links, or code snippets for students to download
                    </p>
                    <Button variant="outline" onClick={() => addResource("file")}>
                      <Plus className="mr-2 size-4" />
                      Add Resource
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-start gap-3 rounded-lg border p-4"
                      >
                        <div className="cursor-move text-muted-foreground">
                          <GripVertical className="size-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            {resource.type === "file" && (
                              <Image className="size-4 text-blue-500" />
                            )}
                            {resource.type === "link" && (
                              <LinkIcon className="size-4 text-green-500" />
                            )}
                            {resource.type === "code" && (
                              <Code className="size-4 text-purple-500" />
                            )}
                            <Input
                              placeholder="Resource title"
                              value={resource.title}
                              onChange={(e) =>
                                updateResource(resource.id, "title", e.target.value)
                              }
                              className="h-8"
                            />
                          </div>
                          {resource.type === "code" ? (
                            <Textarea
                              placeholder="Paste your code here..."
                              value={resource.content || ""}
                              onChange={(e) =>
                                updateResource(resource.id, "content", e.target.value)
                              }
                              rows={4}
                              className="font-mono text-sm"
                            />
                          ) : (
                            <Input
                              placeholder={
                                resource.type === "file"
                                  ? "File URL or upload"
                                  : "https://..."
                              }
                              value={resource.url || ""}
                              onChange={(e) =>
                                updateResource(resource.id, "url", e.target.value)
                              }
                              className="h-8"
                            />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeResource(resource.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Settings</CardTitle>
                <CardDescription>
                  Configure access and visibility options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Free Preview</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow non-enrolled students to view this lesson
                    </p>
                  </div>
                  <Switch checked={isPreview} onCheckedChange={setIsPreview} />
                </div>

                <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-950/20">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Tip: Free Previews
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Marking 1-2 lessons as free previews can help convert visitors
                    into enrolled students by giving them a taste of your content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
