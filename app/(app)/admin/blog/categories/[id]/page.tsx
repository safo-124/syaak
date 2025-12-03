import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CategoryForm } from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/blog"
import { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const category = await getCategoryById(id)
  return {
    title: category ? `Edit ${category.name} - Tech4GH Admin` : "Edit Category",
  }
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">
          Update the details for "{category.name}".
        </p>
      </div>

      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Make changes to your category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  )
}
