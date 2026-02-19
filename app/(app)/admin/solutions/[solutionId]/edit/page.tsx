import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { SolutionForm } from "@/components/admin/solution-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function EditSolutionPage({
  params,
}: {
  params: Promise<{ solutionId: string }>
}) {
  const { solutionId } = await params
  const solution = await prisma.techSolution.findUnique({
    where: { id: solutionId },
  })

  if (!solution) notFound()

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Solution</h1>
          <p className="text-muted-foreground">{solution.title}</p>
        </div>
      </div>
      <SolutionForm solution={solution} />
    </div>
  )
}
