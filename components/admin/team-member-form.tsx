"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Upload, Link2, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createTeamMemberAction, updateTeamMemberAction } from "@/app/actions/about"

type TeamMemberData = {
  id?: string
  name?: string | null
  role?: string | null
  bio?: string | null
  imageUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  githubUrl?: string | null
  order?: number
  isVisible?: boolean
  showOnHomepage?: boolean
}

export function TeamMemberForm({ initialData, mode }: { initialData?: TeamMemberData; mode: "create" | "edit" }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isVisible, setIsVisible] = useState(initialData?.isVisible ?? true)
  const [showOnHomepage, setShowOnHomepage] = useState(initialData?.showOnHomepage ?? false)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [imageTab, setImageTab] = useState<"upload" | "url">(
    initialData?.imageUrl && !initialData.imageUrl.startsWith("/uploads/") ? "url" : "upload"
  )

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setImageUrl(data.url)
      toast.success("Image uploaded!")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set("isVisible", String(isVisible))
    formData.set("showOnHomepage", String(showOnHomepage))
    formData.set("imageUrl", imageUrl)

    let res
    if (mode === "edit" && initialData?.id) {
      res = await updateTeamMemberAction(initialData.id, formData)
    } else {
      res = await createTeamMemberAction(formData)
    }
    setLoading(false)
    if (res.success) {
      toast.success(mode === "create" ? "Team member added!" : "Team member updated!")
      router.push("/admin/about")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to save")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required defaultValue={initialData?.name || ""} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title *</Label>
              <Input id="role" name="role" required defaultValue={initialData?.role || ""} placeholder="Lead Instructor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={initialData?.order ?? 0} min={0} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
              <Label htmlFor="isVisible">Visible on About page</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="showOnHomepage" checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
              <Label htmlFor="showOnHomepage">Show on Homepage</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Photo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={imageTab} onValueChange={(v) => setImageTab(v as "upload" | "url")}>
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1 gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1 gap-1.5">
                  <Link2 className="h-3.5 w-3.5" />
                  Image URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-3 mt-3">
                <div
                  className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload<br />
                        <span className="text-xs">PNG, JPG, WebP up to 5 MB</span>
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </TabsContent>

              <TabsContent value="url" className="mt-3">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={imageUrl.startsWith("/uploads/") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            {imageUrl && (
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border shrink-0">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{imageUrl}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 mt-1 h-7 px-2 text-xs"
                    onClick={() => { setImageUrl(""); if (fileInputRef.current) fileInputRef.current.value = "" }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Bio & Social</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={initialData?.bio || ""} placeholder="Brief biography..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" name="linkedinUrl" defaultValue={initialData?.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter / X URL</Label>
              <Input id="twitterUrl" name="twitterUrl" defaultValue={initialData?.twitterUrl || ""} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" name="githubUrl" defaultValue={initialData?.githubUrl || ""} placeholder="https://github.com/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? "Saving…" : mode === "create" ? "Add Member" : "Update Member"}
        </Button>
      </div>
    </form>
  )
}
