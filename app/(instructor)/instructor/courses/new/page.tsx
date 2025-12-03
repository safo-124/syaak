import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InstructorCourseForm } from "@/components/instructor/course-form"

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground">
          Set up a new course for your students
        </p>
      </div>

      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Fill in the basic information about your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstructorCourseForm />
        </CardContent>
      </Card>
    </div>
  )
}
