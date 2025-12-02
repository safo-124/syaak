"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"
import { subscribeAction } from "@/app/actions/newsletter"

interface NewsletterFormProps {
  variant?: "default" | "compact"
  className?: string
  source?: string
}

export function NewsletterForm({ variant = "default", className = "", source = "footer" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("source", source)
      
      const result = await subscribeAction(formData)
      
      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message || "Thanks for subscribing!")
        setEmail("")
      } else {
        setError(result.error || "Something went wrong")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className={`flex items-center gap-2 text-green-500 ${className}`}>
        <CheckCircle2 className="size-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 bg-background/50"
            disabled={isPending}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 pl-10"
            disabled={isPending}
          />
        </div>
        <Button type="submit" size="lg" className="h-12" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Get weekly tips, tutorials, and updates. No spam, unsubscribe anytime.
      </p>
    </form>
  )
}
