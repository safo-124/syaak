"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, GraduationCap, Loader2, Mail, Lock, User, Briefcase } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createInstructorAction } from "@/app/actions/admin"
import { toast } from "sonner"

export default function NewInstructorPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const title = formData.get("title") as string || undefined
    const bio = formData.get("bio") as string || undefined
    const password = formData.get("password") as string
    const expertiseRaw = formData.get("expertise") as string
    const expertise = expertiseRaw ? expertiseRaw.split(",").map(s => s.trim()).filter(Boolean) : undefined

    startTransition(async () => {
      const result = await createInstructorAction({
        name,
        email,
        title,
        bio,
        password,
        expertise,
      })
      
      if (result.success) {
        toast.success("Instructor created successfully")
        router.push("/admin/instructors")
      } else {
        setError(result.error || "Failed to create instructor")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/instructors">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Instructor</h1>
          <p className="text-muted-foreground">
            Create a new instructor account
          </p>
        </div>
      </div>

      <Card className="max-w-2xl border-none bg-white/60 shadow-sm dark:bg-black/20">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center">Instructor Details</CardTitle>
          <CardDescription className="text-center">
            Fill in the instructor information below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="instructor@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Senior Data Scientist"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (comma-separated)</Label>
              <Input
                id="expertise"
                name="expertise"
                placeholder="e.g. Python, Machine Learning, Data Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Brief description about the instructor..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href="/admin/instructors">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Instructor"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
