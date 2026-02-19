import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Eye, EyeOff, Users, HelpCircle, FileText, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAboutPage, getAllTeamMembersAdmin, getAllFaqItemsAdmin } from "@/lib/about"
import { AboutContentForm } from "@/components/admin/about-content-form"
import { TeamMemberDeleteButton } from "@/components/admin/team-member-delete-button"
import { TeamMemberHomepageToggle } from "@/components/admin/team-member-homepage-toggle"
import { FaqDeleteButton } from "@/components/admin/faq-delete-button"

export default async function AdminAboutPage() {
  const [aboutPage, teamMembers, faqItems] = await Promise.all([
    getAboutPage(),
    getAllTeamMembersAdmin(),
    getAllFaqItemsAdmin(),
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">About Page</h1>
        <p className="text-muted-foreground mt-1">Manage all content that appears on the public About Us page.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{aboutPage ? "1" : "0"}</p>
              <p className="text-sm text-muted-foreground">Page Record</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{faqItems.length}</p>
              <p className="text-sm text-muted-foreground">FAQ Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Content Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Page Content</h2>
        <AboutContentForm initialData={aboutPage as any} />
      </section>

      {/* Team Members */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Button asChild>
            <Link href="/admin/about/team/new"><Plus className="h-4 w-4 mr-2" />Add Member</Link>
          </Button>
        </div>
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No team members yet. <Link href="/admin/about/team/new" className="text-primary underline">Add the first one</Link>.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                      {member.imageUrl ? (
                        <Image src={member.imageUrl} alt={member.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{member.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Badge variant={member.isVisible ? "default" : "secondary"} className="text-xs">
                          {member.isVisible ? <><Eye className="h-3 w-3 mr-1" />Visible</> : <><EyeOff className="h-3 w-3 mr-1" />Hidden</>}
                        </Badge>
                        {member.showOnHomepage && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            <Home className="h-3 w-3 mr-1" />Homepage
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Homepage:</span>
                      <TeamMemberHomepageToggle id={member.id} defaultChecked={member.showOnHomepage} />
                    </div>
                    <div className="flex gap-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/about/team/${member.id}/edit`}><Pencil className="h-3 w-3 mr-1" />Edit</Link>
                      </Button>
                      <TeamMemberDeleteButton id={member.id} name={member.name} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">FAQ Items</h2>
          <Button asChild>
            <Link href="/admin/about/faq/new"><Plus className="h-4 w-4 mr-2" />Add FAQ</Link>
          </Button>
        </div>
        {faqItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No FAQ items yet. <Link href="/admin/about/faq/new" className="text-primary underline">Add the first one</Link>.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {faqItems.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={faq.isVisible ? "default" : "secondary"} className="text-xs shrink-0">
                          {faq.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Order: {faq.order}</span>
                      </div>
                      <p className="font-medium">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/about/faq/${faq.id}/edit`}><Pencil className="h-3 w-3" /></Link>
                      </Button>
                      <FaqDeleteButton id={faq.id} question={faq.question} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
