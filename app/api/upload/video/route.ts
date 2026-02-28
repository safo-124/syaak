import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export const maxDuration = 120 // 2 min timeout for large uploads

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
      "video/avi",
      "video/mov",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: MP4, WebM, MOV, AVI." },
        { status: 400 }
      )
    }

    const maxSize = 500 * 1024 * 1024 // 500 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max 500 MB." },
        { status: 400 }
      )
    }

    const videosDir = path.join(process.cwd(), "public", "uploads", "videos")
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true })
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "mp4"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(videosDir, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/videos/${fileName}`,
      name: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error("Video upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
