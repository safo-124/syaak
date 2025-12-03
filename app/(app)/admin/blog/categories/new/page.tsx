import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CategoryForm } from "@/components/admin/category-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Category - Tech4GH Admin",
  description: "Create a new blog category",
}

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-muted-foreground">
          Create a new category to organize your blog posts.
        </p>
      </div>

      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Enter the details for your new category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
