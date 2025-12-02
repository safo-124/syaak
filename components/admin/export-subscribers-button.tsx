"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  name: string | null
  subscribedAt: Date
  source: string | null
}

interface ExportSubscribersButtonProps {
  subscribers: Subscriber[]
}

export function ExportSubscribersButton({ subscribers }: ExportSubscribersButtonProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ["Email", "Name", "Subscribed Date", "Source"]
    const rows = subscribers.map((s) => [
      s.email,
      s.name || "",
      new Date(s.subscribedAt).toLocaleDateString(),
      s.source || "",
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tech4gh-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={subscribers.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV ({subscribers.length})
    </Button>
  )
}
