"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, Image as ImageIcon, Globe, Star } from "lucide-react"
import { createSolutionAction, updateSolutionAction } from "@/app/actions/solutions"

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Analytics",
  "AI & Automation",
  "Cloud & Infrastructure",
  "UI/UX Design",
  "Cybersecurity",
  "Database Solutions",
  "E-commerce",
  "Other",
]

type Solution = {
  id: string
  title: string
  shortSummary: string | null
  description: string | null
  category: string
  imageUrl: string | null
  galleryImages: string[]
  techStack: string[]
  tags: string[]
  clientName: string | null
  clientLogo: string | null
  liveUrl: string | null
  isPublished: boolean
  isFeatured: boolean
  order: number
}

interface SolutionFormProps {
  solution?: Solution
}

export function SolutionForm({ solution }: SolutionFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [isPublished, setIsPublished] = useState(solution?.isPublished ?? false)
  const [isFeatured, setIsFeatured] = useState(solution?.isFeatured ?? false)
  const [category, setCategory] = useState(solution?.category ?? "")
  const [imagePreview, setImagePreview] = useState(solution?.imageUrl ?? "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("isPublished", isPublished ? "true" : "false")
    formData.set("isFeatured", isFeatured ? "true" : "false")
    formData.set("category", category)

    const result = solution
      ? await updateSolutionAction(solution.id, formData)
      : await createSolutionAction(formData)

    setSaving(false)

    if (result.success) {
      toast.success(solution ? "Solution updated!" : "Solution created!")
      router.push("/admin/solutions")
      router.refresh()
    } else {
      toast.error(result.error ?? "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <CardTitle>Solution Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={solution?.title}
                  placeholder="e.g. E-commerce Platform for GreenMart"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortSummary">Short Summary</Label>
                <Input
                  id="shortSummary"
                  name="shortSummary"
                  defaultValue={solution?.shortSummary ?? ""}
                  placeholder="One-liner shown on homepage cards"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={solution?.description ?? ""}
                  rows={6}
                  placeholder="Describe the project, challenges solved, and impact..."
                  className="bg-background"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={solution?.order ?? 0}
                    min={0}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  defaultValue={solution?.techStack.join(", ") ?? ""}
                  placeholder="React, Node.js, PostgreSQL (comma separated)"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Separate with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={solution?.tags.join(", ") ?? ""}
                  placeholder="fintech, automation, dashboard (comma separated)"
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <CardTitle>Client / Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client / Project Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    defaultValue={solution?.clientName ?? ""}
                    placeholder="GreenMart Ltd."
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    defaultValue={solution?.liveUrl ?? ""}
                    placeholder="https://example.com"
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientLogo">Client Logo URL</Label>
                <Input
                  id="clientLogo"
                  name="clientLogo"
                  defaultValue={solution?.clientLogo ?? ""}
                  placeholder="https://cdn.example.com/logo.png"
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-4" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-xs text-muted-foreground">Show on homepage</p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Featured</p>
                    <p className="text-xs text-muted-foreground">Highlight in hero row</p>
                  </div>
                </div>
                <Switch
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                Main Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={solution?.imageUrl ?? ""}
                  placeholder="https://..."
                  className="bg-background"
                  onChange={(e) => setImagePreview(e.target.value)}
                />
              </div>
              {imagePreview && (
                <div className="overflow-hidden rounded-lg border aspect-video">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="galleryImages">Gallery Images (optional)</Label>
                <Textarea
                  id="galleryImages"
                  name="galleryImages"
                  defaultValue={solution?.galleryImages.join("\n") ?? ""}
                  rows={4}
                  placeholder={"https://img1.png\nhttps://img2.png"}
                  className="bg-background font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">One URL per line</p>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <Button type="submit" className="w-full" disabled={saving || !category}>
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                {solution ? "Save Changes" : "Create Solution"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
