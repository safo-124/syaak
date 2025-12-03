"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Loader2, Mail, Lock, AlertCircle, ArrowRight, Sparkles, Shield, Zap, BarChart3, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginStudentAction } from "@/app/actions/student"

export default function StudentLoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    startTransition(async () => {
      const result = await loginStudentAction({ email, password })

      if (result.success) {
        router.push("/learn")
        router.refresh()
      } else {
        setError(result.error || "Invalid email or password")
      }
    })
  }

  return (
    <div className="w-full max-w-md">
      {/* Enhanced Header */}
      <div className="mb-8 flex flex-col items-center text-center animate-scale-in">
        <div className="relative mb-4">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 shadow-lg shadow-primary/20 animate-float overflow-hidden">
            <Image 
              src="/T4u_logo.jpg" 
              alt="Tech4GH Logo" 
              width={80} 
              height={80}
              className="object-cover"
            />
          </div>
          <div className="absolute -right-1 -top-1">
            <div className="relative">
              <Sparkles className="size-5 text-yellow-500 animate-wiggle" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="size-5 text-yellow-500 opacity-75" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-3 flex items-center gap-2">
          <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
            Welcome Back
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-2">Continue your data science journey</p>
        
        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
          <Shield className="size-3 mr-1" />
          Secure Login
        </Badge>
      </div>

      <Card className="glass border-none shadow-2xl animate-slide-up">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
          <CardDescription className="text-base">
            Access your courses, assignments, and learning dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-wiggle bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Email Address
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@tech4gh.com"
                  className="h-11 pl-4 pr-4 transition-all group-focus-within:ring-2 group-focus-within:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 pl-4 pr-4 transition-all group-focus-within:ring-2 group-focus-within:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-3 border border-blue-500/10">
                <BarChart3 className="size-4 text-blue-600 dark:text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Active Students</span>
                  <span className="text-sm font-bold">500+</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-500/5 to-green-500/10 p-3 border border-green-500/10">
                <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-bold">95%</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-primary/25 group" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  <Zap className="mr-2 size-4 animate-pulse" />
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">New to Tech4GH?</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11 group hover:border-primary/50 hover:bg-primary/5"
              asChild
            >
              <Link href="/learn/register">
                <Sparkles className="mr-2 size-4 text-yellow-500 animate-bounce-subtle" />
                Create New Account
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
        <Link href="/" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to home
        </Link>
      </p>
    </div>
  )
}
