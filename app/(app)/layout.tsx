import Link from "next/link"
import "@/app/globals.css"
import { Button } from "@/components/ui/button"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-primary">
              Tech4GH Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link href="/admin/leads" className="hover:text-foreground">
                Leads
              </Link>
              <Link href="/admin/courses" className="hover:text-foreground">
                Courses
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">View Site</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/10 p-6">
        {children}
      </main>
    </div>
  )
}
