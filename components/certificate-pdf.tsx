import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    position: "relative",
  },
  border: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 3,
    borderColor: "#1E40AF",
    borderStyle: "solid",
  },
  innerBorder: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    borderWidth: 1,
    borderColor: "#93C5FD",
    borderStyle: "solid",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    letterSpacing: 2,
  },
  title: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 36,
    color: "#1E40AF",
    fontWeight: "bold",
    letterSpacing: 3,
  },
  ofCompletion: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
    letterSpacing: 4,
  },
  recipient: {
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  presentedTo: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 10,
  },
  studentName: {
    fontSize: 32,
    color: "#0F172A",
    fontWeight: "bold",
    fontStyle: "italic",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 10,
    marginHorizontal: 60,
  },
  courseSection: {
    textAlign: "center",
    marginTop: 30,
  },
  forCompleting: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 20,
    color: "#1E40AF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    textAlign: "center",
    marginTop: 20,
  },
  detailText: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 40,
  },
  signatureBlock: {
    alignItems: "center",
    width: "40%",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    width: "100%",
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#64748B",
  },
  signatureName: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "bold",
    marginTop: 5,
  },
  certificateNumber: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#94A3B8",
  },
  decorativeCorner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FBBF24",
    borderWidth: 2,
  },
  topLeft: {
    top: 35,
    left: 35,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 35,
    right: 35,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 35,
    left: 35,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 35,
    right: 35,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
})

interface CertificatePDFProps {
  studentName: string
  courseName: string
  instructorName: string
  certificateNumber: string
  issuedAt: Date
  level?: string
}

export function CertificatePDF({
  studentName,
  courseName,
  instructorName,
  certificateNumber,
  issuedAt,
  level,
}: CertificatePDFProps) {
  const formattedDate = issuedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Decorative Borders */}
        <View style={styles.border} />
        <View style={styles.innerBorder} />
        
        {/* Decorative Corners */}
        <View style={[styles.decorativeCorner, styles.topLeft]} />
        <View style={[styles.decorativeCorner, styles.topRight]} />
        <View style={[styles.decorativeCorner, styles.bottomLeft]} />
        <View style={[styles.decorativeCorner, styles.bottomRight]} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>TechForUGH</Text>
          <Text style={styles.subtitle}>DATA SCIENCE ACADEMY</Text>
        </View>

        {/* Title */}
        <View style={styles.title}>
          <Text style={styles.certificateTitle}>CERTIFICATE</Text>
          <Text style={styles.ofCompletion}>OF COMPLETION</Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.presentedTo}>THIS IS TO CERTIFY THAT</Text>
          <Text style={styles.studentName}>{studentName}</Text>
        </View>

        {/* Course */}
        <View style={styles.courseSection}>
          <Text style={styles.forCompleting}>HAS SUCCESSFULLY COMPLETED THE COURSE</Text>
          <Text style={styles.courseName}>{courseName}</Text>
          {level && (
            <Text style={styles.detailText}>Level: {level}</Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.detailText}>Issued on {formattedDate}</Text>
        </View>

        {/* Signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{instructorName}</Text>
            <Text style={styles.signatureLabel}>Course Instructor</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>TechForUGH</Text>
            <Text style={styles.signatureLabel}>Academy Director</Text>
          </View>
        </View>

        {/* Certificate Number */}
        <Text style={styles.certificateNumber}>
          Certificate ID: {certificateNumber}
        </Text>
      </Page>
    </Document>
  )
}
