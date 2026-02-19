"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { toggleSolutionPublishedAction } from "@/app/actions/solutions"

export function SolutionTogglePublished({
  id,
  isPublished,
}: {
  id: string
  isPublished: boolean
}) {
  const [checked, setChecked] = useState(isPublished)
  const [loading, setLoading] = useState(false)

  async function handleToggle(value: boolean) {
    setChecked(value)
    setLoading(true)
    const result = await toggleSolutionPublishedAction(id, value)
    setLoading(false)
    if (result.success) {
      toast.success(value ? "Solution published" : "Solution unpublished")
    } else {
      setChecked(!value)
      toast.error("Failed to update")
    }
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleToggle}
      disabled={loading}
      title={checked ? "Published — click to unpublish" : "Unpublished — click to publish"}
    />
  )
}
