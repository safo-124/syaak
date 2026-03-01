import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { NewsletterForm } from "@/components/admin/newsletter-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Newsletter - TechForUGH Admin",
  description: "Create a new newsletter campaign",
}

export default function NewNewsletterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/newsletter">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Newsletter</h1>
          <p className="text-muted-foreground">
            Compose a new newsletter to send to your subscribers
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Details</CardTitle>
          <CardDescription>
            Write your newsletter content. You can save as draft and send later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsletterForm />
        </CardContent>
      </Card>
    </div>
  )
}
