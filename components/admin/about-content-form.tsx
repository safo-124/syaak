"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveAboutPageAction } from "@/app/actions/about"

type StatItem = { label: string; value: string }
type ValueItem = { title: string; description: string; icon?: string }

type AboutPageData = {
  heroTagline?: string | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImageUrl?: string | null
  missionTitle?: string | null
  missionBody?: string | null
  visionTitle?: string | null
  visionBody?: string | null
  storyTitle?: string | null
  storyBody?: string | null
  galleryImages?: string[]
  stats?: StatItem[]
  values?: ValueItem[]
}

export function AboutContentForm({ initialData }: { initialData?: AboutPageData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState<StatItem[]>(
    (initialData?.stats as StatItem[]) || [
      { label: "Students Trained", value: "500+" },
      { label: "Companies Served", value: "50+" },
      { label: "Solutions Delivered", value: "100+" },
      { label: "Years Experience", value: "5+" },
    ]
  )
  const [values, setValues] = useState<ValueItem[]>(
    (initialData?.values as ValueItem[]) || [
      { title: "Innovation", description: "We embrace new technologies and creative solutions.", icon: "💡" },
      { title: "Excellence", description: "We deliver high-quality work in everything we do.", icon: "⭐" },
      { title: "Integrity", description: "We operate with transparency and honesty.", icon: "🤝" },
      { title: "Impact", description: "We measure success by the difference we make.", icon: "🚀" },
    ]
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set("stats", JSON.stringify(stats))
    formData.set("values", JSON.stringify(values))
    const res = await saveAboutPageAction(formData)
    setLoading(false)
    if (res.success) {
      toast.success("About page saved!")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to save")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="hero">
        <TabsList className="mb-6 flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
          <TabsTrigger value="story">Our Story</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTagline">Tagline (small text above title)</Label>
                <Input id="heroTagline" name="heroTagline" defaultValue={initialData?.heroTagline || ""} placeholder="e.g. Technology Training & Solutions" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input id="heroTitle" name="heroTitle" defaultValue={initialData?.heroTitle || ""} placeholder="e.g. Empowering Ghana Through Technology" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={initialData?.heroSubtitle || ""} rows={3} placeholder="Brief description for the hero..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                <Input id="heroImageUrl" name="heroImageUrl" defaultValue={initialData?.heroImageUrl || ""} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MISSION & VISION */}
        <TabsContent value="mission">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="missionTitle">Title</Label>
                  <Input id="missionTitle" name="missionTitle" defaultValue={initialData?.missionTitle || "Our Mission"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missionBody">Body</Label>
                  <Textarea id="missionBody" name="missionBody" defaultValue={initialData?.missionBody || ""} rows={6} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visionTitle">Title</Label>
                  <Input id="visionTitle" name="visionTitle" defaultValue={initialData?.visionTitle || "Our Vision"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visionBody">Body</Label>
                  <Textarea id="visionBody" name="visionBody" defaultValue={initialData?.visionBody || ""} rows={6} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* STORY */}
        <TabsContent value="story">
          <Card>
            <CardHeader><CardTitle>Our Story</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storyTitle">Title</Label>
                <Input id="storyTitle" name="storyTitle" defaultValue={initialData?.storyTitle || "Our Story"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storyBody">Story (supports multiple paragraphs)</Label>
                <Textarea id="storyBody" name="storyBody" defaultValue={initialData?.storyBody || ""} rows={12} placeholder="Tell the company story..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATS */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Stats Bar
                <Button type="button" variant="outline" size="sm" onClick={() => setStats([...stats, { label: "", value: "" }])}>
                  + Add Stat
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <Label>Value</Label>
                    <Input value={stat.value} onChange={(e) => {
                      const s = [...stats]; s[i] = { ...s[i], value: e.target.value }; setStats(s)
                    }} placeholder="500+" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label>Label</Label>
                    <Input value={stat.label} onChange={(e) => {
                      const s = [...stats]; s[i] = { ...s[i], label: e.target.value }; setStats(s)
                    }} placeholder="Students Trained" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VALUES */}
        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Core Values
                <Button type="button" variant="outline" size="sm" onClick={() => setValues([...values, { title: "", description: "", icon: "" }])}>
                  + Add Value
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((val, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3 items-end">
                    <div className="w-20 space-y-1">
                      <Label>Icon</Label>
                      <Input value={val.icon || ""} onChange={(e) => {
                        const v = [...values]; v[i] = { ...v[i], icon: e.target.value }; setValues(v)
                      }} placeholder="💡" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label>Title</Label>
                      <Input value={val.title} onChange={(e) => {
                        const v = [...values]; v[i] = { ...v[i], title: e.target.value }; setValues(v)
                      }} placeholder="Innovation" />
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => setValues(values.filter((_, j) => j !== i))}>
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea value={val.description} rows={2} onChange={(e) => {
                      const v = [...values]; v[i] = { ...v[i], description: e.target.value }; setValues(v)
                    }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY */}
        <TabsContent value="gallery">
          <Card>
            <CardHeader><CardTitle>Gallery Images</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="galleryImages">Image URLs (one per line)</Label>
                <Textarea
                  id="galleryImages"
                  name="galleryImages"
                  defaultValue={(initialData?.galleryImages || []).join("\n")}
                  rows={8}
                  placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden fields for stats/values (set via JS before submit) */}
      <input type="hidden" name="stats" value={JSON.stringify(stats)} />
      <input type="hidden" name="values" value={JSON.stringify(values)} />

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save About Page"}
        </Button>
      </div>
    </form>
  )
}
