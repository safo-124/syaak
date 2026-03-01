const TOOLS: { name: string; emoji: string }[] = [
  { name: "Python",           emoji: "🐍" },
  { name: "R Language",       emoji: "📊" },
  { name: "Excel",            emoji: "📗" },
  { name: "Power BI",         emoji: "📈" },
  { name: "SQL",              emoji: "🗃️" },
  { name: "Machine Learning", emoji: "🤖" },
  { name: "Tableau",          emoji: "📉" },
  { name: "React",            emoji: "⚛️" },
  { name: "Node.js",          emoji: "🟢" },
  { name: "PostgreSQL",       emoji: "🐘" },
  { name: "TypeScript",       emoji: "🔷" },
  { name: "Next.js",          emoji: "⬛" },
  { name: "TensorFlow",       emoji: "🧠" },
  { name: "FastAPI",          emoji: "⚡" },
  { name: "Data Analytics",   emoji: "🔍" },
  { name: "MongoDB",          emoji: "🍃" },
  { name: "Pandas",           emoji: "🐼" },
  { name: "NumPy",            emoji: "🔢" },
]

const doubled = [...TOOLS, ...TOOLS]

function Pill({ name, emoji }: { name: string; emoji: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-border/60 bg-muted/40 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground mx-2">
      <span className="text-base leading-none">{emoji}</span>
      <span className="whitespace-nowrap">{name}</span>
    </div>
  )
}

export function TechMarquee() {
  return (
    <div className="group/marquee relative flex overflow-hidden select-none">
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      {/* Row */}
      <div className="animate-marquee flex items-center">
        {doubled.map((t, i) => (
          <Pill key={i} name={t.name} emoji={t.emoji} />
        ))}
      </div>
    </div>
  )
}
