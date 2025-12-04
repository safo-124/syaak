"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, Loader2, Users, BookOpen, Award } from "lucide-react"
import { toast } from "sonner"

type ExportType = "students" | "enrollments" | "certificates" | "courses"

interface ExportButtonProps {
  type?: ExportType
}

export function ExportButton({ type }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportingType, setExportingType] = useState<ExportType | null>(null)

  const handleExport = async (exportType: ExportType) => {
    setIsExporting(true)
    setExportingType(exportType)
    
    try {
      const response = await fetch(`/api/admin/export/${exportType}`)
      
      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${exportType}-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      toast.success(`${exportType} exported successfully!`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Failed to export ${exportType}`)
    } finally {
      setIsExporting(false)
      setExportingType(null)
    }
  }

  if (type) {
    return (
      <Button 
        variant="outline" 
        onClick={() => handleExport(type)}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 size-4" />
            Export CSV
          </>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 size-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export to CSV</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleExport("students")}
          disabled={isExporting}
        >
          <Users className="mr-2 size-4" />
          Students
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("enrollments")}
          disabled={isExporting}
        >
          <BookOpen className="mr-2 size-4" />
          Enrollments
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("certificates")}
          disabled={isExporting}
        >
          <Award className="mr-2 size-4" />
          Certificates
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("courses")}
          disabled={isExporting}
        >
          <BookOpen className="mr-2 size-4" />
          Courses
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
