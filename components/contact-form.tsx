"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitContactAction } from "@/app/actions/contact"
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react"

const subjects = [
  "Course Inquiry",
  "Corporate Training",
  "Partnership Opportunity",
  "Technical Support",
  "Feedback",
  "Other",
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitContactAction(formData)

    setIsSubmitting(false)

    if (response.success) {
      setResult({ type: "success", message: response.message || "Message sent!" })
      ;(e.target as HTMLFormElement).reset()
    } else {
      setResult({ type: "error", message: response.error || "Failed to send message" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-primary">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            disabled={isSubmitting}
            className="transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          />
        </div>
        <div className="group space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-primary">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isSubmitting}
            className="transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-primary">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233 20 123 4567"
            disabled={isSubmitting}
            className="transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          />
        </div>
        <div className="group space-y-1.5">
          <Label htmlFor="subject" className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-primary">Subject *</Label>
          <Select name="subject" required disabled={isSubmitting}>
            <SelectTrigger id="subject" className="transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="group space-y-1.5">
        <Label htmlFor="message" className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-primary">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help you..."
          rows={5}
          required
          disabled={isSubmitting}
          className="resize-none transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
        />
      </div>

      {result && (
        <div 
          className={`flex items-center gap-2 rounded-xl p-4 animate-fade-in-up ${
            result.type === "success" 
              ? "bg-green-500/10 text-green-600 dark:text-green-400" 
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm">{result.message}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full group/btn transition-all duration-200 hover:shadow-md" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </>
        )}
      </Button>

      <p className="text-[11px] text-center text-muted-foreground/60">
        By submitting this form, you agree to our privacy policy. We&apos;ll never share your information.
      </p>
    </form>
  )
}
