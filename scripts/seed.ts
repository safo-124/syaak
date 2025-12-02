import "dotenv/config"
import prisma from "../lib/prisma"

async function main() {
  console.log("🌱 Seeding Tech4GH courses...\n")

  const courses = [
    {
      title: "Data Science with Python",
      slug: "data-science-with-python",
      shortSummary: "Learn core Python skills for data analysis and modeling.",
      description:
        "A practical, hands-on introduction to Python for data science, covering pandas, visualization, and basic machine learning.",
      level: "BEGINNER" as const,
      format: "online",
      duration: "6 weeks",
      price: 0,
      techStack: ["Python", "pandas", "NumPy"],
      tools: ["Jupyter"],
      tags: ["data-science", "python", "beginner"],
    },
    {
      title: "Data Analysis with Excel",
      slug: "data-analysis-with-excel",
      shortSummary: "Turn raw spreadsheets into clear, actionable insights.",
      description:
        "Master formulas, pivot tables, and charts to analyze and communicate data effectively in Excel.",
      level: "BEGINNER" as const,
      format: "in-person",
      duration: "2-day bootcamp",
      price: 0,
      techStack: ["Excel"],
      tools: ["Excel"],
      tags: ["excel", "data-analysis", "beginner"],
    },
    {
      title: "R for Data Science",
      slug: "r-for-data-science",
      shortSummary: "Analyze and visualize data with R and the tidyverse.",
      description:
        "Use R, dplyr, and ggplot2 to wrangle, analyze, and visualize real-world datasets.",
      level: "INTERMEDIATE" as const,
      format: "online",
      duration: "4 weeks",
      price: 0,
      techStack: ["R", "tidyverse"],
      tools: ["RStudio"],
      tags: ["r", "data-science", "intermediate"],
    },
    {
      title: "PowerPoint for Data Storytelling",
      slug: "powerpoint-for-data-storytelling",
      shortSummary: "Present your data clearly and persuasively.",
      description:
        "Learn to design slides that highlight key findings, use charts effectively, and tell compelling data stories.",
      level: "BEGINNER" as const,
      format: "online",
      duration: "1 week",
      price: 0,
      techStack: ["Data Storytelling"],
      tools: ["PowerPoint"],
      tags: ["powerpoint", "communication", "beginner"],
    },
    {
      title: "Word for Professional Reports",
      slug: "word-for-professional-reports",
      shortSummary: "Produce structured, polished technical and project reports.",
      description:
        "Use Microsoft Word features like styles, tables of contents, and references to create professional documents.",
      level: "BEGINNER" as const,
      format: "in-person",
      duration: "1 week",
      price: 0,
      techStack: ["Reporting"],
      tools: ["Word"],
      tags: ["word", "reporting", "beginner"],
    },
  ]

  for (const course of courses) {
    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        shortSummary: course.shortSummary,
        description: course.description,
        level: course.level,
        format: course.format,
        duration: course.duration,
        price: course.price,
        techStack: course.techStack,
        tools: course.tools,
        tags: course.tags,
        isPublished: true,
      },
      create: {
        title: course.title,
        slug: course.slug,
        shortSummary: course.shortSummary,
        description: course.description,
        level: course.level,
        format: course.format,
        duration: course.duration,
        price: course.price,
        techStack: course.techStack,
        tools: course.tools,
        tags: course.tags,
        isPublished: true,
      },
    })

    console.log(`✅ Seeded course: ${created.title}`)
  }

  console.log("\n🌱 Seeding complete.\n")
}

main().catch((error) => {
  console.error("❌ Seed error:", error)
  process.exit(1)
})
