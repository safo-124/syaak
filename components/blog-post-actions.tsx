"use client"

import { Button } from "@/components/ui/button"
import { SocialShare } from "@/components/social-share"
import { Bookmark } from "lucide-react"

interface BlogPostActionsProps {
  url: string
  title: string
  excerpt?: string
}

export function BlogPostActions({ url, title, excerpt }: BlogPostActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <SocialShare url={url} title={title} description={excerpt} />
      <Button variant="outline" size="sm" className="glass">
        <Bookmark className="h-4 w-4 mr-2" />
        Save
      </Button>
    </div>
  )
}
