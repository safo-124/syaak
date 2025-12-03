"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, Mail, Lock, User, Phone, AlertCircle, Sparkles, CheckCircle2, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerStudentAction } from "@/app/actions/student"

export default function StudentRegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingApproval, setPendingApproval] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    startTransition(async () => {
      const result = await registerStudentAction({
        name,
        email,
        phone: phone || undefined,
        password,
      })

      if (result.success && result.pendingApproval) {
        setPendingApproval(true)
      } else if (!result.success) {
        setError(result.error || "Registration failed")
      }
    })
  }

  // Show pending approval message
  if (pendingApproval) {
    return (
      <div className="w-full max-w-md">
        <Card className="glass border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-500/10">
              <Clock className="size-8 text-amber-500" />
            </div>
            <CardTitle className="text-xl">Registration Pending</CardTitle>
            <CardDescription>
              Your account has been created successfully!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <CheckCircle2 className="size-4 text-amber-500" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                Your registration is pending admin approval. You will be able to sign in once an administrator approves your account.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <h4 className="mb-2 font-medium text-foreground">What happens next?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  An administrator will review your registration
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  You will be notified once your account is approved
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  After approval, you can sign in and start learning
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full" variant="outline">
              <Link href="/learn/login">
                Back to Login
              </Link>
            </Button>
            <Button asChild className="w-full" variant="ghost">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <GraduationCap className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Join Tech4GH</h1>
        <p className="text-muted-foreground">Start your learning journey today</p>
      </div>

      <Card className="glass border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Sign up to access courses and track your progress
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Clock className="size-4 text-blue-500" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Account registration requires admin approval before you can access courses.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Create Account
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/learn/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </p>
    </div>
  )
}
