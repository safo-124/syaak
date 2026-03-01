"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { pdf } from "@react-pdf/renderer"
import { CertificatePDF } from "@/components/certificate-pdf"
import { toast } from "sonner"

interface CertificateDownloadProps {
  certificate: {
    id: string
    studentName: string
    courseName: string
    instructorName: string | null
    certificateNumber: string
    issuedAt: Date
  }
  level?: string
}

export function CertificateDownload({ certificate, level }: CertificateDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const doc = (
        <CertificatePDF
          studentName={certificate.studentName}
          courseName={certificate.courseName}
          instructorName={certificate.instructorName || "TechForUGH Team"}
          certificateNumber={certificate.certificateNumber}
          issuedAt={new Date(certificate.issuedAt)}
          level={level}
        />
      )

      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `Certificate-${certificate.courseName.replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      toast.success("Certificate downloaded successfully!")
    } catch (error) {
      console.error("Error generating certificate:", error)
      toast.error("Failed to generate certificate")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 size-4" />
          Download
        </>
      )}
    </Button>
  )
}
