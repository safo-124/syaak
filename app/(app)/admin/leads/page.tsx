import { getLeads } from "@/lib/courses"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  Mail, 
  Phone, 
  Calendar,
  ArrowUpRight,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { LeadActions } from "@/components/admin/lead-actions"

export default async function LeadsPage() {
  const leads = await getLeads()
  
  const newLeads = leads.filter(l => l.status === "NEW").length
  const contactedLeads = leads.filter(l => l.status === "CONTACTED").length
  const enrolledLeads = leads.filter(l => l.status === "ENROLLED").length
  const lostLeads = leads.filter(l => l.status === "LOST").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Track and manage inquiries from potential students.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New
            </CardTitle>
            <UserPlus className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{newLeads}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contacted
            </CardTitle>
            <MessageSquare className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{contactedLeads}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled
            </CardTitle>
            <UserCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{enrolledLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>
            All leads from course pages and contact forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Users className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No leads yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Leads will appear here when visitors submit forms on your website.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            {lead.message && (
                              <p className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                                {lead.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Mail className="size-3.5 text-muted-foreground" />
                            <span>{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="size-3.5" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.course ? (
                          <Link 
                            href={`/admin/courses/${lead.course}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {lead.course.title}
                            <ArrowUpRight className="size-3" />
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">General inquiry</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {lead.source.replace(/-/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={lead.status === "NEW" ? "default" : "secondary"}
                          className={
                            lead.status === "NEW" 
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                              : lead.status === "CONTACTED"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300"
                              : lead.status === "ENROLLED"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                              : lead.status === "LOST"
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                              : ""
                          }
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {format(lead.createdAt, "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <LeadActions leadId={lead.id} currentStatus={lead.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
