import Link from "next/link"
import { notFound } from "next/navigation"
import { getNewsletterById } from "@/lib/newsletter"
import { getActiveSubscribers } from "@/lib/newsletter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Send, Calendar, Users, Mail, Eye } from "lucide-react"
import { NewsletterSendButton } from "@/components/admin/newsletter-send-button"
import { Metadata } from "next"

interface NewsletterDetailPageProps {
  params: Promise<{
    newsletterId: string
  }>
}

export async function generateMetadata({ params }: NewsletterDetailPageProps): Promise<Metadata> {
  const { newsletterId } = await params
  const newsletter = await getNewsletterById(newsletterId)
  
  return {
    title: newsletter ? `${newsletter.subject} - Newsletter` : "Newsletter Not Found",
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "DRAFT":
      return <Badge variant="secondary">Draft</Badge>
    case "SCHEDULED":
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>
    case "SENDING":
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Sending</Badge>
    case "SENT":
      return <Badge className="bg-green-500">Sent</Badge>
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default async function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const { newsletterId } = await params
  const [newsletter, subscribers] = await Promise.all([
    getNewsletterById(newsletterId),
    getActiveSubscribers(),
  ])

  if (!newsletter) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/newsletter">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{newsletter.subject}</h1>
              {getStatusBadge(newsletter.status)}
            </div>
            <p className="text-muted-foreground">
              {newsletter.previewText || "No preview text"}
            </p>
          </div>
        </div>
        
        {newsletter.status === "DRAFT" && (
          <div className="flex gap-3">
            <Link href={`/admin/newsletter/${newsletterId}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <NewsletterSendButton 
              newsletterId={newsletterId}
              subscriberCount={subscribers.length}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getStatusBadge(newsletter.status)}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {newsletter.status === "SENT" ? "Sent To" : "Will Send To"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsletter.status === "SENT" ? newsletter.sentCount : subscribers.length}
            </div>
            <p className="text-xs text-muted-foreground">subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {new Date(newsletter.createdAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(newsletter.createdAt).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {newsletter.sentAt ? "Sent At" : "Last Updated"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {new Date(newsletter.sentAt || newsletter.updatedAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(newsletter.sentAt || newsletter.updatedAt).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Newsletter Content
          </CardTitle>
          <CardDescription>
            Preview of the newsletter content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white p-6 dark:bg-zinc-950">
            {/* Email Header Preview */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  T4
                </div>
                <div>
                  <p className="font-semibold">TechForUGH</p>
                  <p className="text-sm text-muted-foreground">hello@techforugh.com</p>
                </div>
              </div>
              <h2 className="text-xl font-bold">{newsletter.subject}</h2>
            </div>
            
            {/* Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {newsletter.content}
            </div>
            
            {/* Footer */}
            <Separator className="my-6" />
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} TechForUGH. All rights reserved.</p>
              <p className="mt-2">
                You're receiving this because you subscribed to our newsletter.
              </p>
              <p className="mt-1 text-primary">Unsubscribe</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
