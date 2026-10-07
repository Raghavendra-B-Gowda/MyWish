const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = {
    id: "TEST-123",
    type: "course",
    templateId: "modern-1",
    recipientName: "Demo Student",
    email: "demo@example.com",
    organization: "",
    description: "",
    directorName: "Dr. Arjun Rao",
    directorSignature: "",
    directorSignatureFont: "Mrs Saint Delafield",
    studentSignatureMode: "manual",
    studentSignature: "",
    issueDate: "2026-08-09",
    courseName: "",
    durationType: "hours",
    durationValue: "1",
    completionDate: "",
    certificateColor: "#FFFFFF",
    accentColor: "#1769E0",
    textColor: "#152238",
    font: "Inter",
    logoType: "mywish",
    status: "Valid"
  };
  
  try {
    const res = await prisma.certificate.create({ data });
    console.log("Success:", res);
  } catch (err) {
    console.error("Prisma Error:", err);
  }
}

main().finally(() => prisma.$disconnect());
