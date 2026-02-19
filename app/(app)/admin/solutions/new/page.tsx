import { SolutionForm } from "@/components/admin/solution-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewSolutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/solutions">
            <ChevronLeft className="mr-1 size-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Solution</h1>
          <p className="text-muted-foreground">
            Add a technology solution to showcase on the website.
          </p>
        </div>
      </div>
      <SolutionForm />
    </div>
  )
}
