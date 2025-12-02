"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react"
import Link from "next/link"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get("email") || ""
  
  const [email, setEmail] = useState(emailFromUrl)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault()
    
    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "You have been unsubscribed successfully")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to unsubscribe")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Unsubscribe</CardTitle>
          <CardDescription>
            {status === "success" 
              ? "We're sorry to see you go!"
              : "Enter your email to unsubscribe from our newsletter"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">
                You will no longer receive newsletters from Tech4GH.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="destructive"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unsubscribing...
                  </>
                ) : (
                  "Unsubscribe"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Changed your mind?{" "}
                <Link href="/" className="text-primary hover:underline">
                  Go back to homepage
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
