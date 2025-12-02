"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createSection, updateSection, deleteSection } from "@/app/actions/courses"
import type { CourseSection } from "@/app/generated/prisma/client"
import { 
  Plus, 
  GripVertical, 
  Edit, 
  Trash2, 
  Loader2,
  Layers,
  FileText
} from "lucide-react"

interface SectionManagerProps {
  courseId: string
  sections: CourseSection[]
}

export function SectionManager({ courseId, sections }: SectionManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAddSection = async (formData: FormData) => {
    startTransition(async () => {
      await createSection(courseId, formData)
      setIsAddOpen(false)
    })
  }

  const handleUpdateSection = async (formData: FormData) => {
    if (!editingSection) return
    startTransition(async () => {
      await updateSection(editingSection.id, formData)
      setEditingSection(null)
    })
  }

  const handleDeleteSection = async (sectionId: string) => {
    startTransition(async () => {
      await deleteSection(sectionId)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Course Syllabus</h2>
          <p className="text-sm text-muted-foreground">
            Organize your course content into sections
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddSection}>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>
                  Create a new section for your course syllabus.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Section Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Introduction to Python"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content Description</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="What will students learn in this section..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Section"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Layers className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No sections yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Break down your course into sections to help students understand the learning path.
            </p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <Card key={section.id} className="border-none bg-white/60 dark:bg-black/20">
              <CardContent className="flex items-start gap-4 p-4">
                {/* Order Number */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{section.title}</h3>
                  {section.content ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {section.content}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground/60">
                      No description added
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSection(section)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{section.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSection(section.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
        <DialogContent>
          <form action={handleUpdateSection}>
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
              <DialogDescription>
                Update the section title and content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Section Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingSection?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content Description</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={editingSection?.content || ""}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
