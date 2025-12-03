"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { createPostAction, updatePostAction } from "@/app/actions/blog"
import type { Post, BlogCategory } from "@/app/generated/prisma/client"
import Link from "next/link"
import { useTransition } from "react"
import { 
  ArrowLeft, 
  FileText,
  User,
  Tag,
  Clock,
  Image,
  Save,
  Loader2
} from "lucide-react"

interface BlogFormProps {
  post?: Post & { category?: BlogCategory | null }
  categories?: BlogCategory[]
}

export function BlogForm({ post, categories = [] }: BlogFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (post) {
        await updatePostAction(post.id, formData)
      } else {
        await createPostAction(formData)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {post ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {post 
              ? "Update your blog post content" 
              : "Write a new article for your blog"
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
                  <FileText className="size-5 text-primary" />
                  <CardTitle className="text-lg">Post Content</CardTitle>
                </div>
                <CardDescription>
                  The main content of your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={post?.title} 
                      placeholder="e.g. Getting Started with Python" 
                      className="bg-background"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                        /blog/
                      </span>
                      <Input 
                        id="slug" 
                        name="slug" 
                        defaultValue={post?.slug} 
                        placeholder="getting-started-python" 
                        className="rounded-l-none bg-background"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    name="excerpt" 
                    defaultValue={post?.excerpt || ""} 
                    placeholder="A brief summary that appears on blog cards..." 
                    className="bg-background"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed on blog listing pages
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    defaultValue={post?.content || ""} 
                    placeholder="Write your blog post content here. You can use markdown for formatting..." 
                    className="min-h-[300px] bg-background font-mono text-sm"
                    rows={15}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports markdown formatting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="size-5 text-primary" />
                  <CardTitle className="text-lg">Post Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    defaultValue={post?.author || ""} 
                    placeholder="Your name" 
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <select 
                    id="categoryId" 
                    name="categoryId" 
                    defaultValue={post?.categoryId || ""} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="readTime" 
                      name="readTime" 
                      type="number"
                      defaultValue={post?.readTime || ""} 
                      placeholder="5" 
                      className="bg-background pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tag className="size-5 text-primary" />
                  <CardTitle className="text-lg">Tags</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input 
                    id="tags" 
                    name="tags" 
                    defaultValue={post?.tags?.join(", ") || ""} 
                    placeholder="python, beginners, data" 
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="size-5 text-primary" />
                  <CardTitle className="text-lg">Cover Image</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input 
                    id="coverImage" 
                    name="coverImage" 
                    defaultValue={post?.coverImage || ""} 
                    placeholder="https://example.com/image.jpg" 
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to cover image
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
              <CardHeader>
                <CardTitle className="text-lg">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished" className="text-base font-medium">
                      Publish Post
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Make visible on the blog
                    </p>
                  </div>
                  <Switch 
                    id="isPublished" 
                    name="isPublished" 
                    defaultChecked={post?.isPublished} 
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isFeatured" className="text-base font-medium">
                      Featured Post
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show on homepage
                    </p>
                  </div>
                  <Switch 
                    id="isFeatured" 
                    name="isFeatured" 
                    defaultChecked={post?.isFeatured} 
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
                        {post ? "Update Post" : "Create Post"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/blog">Cancel</Link>
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
