export function SiteFooter() {
  return (
    <footer className="glass mt-auto">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Tech4GH. All rights reserved.</p>
        <p className="text-[11px] sm:text-xs">
          Empowering learners with data skills in Python, R, Excel & Microsoft tools.
        </p>
      </div>
    </footer>
  )
}
