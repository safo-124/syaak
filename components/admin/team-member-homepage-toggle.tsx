"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Home } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toggleTeamMemberHomepageAction } from "@/app/actions/about"

export function TeamMemberHomepageToggle({
  id,
  defaultChecked,
}: {
  id: string
  defaultChecked: boolean
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(defaultChecked)
  const [loading, setLoading] = useState(false)

  async function handleChange(val: boolean) {
    setLoading(true)
    setChecked(val)
    const res = await toggleTeamMemberHomepageAction(id, val)
    setLoading(false)
    if (res.success) {
      toast.success(val ? "Added to homepage" : "Removed from homepage")
      router.refresh()
    } else {
      setChecked(!val)
      toast.error(res.error || "Failed to update")
    }
  }

  return (
    <div className="flex items-center gap-1.5" title="Show on homepage">
      <Home className="h-3 w-3 text-muted-foreground" />
      <Switch
        checked={checked}
        onCheckedChange={handleChange}
        disabled={loading}
        className="scale-75"
      />
    </div>
  )
}
