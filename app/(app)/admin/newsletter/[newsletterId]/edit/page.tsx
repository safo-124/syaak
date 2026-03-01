import Link from "next/link"
import { notFound } from "next/navigation"
import { getNewsletterById } from "@/lib/newsletter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { NewsletterForm } from "@/components/admin/newsletter-form"
import { Metadata } from "next"

interface EditNewsletterPageProps {
  params: Promise<{
    newsletterId: string
  }>
}

export const metadata: Metadata = {
  title: "Edit Newsletter - TechForUGH Admin",
  description: "Edit newsletter campaign",
}

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const { newsletterId } = await params
  const newsletter = await getNewsletterById(newsletterId)

  if (!newsletter) {
    notFound()
  }

  if (newsletter.status !== "DRAFT") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/newsletter/${newsletterId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cannot Edit</h1>
            <p className="text-muted-foreground">
              This newsletter has already been sent and cannot be edited.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/newsletter/${newsletterId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Newsletter</h1>
          <p className="text-muted-foreground">
            Update your newsletter content before sending
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Details</CardTitle>
          <CardDescription>
            Modify the newsletter content. Changes are saved as draft.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsletterForm newsletter={newsletter} />
        </CardContent>
      </Card>
    </div>
  )
}
