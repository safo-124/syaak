"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Loader2, 
  Settings, 
  Send,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

export default function EmailSettingsPage() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "disconnected" | "error">("loading")
  const [isConfigured, setIsConfigured] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    setConnectionStatus("loading")
    try {
      const response = await fetch("/api/email/send")
      const data = await response.json()
      
      setIsConfigured(data.configured)
      setConnectionStatus(data.connected ? "connected" : "disconnected")
    } catch (error) {
      setConnectionStatus("error")
    }
  }

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault()
    if (!testEmail) return

    setIsSending(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({ success: true, message: "Test email sent successfully!" })
      } else {
        setTestResult({ success: false, message: data.error || "Failed to send test email" })
      }
    } catch (error) {
      setTestResult({ success: false, message: "Failed to send test email" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground">Configure and test your email integration</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/newsletter">
            <Mail className="mr-2 h-4 w-4" />
            Back to Newsletter
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connection Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              SMTP Connection Status
            </CardTitle>
            <CardDescription>
              Check if your email server is properly configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="font-medium">Connection</span>
              {connectionStatus === "loading" ? (
                <Badge variant="secondary">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Checking...
                </Badge>
              ) : connectionStatus === "connected" ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : connectionStatus === "disconnected" ? (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Not Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Error
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="font-medium">Configuration</span>
              {isConfigured ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Not Set
                </Badge>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={checkConnection}
              disabled={connectionStatus === "loading"}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${connectionStatus === "loading" ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Test Email
            </CardTitle>
            <CardDescription>
              Verify your email configuration by sending a test email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendTest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Recipient Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  disabled={isSending}
                />
              </div>

              {testResult && (
                <div 
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    testResult.success 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                      : "bg-destructive/10 text-destructive"
                  } text-sm`}
                >
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSending || !testEmail || connectionStatus !== "connected"}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Configuration Guide */}
        <Card className="lg:col-span-2 glass">
          <CardHeader>
            <CardTitle>Configuration Guide</CardTitle>
            <CardDescription>
              Set up your SMTP credentials in the environment variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`# Add these to your .env file

# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Tech4GH <hello@tech4gh.com>"

# App URL (for email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Popular SMTP Providers:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Gmail:</strong> Use App Password (Settings → Security → 2FA → App Passwords)</li>
                  <li><strong>SendGrid:</strong> Use "apikey" as username and your API key as password</li>
                  <li><strong>Mailgun:</strong> Use your domain-specific SMTP credentials</li>
                  <li><strong>Amazon SES:</strong> Use IAM SMTP credentials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
