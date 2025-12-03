"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  Camera,
  Lock,
  Bell,
  Shield,
} from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

interface StudentSettingsFormProps {
  student: {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
    createdAt: Date
  }
}

export function StudentSettingsForm({ student }: StudentSettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: student.name,
    phone: student.phone || "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    courseUpdates: true,
    newCourses: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        const response = await fetch("/api/student/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone || null,
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
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Your profile picture is visible to instructors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage src={student.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {student.name.charAt(0).toUpperCase()}
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

      {/* Basic Info Form */}
      <form onSubmit={handleSubmit}>
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details
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
                    value={student.email}
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
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="pt-4">
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
          </CardContent>
        </Card>
      </form>

      {/* Notification Preferences */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Course Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when courses you're enrolled in are updated
              </p>
            </div>
            <Switch
              checked={notifications.courseUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, courseUpdates: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Courses</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new courses are available
              </p>
            </div>
            <Switch
              checked={notifications.newCourses}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, newCourses: checked })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Notification preferences coming soon
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground">
                Change your account password
              </p>
            </div>
            <Button variant="outline" disabled>
              <Lock className="mr-2 size-4" />
              Change Password
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Password change coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
