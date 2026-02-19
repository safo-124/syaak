"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createFaqItemAction, updateFaqItemAction } from "@/app/actions/about"

type FaqData = {
  id?: string
  question?: string | null
  answer?: string | null
  order?: number
  isVisible?: boolean
}

export function FaqForm({ initialData, mode }: { initialData?: FaqData; mode: "create" | "edit" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(initialData?.isVisible ?? true)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set("isVisible", String(isVisible))

    let res
    if (mode === "edit" && initialData?.id) {
      res = await updateFaqItemAction(initialData.id, formData)
    } else {
      res = await createFaqItemAction(formData)
    }
    setLoading(false)
    if (res.success) {
      toast.success(mode === "create" ? "FAQ added!" : "FAQ updated!")
      router.push("/admin/about")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to save")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader><CardTitle>FAQ Item</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input id="question" name="question" required defaultValue={initialData?.question || ""} placeholder="What courses do you offer?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea id="answer" name="answer" required rows={6} defaultValue={initialData?.answer || ""} placeholder="We offer..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={initialData?.order ?? 0} min={0} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
              <Label htmlFor="isVisible">Visible</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : mode === "create" ? "Add FAQ" : "Update FAQ"}
        </Button>
      </div>
    </form>
  )
}
