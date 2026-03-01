import "dotenv/config"
import prisma from "../lib/prisma"

async function main() {
  console.log("🌱 Seeding TechForUGH courses...\n")

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
      sections: [
        { title: "Introduction to Python & Jupyter", content: "Setting up your environment, variables, and basic data types." },
        { title: "Data Manipulation with Pandas", content: "Loading data, filtering, sorting, and cleaning datasets." },
        { title: "Data Visualization", content: "Creating charts with Matplotlib and Seaborn." },
        { title: "Exploratory Data Analysis", content: "Understanding your data through statistics and visualization." },
      ]
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
      sections: [
        { title: "Excel Basics & Shortcuts", content: "Navigating Excel efficiently and essential shortcuts." },
        { title: "Advanced Formulas", content: "VLOOKUP, INDEX-MATCH, and IF statements." },
        { title: "Pivot Tables Mastery", content: "Summarizing large datasets with Pivot Tables." },
        { title: "Dashboards & Visualization", content: "Building interactive dashboards." },
      ]
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
      sections: []
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
      sections: []
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
      sections: []
    },
  ]

  for (const course of courses) {
    // Extract sections to handle separately
    const { sections, ...courseData } = course

    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        ...courseData,
        isPublished: true,
      },
      create: {
        ...courseData,
        isPublished: true,
      },
    })

    // Handle sections if they exist
    if (sections && sections.length > 0) {
      // Clear existing sections to avoid duplicates/ordering issues
      await prisma.courseSection.deleteMany({
        where: { courseId: created.id }
      })

      // Create new sections
      for (let i = 0; i < sections.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: created.id,
            title: sections[i].title,
            content: sections[i].content,
            order: i + 1
          }
        })
      }
    }

    console.log(`✅ Seeded course: ${created.title}`)
  }

  console.log("\n🌱 Seeding blog posts...\n")

  const blogPosts = [
    {
      title: "Getting Started with Data Science in 2025",
      slug: "getting-started-data-science-2025",
      excerpt: "A comprehensive guide to beginning your data science journey with the right tools and mindset.",
      content: `# Getting Started with Data Science in 2025

Data science continues to be one of the most in-demand fields in tech. Whether you're a complete beginner or transitioning from another field, this guide will help you get started.

## Why Data Science?

Data science combines statistics, programming, and domain expertise to extract insights from data. Companies across all industries need professionals who can:

- Analyze large datasets
- Build predictive models
- Communicate findings effectively
- Drive data-informed decisions

## Essential Skills to Learn

### 1. Python Programming
Python is the most popular language for data science. Start with:
- Basic syntax and data types
- Control flow and functions
- Libraries like pandas and NumPy

### 2. Statistics & Mathematics
Understanding statistics is crucial:
- Descriptive statistics
- Probability distributions
- Hypothesis testing
- Linear algebra basics

### 3. Data Visualization
Learn to communicate with data:
- Matplotlib and Seaborn in Python
- Tableau or Power BI for business settings

## Your First Project

Start with a simple project:
1. Find a public dataset (Kaggle is great)
2. Clean and explore the data
3. Create visualizations
4. Draw conclusions

## Next Steps

Check out our Data Science with Python course to accelerate your learning journey!`,
      category: "Tutorials",
      author: "TechForUGH Team",
      readTime: 5,
      tags: ["data-science", "python", "beginners", "career"],
      isPublished: true,
    },
    {
      title: "5 Excel Tips Every Data Analyst Should Know",
      slug: "5-excel-tips-data-analysts",
      excerpt: "Master these essential Excel techniques to boost your productivity and analysis capabilities.",
      content: `# 5 Excel Tips Every Data Analyst Should Know

Excel remains one of the most powerful tools for data analysis. Here are five tips that will make you more efficient.

## 1. Master Keyboard Shortcuts

Speed up your workflow with these essential shortcuts:
- **Ctrl + Shift + L**: Toggle filters
- **Alt + =**: AutoSum
- **Ctrl + ;**: Insert today's date
- **F4**: Repeat last action

## 2. Use Named Ranges

Instead of referencing cells like A1:A100, create named ranges:
1. Select your data
2. Go to Formulas > Define Name
3. Use the name in formulas

This makes formulas more readable and easier to maintain.

## 3. Leverage Power Query

Power Query transforms how you handle data:
- Connect to multiple data sources
- Clean and transform data without formulas
- Refresh data with one click

## 4. Create Dynamic Charts

Make your charts update automatically:
- Use Tables (Ctrl + T) for your data
- Create charts from table data
- New rows automatically appear in charts

## 5. Master XLOOKUP

XLOOKUP replaces VLOOKUP and offers more flexibility:
\`\`\`
=XLOOKUP(lookup_value, lookup_array, return_array)
\`\`\`

Benefits:
- Search left or right
- No column number needed
- Built-in error handling

## Practice Makes Perfect

Try these tips on your next project and watch your productivity soar!`,
      category: "Tips & Tricks",
      author: "TechForUGH Team",
      readTime: 4,
      tags: ["excel", "tips", "productivity", "data-analysis"],
      isPublished: true,
    },
    {
      title: "Why Learning R is Still Valuable in 2025",
      slug: "why-learn-r-2025",
      excerpt: "Despite Python's popularity, R remains a powerful choice for statistical analysis and data visualization.",
      content: `# Why Learning R is Still Valuable in 2025

While Python dominates many discussions about data science, R continues to be an excellent choice for many applications.

## R's Unique Strengths

### Statistical Analysis
R was built by statisticians for statisticians. Its syntax for statistical operations is often more intuitive:
- Built-in statistical functions
- Comprehensive testing libraries
- Academic research support

### Data Visualization
ggplot2 remains one of the best visualization libraries:
- Grammar of graphics approach
- Publication-ready plots
- Extensive customization

### Reproducible Research
R Markdown enables:
- Code and narrative in one document
- Multiple output formats
- Easy sharing of analysis

## When to Choose R

Consider R when:
- Working in academia or research
- Doing heavy statistical analysis
- Creating complex visualizations
- Working with existing R codebases

## Getting Started

1. Download RStudio
2. Learn tidyverse packages
3. Practice with real datasets
4. Join the R community

R and Python aren't competitors—they're complementary tools in your data science toolkit.`,
      category: "Career Tips",
      author: "TechForUGH Team",
      readTime: 3,
      tags: ["r", "programming", "data-science", "career"],
      isPublished: true,
    },
    {
      title: "Announcing Our New In-Person Bootcamps",
      slug: "new-in-person-bootcamps-announcement",
      excerpt: "We're excited to launch hands-on bootcamps in Accra for Excel and Data Visualization.",
      content: `# Announcing Our New In-Person Bootcamps

We're thrilled to announce the expansion of our training programs with new in-person bootcamps!

## What's New

Starting next month, we'll offer intensive weekend bootcamps:

### Excel Mastery Bootcamp
- **Duration**: 2 days (Saturday & Sunday)
- **Location**: Accra, Ghana
- **Topics**: Advanced formulas, Pivot Tables, Dashboards
- **Includes**: Laptop not required - workstations provided

### Data Visualization Workshop
- **Duration**: 1 day
- **Location**: Accra, Ghana
- **Topics**: Charts, Dashboards, Storytelling
- **Includes**: Practice datasets and templates

## Why In-Person?

While our online courses are great for flexibility, in-person learning offers:
- Direct interaction with instructors
- Immediate feedback on your work
- Networking with fellow learners
- Hands-on practice with guidance

## Early Bird Pricing

Register before the end of the month for 20% off!

## How to Register

Visit our Courses page to see available dates and register. Space is limited to ensure quality instruction.

We can't wait to meet you in person!`,
      category: "Announcements",
      author: "TechForUGH Team",
      readTime: 2,
      tags: ["bootcamp", "training", "excel", "announcement"],
      isPublished: true,
    },
    {
      title: "How TechForUGH Helped 100+ Professionals Upskill",
      slug: "TechForUGH-success-stories",
      excerpt: "Real stories from our graduates who transformed their careers through data skills.",
      content: `# How TechForUGH Helped 100+ Professionals Upskill

Since launching TechForUGH, we've had the privilege of helping over 100 professionals develop data skills. Here are some of their stories.

## Kofi's Story: From Accountant to Data Analyst

Kofi worked as an accountant for 5 years. After completing our Data Science with Python course:
- Learned to automate reporting with Python
- Reduced monthly reporting time by 80%
- Promoted to Senior Financial Analyst

> "TechForUGH gave me the confidence to go beyond Excel. Now I'm the go-to person for data analysis in my department."

## Ama's Story: Marketing Manager Turned Insights Lead

Ama wanted to make data-driven marketing decisions. After our Excel and PowerPoint courses:
- Built customer analytics dashboards
- Improved campaign ROI by 35%
- Created her company's first data strategy

> "The courses were practical and immediately applicable. I started using what I learned the very next day."

## What Makes TechForUGH Different

### Practical Focus
Every lesson includes real-world applications you can use immediately.

### Ghana-Focused Content
Examples and case studies relevant to the Ghanaian business context.

### Supportive Community
Access to instructors and fellow learners for ongoing support.

## Start Your Journey

Ready to write your own success story? Browse our courses and take the first step today.`,
      category: "Case Studies",
      author: "TechForUGH Team",
      readTime: 4,
      tags: ["success-stories", "careers", "testimonials"],
      isPublished: true,
    },
  ]

  for (const post of blogPosts) {
    const created = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        ...post,
        publishedAt: post.isPublished ? new Date() : null,
      },
      create: {
        ...post,
        publishedAt: post.isPublished ? new Date() : null,
      },
    })

    console.log(`✅ Seeded blog post: ${created.title}`)
  }

  console.log("\n🌱 Seeding complete.\n")
}

main().catch((error) => {
  console.error("❌ Seed error:", error)
  process.exit(1)
})
