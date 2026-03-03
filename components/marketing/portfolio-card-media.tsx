"use client"

import { useState } from "react"
import { Layers } from "lucide-react"

interface PortfolioCardMediaProps {
  imageUrl: string | null
  liveUrl: string | null
  title: string
  category: string
}

export function PortfolioCardMedia({
  imageUrl,
  liveUrl,
  title,
  category,
}: PortfolioCardMediaProps) {
  const [imgError, setImgError] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // 1. Static image — only if the URL is valid and hasn't errored
  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgError(true)}
      />
    )
  }

  // 2. Live iframe — when no image (or image broke) and a liveUrl exists
  if (liveUrl && !iframeError) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-white dark:bg-zinc-900">
        {/* Loading shimmer */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted">
            <div className="flex gap-1.5 animate-pulse">
              <div className="size-2 rounded-full bg-muted-foreground/40" />
              <div className="size-2 rounded-full bg-muted-foreground/25" />
              <div className="size-2 rounded-full bg-muted-foreground/15" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {liveUrl.replace(/^https?:\/\//, "").split("/")[0]}
            </span>
          </div>
        )}

        {/* Browser chrome bar */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center gap-1.5 border-b bg-background/95 px-3 py-1.5 backdrop-blur-sm">
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-red-400" />
            <div className="size-2 rounded-full bg-yellow-400" />
            <div className="size-2 rounded-full bg-green-400" />
          </div>
          <div className="mx-2 flex-1 truncate rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {liveUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {/* The iframe — scaled down so the full desktop layout fits */}
        <iframe
          src={liveUrl}
          title={`${title} live preview`}
          className="absolute left-0 top-7 border-0 pointer-events-none"
          style={{
            width: "200%",
            height: "calc(200% - 28px)",
            transform: "scale(0.5)",
            transformOrigin: "top left",
          }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
        />
      </div>
    )
  }

  // 3. Placeholder — no image and no working URL
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/8 via-blue-500/5 to-purple-500/8">
      <Layers className="size-12 text-muted-foreground/20" />
      <span className="text-[11px] font-medium text-muted-foreground/30">{category}</span>
    </div>
  )
}

