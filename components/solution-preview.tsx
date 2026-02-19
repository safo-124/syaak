"use client"

import { useState } from "react"
import { ExternalLink, Layers, AlertCircle } from "lucide-react"

interface SolutionPreviewProps {
  liveUrl: string | null
  imageUrl: string | null
  title: string
}

export function SolutionPreview({ liveUrl, imageUrl, title }: SolutionPreviewProps) {
  const [iframeError, setIframeError] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Show live iframe preview if liveUrl is set and no error
  if (liveUrl && !iframeError) {
    return (
      <div className="relative aspect-video overflow-hidden bg-muted group/preview">
        {/* Browser chrome bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border-b px-3 py-1.5">
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-red-400" />
            <div className="size-2 rounded-full bg-yellow-400" />
            <div className="size-2 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-2 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono truncate">
            {liveUrl.replace(/^https?:\/\//, "")}
          </div>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Loading skeleton */}
        {!iframeLoaded && (
          <div className="absolute inset-0 top-7 flex items-center justify-center bg-muted animate-pulse">
            <div className="text-xs text-muted-foreground">Loading preview…</div>
          </div>
        )}

        {/* Iframe scaled to fit */}
        <iframe
          src={liveUrl}
          title={`${title} preview`}
          className="absolute left-0 right-0 bottom-0 top-7 w-[200%] h-[calc(200%-28px)] origin-top-left pointer-events-none"
          style={{ transform: "scale(0.5)" }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
        />

        {/* Click overlay — opens live site */}
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 top-7 z-20 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]"
        >
          <span className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow-lg">
            <ExternalLink className="size-4" />
            Visit Website
          </span>
        </a>
      </div>
    )
  }

  // Fallback: static image
  if (imageUrl) {
    return (
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    )
  }

  // No image, no URL — placeholder
  return (
    <div className="aspect-video flex h-full w-full items-center justify-center bg-muted">
      <Layers className="size-12 text-muted-foreground/30" />
    </div>
  )
}
