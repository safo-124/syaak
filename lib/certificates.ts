import prisma from "@/lib/prisma"

// Achievement types - matching Prisma schema enum
type AchievementType = 
  | "FIRST_LESSON"
  | "FIRST_COURSE"
  | "STREAK_7"
  | "STREAK_30"
  | "COURSES_3"
  | "COURSES_10"
  | "PERFECT_SCORE"
  | "EARLY_BIRD"
  | "NIGHT_OWL"

// ============ CERTIFICATE HELPERS ============

export async function generateCertificateNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.certificate.count({
    where: {
      certificateNumber: {
        startsWith: `TechForUGH-${year}`,
      },
    },
  })
  const number = String(count + 1).padStart(4, "0")
  return `TechForUGH-${year}-${number}`
}

export async function createCertificate(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      student: true,
      course: {
        include: {
          instructors: {
            include: { instructor: true },
            where: { role: "OWNER" },
          },
        },
      },
    },
  })

  if (!enrollment) throw new Error("Enrollment not found")
  if (enrollment.status !== "COMPLETED") throw new Error("Course not completed")

  // Check if certificate already exists
  const existing = await prisma.certificate.findUnique({
    where: { enrollmentId },
  })

  if (existing) return existing

  const certificateNumber = await generateCertificateNumber()
  const instructorName = enrollment.course.instructors[0]?.instructor.name || "TechForUGH Team"

  return prisma.certificate.create({
    data: {
      studentId: enrollment.studentId,
      enrollmentId: enrollment.id,
      certificateNumber,
      courseName: enrollment.course.title,
      studentName: enrollment.student.name,
      instructorName,
    },
  })
}

export async function getCertificateById(certificateId: string) {
  return prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      student: true,
      enrollment: {
        include: {
          course: true,
        },
      },
    },
  })
}

export async function getCertificateByEnrollment(enrollmentId: string) {
  return prisma.certificate.findUnique({
    where: { enrollmentId },
  })
}

export async function getStudentCertificates(studentId: string) {
  return prisma.certificate.findMany({
    where: { studentId },
    orderBy: { issuedAt: "desc" },
    include: {
      enrollment: {
        include: {
          course: {
            select: {
              level: true,
              heroImageUrl: true,
            },
          },
        },
      },
    },
  })
}

// ============ STREAK HELPERS ============

export async function updateLearningStreak(studentId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = await prisma.learningStreak.findUnique({
    where: { studentId },
  })

  if (!streak) {
    // Create new streak
    streak = await prisma.learningStreak.create({
      data: {
        studentId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalDaysActive: 1,
      },
    })
    // Check for first lesson achievement
    await checkAndAwardAchievement(studentId, "FIRST_LESSON")
    return streak
  }

  const lastActive = streak.lastActiveDate
  if (!lastActive) {
    // First activity
    return prisma.learningStreak.update({
      where: { studentId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(1, streak.longestStreak),
        lastActiveDate: today,
        totalDaysActive: streak.totalDaysActive + 1,
      },
    })
  }

  const lastActiveDate = new Date(lastActive)
  lastActiveDate.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // Already active today
    return streak
  } else if (diffDays === 1) {
    // Consecutive day - extend streak
    const newStreak = streak.currentStreak + 1
    const updatedStreak = await prisma.learningStreak.update({
      where: { studentId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActiveDate: today,
        totalDaysActive: streak.totalDaysActive + 1,
      },
    })

    // Check for streak achievements
    if (newStreak >= 7) await checkAndAwardAchievement(studentId, "STREAK_7")
    if (newStreak >= 30) await checkAndAwardAchievement(studentId, "STREAK_30")

    return updatedStreak
  } else {
    // Streak broken
    return prisma.learningStreak.update({
      where: { studentId },
      data: {
        currentStreak: 1,
        lastActiveDate: today,
        totalDaysActive: streak.totalDaysActive + 1,
      },
    })
  }
}

export async function getStudentStreak(studentId: string) {
  return prisma.learningStreak.findUnique({
    where: { studentId },
  })
}

// ============ ACHIEVEMENT HELPERS ============

const achievementDetails: Record<AchievementType, { name: string; description: string; icon: string }> = {
  FIRST_LESSON: {
    name: "First Steps",
    description: "Completed your first lesson",
    icon: "🎯",
  },
  FIRST_COURSE: {
    name: "Graduate",
    description: "Completed your first course",
    icon: "🎓",
  },
  STREAK_7: {
    name: "Week Warrior",
    description: "Maintained a 7-day learning streak",
    icon: "🔥",
  },
  STREAK_30: {
    name: "Dedicated Learner",
    description: "Maintained a 30-day learning streak",
    icon: "💪",
  },
  COURSES_3: {
    name: "Triple Threat",
    description: "Completed 3 courses",
    icon: "⭐",
  },
  COURSES_10: {
    name: "Master Scholar",
    description: "Completed 10 courses",
    icon: "🏆",
  },
  PERFECT_SCORE: {
    name: "Perfectionist",
    description: "Achieved 100% in a course",
    icon: "💯",
  },
  EARLY_BIRD: {
    name: "Early Bird",
    description: "Started learning before 7 AM",
    icon: "🌅",
  },
  NIGHT_OWL: {
    name: "Night Owl",
    description: "Learning after midnight",
    icon: "🦉",
  },
}

export async function checkAndAwardAchievement(studentId: string, type: AchievementType) {
  const existing = await prisma.achievement.findUnique({
    where: { studentId_type: { studentId, type } },
  })

  if (existing) return null

  const details = achievementDetails[type]
  
  return prisma.achievement.create({
    data: {
      studentId,
      type,
      name: details.name,
      description: details.description,
      icon: details.icon,
    },
  })
}

export async function getStudentAchievements(studentId: string) {
  return prisma.achievement.findMany({
    where: { studentId },
    orderBy: { unlockedAt: "desc" },
  })
}

export async function checkCourseCompletionAchievements(studentId: string) {
  const completedCount = await prisma.enrollment.count({
    where: { studentId, status: "COMPLETED" },
  })

  if (completedCount === 1) await checkAndAwardAchievement(studentId, "FIRST_COURSE")
  if (completedCount >= 3) await checkAndAwardAchievement(studentId, "COURSES_3")
  if (completedCount >= 10) await checkAndAwardAchievement(studentId, "COURSES_10")
}

export async function checkTimeBasedAchievements(studentId: string) {
  const hour = new Date().getHours()
  
  if (hour < 7) {
    await checkAndAwardAchievement(studentId, "EARLY_BIRD")
  } else if (hour >= 0 && hour < 5) {
    await checkAndAwardAchievement(studentId, "NIGHT_OWL")
  }
}
