import { getAllContactSubmissions, getContactStats } from "@/lib/contact"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail,
  Clock,
  CheckCircle,
  Archive,
  MessageSquare,
  User,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import { ContactActions } from "@/components/admin/contact-actions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Submissions - TechForUGH Admin",
  description: "View and manage contact form submissions",
}

export default async function AdminContactsPage() {
  const [submissions, stats] = await Promise.all([
    getAllContactSubmissions(),
    getContactStats(),
  ])

  const newSubmissions = submissions.filter(s => s.status === "NEW")
  const readSubmissions = submissions.filter(s => s.status === "READ")
  const archivedSubmissions = submissions.filter(s => s.status === "ARCHIVED")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="default" className="bg-blue-500">New</Badge>
      case "READ":
        return <Badge variant="secondary">Read</Badge>
      case "ARCHIVED":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">
          View and manage messages from your contact form.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New
            </CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Read
            </CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.read}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Archived
            </CardTitle>
            <Archive className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">
            New
            {stats.new > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {stats.new}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {/* New Tab */}
        <TabsContent value="new" className="space-y-4">
          {newSubmissions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Mail className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No new messages</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  New contact form submissions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ContactList submissions={newSubmissions} getStatusBadge={getStatusBadge} />
          )}
        </TabsContent>

        {/* Read Tab */}
        <TabsContent value="read" className="space-y-4">
          {readSubmissions.length === 0 ? (
            <EmptyState message="No read messages" />
          ) : (
            <ContactList submissions={readSubmissions} getStatusBadge={getStatusBadge} />
          )}
        </TabsContent>

        {/* Archived Tab */}
        <TabsContent value="archived" className="space-y-4">
          {archivedSubmissions.length === 0 ? (
            <EmptyState message="No archived messages" />
          ) : (
            <ContactList submissions={archivedSubmissions} getStatusBadge={getStatusBadge} />
          )}
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all" className="space-y-4">
          {submissions.length === 0 ? (
            <EmptyState message="No messages yet" />
          ) : (
            <ContactList submissions={submissions} getStatusBadge={getStatusBadge} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: string
  createdAt: Date
}

function ContactList({ 
  submissions, 
  getStatusBadge 
}: { 
  submissions: ContactSubmission[]
  getStatusBadge: (status: string) => React.ReactNode
}) {
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="glass border-none">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {submission.subject || "No Subject"}
                    </h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3.5" />
                      {submission.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="size-3.5" />
                      <a 
                        href={`mailto:${submission.email}`} 
                        className="hover:text-primary transition-colors"
                      >
                        {submission.email}
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {format(submission.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
                <ContactActions 
                  submissionId={submission.id} 
                  currentStatus={submission.status}
                  email={submission.email}
                />
              </div>

              {/* Message */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Mail className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{message}</h3>
      </CardContent>
    </Card>
  )
}
