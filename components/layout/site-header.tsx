import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
            T4
          </span>
          <span className="text-base sm:text-lg text-primary">Tech4GH</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/courses" className="hover:text-primary">
            Courses
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
