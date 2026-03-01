"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { toggleSolutionOngoingAction } from "@/app/actions/solutions"
import { Hammer } from "lucide-react"

export function SolutionToggleOngoing({
  id,
  isOngoing,
}: {
  id: string
  isOngoing: boolean
}) {
  const [checked, setChecked] = useState(isOngoing)
  const [loading, setLoading] = useState(false)

  async function handleToggle(value: boolean) {
    setChecked(value)
    setLoading(true)
    const result = await toggleSolutionOngoingAction(id, value)
    setLoading(false)
    if (result.success) {
      toast.success(value ? "Marked as ongoing" : "Marked as completed")
    } else {
      setChecked(!value)
      toast.error("Failed to update")
    }
  }

  return (
    <div className="flex items-center gap-1.5" title={checked ? "Ongoing — click to mark complete" : "Completed — click to mark ongoing"}>
      <Hammer className={`size-3.5 ${checked ? "text-orange-500" : "text-muted-foreground/40"}`} />
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={loading}
        className="data-[state=checked]:bg-orange-500"
      />
    </div>
  )
}
