"use client"

import { useState, useRef } from "react"
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
import { Loader2, Save, Image as ImageIcon, Globe, Star, Upload, X, Plus } from "lucide-react"
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
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [isPublished, setIsPublished] = useState(solution?.isPublished ?? false)
  const [isFeatured, setIsFeatured] = useState(solution?.isFeatured ?? false)
  const [category, setCategory] = useState(solution?.category ?? "")
  const [imagePreview, setImagePreview] = useState(solution?.imageUrl ?? "")
  const [imageUrlValue, setImageUrlValue] = useState(solution?.imageUrl ?? "")
  const [galleryImages, setGalleryImages] = useState<string[]>(solution?.galleryImages ?? [])
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.set("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      return data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
      return null
    }
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadFile(file)
    if (url) {
      setImageUrlValue(url)
      setImagePreview(url)
    }
    setUploading(false)
    e.target.value = ""
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setUploadingGallery(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const url = await uploadFile(file)
      if (url) newUrls.push(url)
    }
    setGalleryImages((prev) => [...prev, ...newUrls])
    setUploadingGallery(false)
    e.target.value = ""
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
  }

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
                  value={imageUrlValue}
                  placeholder="https://..."
                  className="bg-background"
                  onChange={(e) => {
                    setImageUrlValue(e.target.value)
                    setImagePreview(e.target.value)
                  }}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground dark:bg-black/20">or</span>
                </div>
              </div>

              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploading}
                onClick={() => mainImageInputRef.current?.click()}
              >
                {uploading ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="mr-2 size-4" /> Upload from device</>
                )}
              </Button>

              {imagePreview && (
                <div className="relative overflow-hidden rounded-lg border aspect-video">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("")
                      setImageUrlValue("")
                    }}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Gallery */}
              <div className="space-y-2 pt-2 border-t">
                <Label>Gallery Images (optional)</Label>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {galleryImages.map((url, i) => (
                      <div key={i} className="group relative overflow-hidden rounded-lg border aspect-video">
                        <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={uploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  {uploadingGallery ? (
                    <><Loader2 className="mr-2 size-3.5 animate-spin" /> Uploading...</>
                  ) : (
                    <><Plus className="mr-2 size-3.5" /> Add gallery images</>
                  )}
                </Button>

                <Textarea
                  id="galleryImages"
                  name="galleryImages"
                  value={galleryImages.join("\n")}
                  onChange={(e) => setGalleryImages(e.target.value.split("\n").filter(Boolean))}
                  rows={3}
                  placeholder={"Paste URLs here, one per line"}
                  className="bg-background font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">Upload files or paste URLs (one per line)</p>
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
