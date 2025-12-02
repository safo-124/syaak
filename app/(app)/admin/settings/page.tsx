import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Globe, 
  Mail, 
  Bell, 
  Palette,
  Shield,
  Database,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your platform settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Site Information */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="size-5 text-primary" />
                <CardTitle className="text-lg">Site Information</CardTitle>
              </div>
              <CardDescription>
                Basic information about your training platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    defaultValue="Tech4GH" 
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline" 
                    defaultValue="Master Data Science & Analytics" 
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea 
                  id="description" 
                  defaultValue="Practical, hands-on training in Python, R, Excel, and Microsoft tools. Designed for students and professionals in Ghana and beyond."
                  className="bg-background"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-primary" />
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </div>
              <CardDescription>
                How students and leads can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="contact@tech4gh.com" 
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="+233 XX XXX XXXX" 
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  placeholder="Your business address..."
                  className="bg-background"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">New Lead Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email when a new lead is submitted
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly summary of leads and activity
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Course Enrollment</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone expresses interest in a course
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="mr-2 size-4" />
                  View Live Site
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/courses">
                  <Database className="mr-2 size-4" />
                  Manage Courses
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/leads">
                  <Mail className="mr-2 size-4" />
                  View Leads
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-primary" />
                <CardTitle className="text-lg">Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-destructive" />
                <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These actions are irreversible. Please be careful.
              </p>
              <Button variant="destructive" className="w-full" disabled>
                Delete All Leads
              </Button>
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" disabled>
                Reset Platform
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card className="border-none bg-primary/5">
            <CardContent className="pt-6">
              <Button className="w-full" disabled>
                Save Changes
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Settings are currently read-only
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
