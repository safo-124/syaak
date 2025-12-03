"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Loader2, Mail, Lock, User, Phone, AlertCircle, Sparkles, CheckCircle2, Clock, ArrowRight, Shield, Users, Zap, BarChart3, Code2, TrendingUp } from "lucide-react"
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
      <div className="w-full max-w-lg animate-scale-in">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 animate-pulse-glow">
            <Clock className="size-10 text-amber-600 animate-wiggle" />
          </div>
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-700 dark:text-amber-300">
            <CheckCircle2 className="mr-1 size-3" />
            Registration Received
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Almost There! 🎉</h1>
          <p className="text-muted-foreground text-lg">
            Your account is pending approval
          </p>
        </div>

        <Card className="glass border-none shadow-2xl animate-slide-up">
          <CardContent className="pt-6 space-y-6">
            {/* Success Alert */}
            <Alert className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
              <CheckCircle2 className="size-5 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100 font-medium">
                Your registration has been submitted successfully! An administrator will review your application shortly.
              </AlertDescription>
            </Alert>
            
            {/* Timeline */}
            <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-6 space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                What happens next?
              </h4>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Admin reviews your registration", color: "text-blue-600" },
                  { icon: Mail, text: "You'll receive an email notification", color: "text-green-600" },
                  { icon: GraduationCap, text: "Start learning immediately after approval", color: "text-purple-600" },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className={`flex size-10 items-center justify-center rounded-lg bg-background/50 ${step.color} group-hover:scale-110 transition-transform`}>
                      <step.icon className="size-5" />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-sm font-medium text-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Preview */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                While you wait, here's what you'll get:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BarChart3, text: "50+ Courses" },
                  { icon: Users, text: "Expert Instructors" },
                  { icon: Code2, text: "Hands-on Projects" },
                  { icon: CheckCircle2, text: "Certificates" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                      <benefit.icon className="size-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 pt-6">
            <Button asChild className="w-full group" variant="outline">
              <Link href="/learn/login">
                <ArrowRight className="mr-2 size-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </Button>
            <Button asChild className="w-full group" variant="ghost">
              <Link href="/">
                Return to Home
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header Section */}
      <div className="mb-8 text-center animate-slide-up">
        <div className="mx-auto mb-4 relative">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg animate-float overflow-hidden">
            <Image 
              src="/T4u_logo.jpg" 
              alt="Tech4GH Logo" 
              width={80} 
              height={80}
              className="object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 size-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce-subtle">
            <Sparkles className="size-3 text-white" />
          </div>
        </div>
        <Badge variant="secondary" className="mb-4">
          <Users className="mr-1 size-3" />
          Join 500+ Students
        </Badge>
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-muted-foreground">
          Start mastering data science and Excel today
        </p>
      </div>

      <Card className="glass border-none shadow-2xl animate-scale-in">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl">Sign up for free</CardTitle>
          <CardDescription>
            Get instant access to all courses after admin approval
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-slide-in-left">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="size-3.5" />
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="size-3.5" />
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="size-3.5" />
                Phone Number
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Optional</Badge>
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="size-3.5" />
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-colors"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                <Lock className="size-3.5" />
                Confirm Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <Shield className="size-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-xs">
                Your account will be reviewed by an admin before activation. This typically takes less than 24 hours.
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 group" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4 group-hover:rotate-12 transition-transform" />
                  Create Account
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already registered?
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11 group" asChild>
              <Link href="/learn/login">
                Sign in to your account
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Footer Links */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline font-medium">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-primary hover:underline font-medium">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
