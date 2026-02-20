"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Briefcase,
  BookOpen,
  Save,
  Loader2,
  Shield,
  Camera,
  Linkedin,
  Twitter,
  Github,
  Link2,
} from "lucide-react"
import { toast } from "sonner"

interface InstructorSettingsFormProps {
  instructor: {
    id: string
    name: string
    email: string
    bio: string | null
    avatar: string | null
    title: string | null
    expertise: string[]
    isVerified: boolean
    linkedinUrl?: string | null
    twitterUrl?: string | null
    githubUrl?: string | null
    slug?: string | null
  }
}

export function InstructorSettingsForm({ instructor }: InstructorSettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: instructor.name,
    title: instructor.title || "",
    bio: instructor.bio || "",
    expertise: instructor.expertise.join(", "),
    linkedinUrl: instructor.linkedinUrl || "",
    twitterUrl: instructor.twitterUrl || "",
    githubUrl: instructor.githubUrl || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        const response = await fetch("/api/instructor/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            title: formData.title || null,
            bio: formData.bio || null,
            expertise: formData.expertise
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            linkedinUrl: formData.linkedinUrl || null,
            twitterUrl: formData.twitterUrl || null,
            githubUrl: formData.githubUrl || null,
          }),
        })

        if (response.ok) {
          toast.success("Profile updated successfully")
          router.refresh()
        } else {
          const data = await response.json()
          toast.error(data.error || "Failed to update profile")
        }
      } catch (error) {
        toast.error("An error occurred")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Your profile picture helps students recognize you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage src={instructor.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {instructor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button type="button" variant="outline" disabled>
                <Camera className="mr-2 size-4" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Photo upload coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={instructor.email}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Senior Data Scientist"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell students about yourself..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise (comma-separated)</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) =>
                  setFormData({ ...formData, expertise: e.target.value })
                }
                placeholder="e.g. Python, Machine Learning, Data Science"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Add your social profiles so students can connect with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter / X URL</Label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="twitterUrl"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/yourusername"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/yourusername"
                className="pl-10"
              />
            </div>
          </div>
          {instructor.slug && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Link2 className="size-3" />
                Your public profile: <a href={`/instructors/${instructor.slug}`} className="underline">/instructors/{instructor.slug}</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Shield
              className={`size-8 ${
                instructor.isVerified ? "text-blue-500" : "text-muted-foreground"
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Verification Status</span>
                <Badge
                  variant={instructor.isVerified ? "default" : "secondary"}
                >
                  {instructor.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {instructor.isVerified
                  ? "Your account is verified. Students can see the verified badge on your profile."
                  : "Your account is pending verification by an administrator."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
