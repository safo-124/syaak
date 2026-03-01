import Link from "next/link"
import { getAllNewsletters, getNewsletterStats } from "@/lib/newsletter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Mail, Users, Send, FileText, Eye, Settings } from "lucide-react"
import { NewsletterActions } from "@/components/admin/newsletter-actions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter Management - TechForUGH Admin",
  description: "Manage newsletter subscribers and campaigns",
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

export default async function NewsletterPage() {
  const [newsletters, stats] = await Promise.all([
    getAllNewsletters(),
    getNewsletterStats(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-muted-foreground">
            Manage your subscribers and send newsletters
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/newsletter/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Email Settings
            </Button>
          </Link>
          <Link href="/admin/newsletter/subscribers">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View Subscribers
            </Button>
          </Link>
          <Link href="/admin/newsletter/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Newsletter
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none bg-linear-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSubscribers} total subscribers
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-green-500/10 to-green-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsletters.filter((n) => n.status === "SENT").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {newsletters.filter((n) => n.status === "DRAFT").length} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsletters.reduce((acc, n) => acc + n.sentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-amber-500/10 to-amber-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNewsletters}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Newsletters Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Newsletters</CardTitle>
          <CardDescription>
            View and manage your newsletter campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {newsletters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No newsletters yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first newsletter to engage with your subscribers
              </p>
              <Link href="/admin/newsletter/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Newsletter
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link 
                          href={`/admin/newsletter/${newsletter.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {newsletter.subject}
                        </Link>
                        {newsletter.previewText && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {newsletter.previewText}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
                    <TableCell>
                      {newsletter.sentCount > 0 ? (
                        <span className="font-medium">{newsletter.sentCount} subscribers</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {newsletter.sentAt 
                        ? new Date(newsletter.sentAt).toLocaleDateString()
                        : new Date(newsletter.createdAt).toLocaleDateString()
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <NewsletterActions 
                        newsletterId={newsletter.id} 
                        status={newsletter.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
