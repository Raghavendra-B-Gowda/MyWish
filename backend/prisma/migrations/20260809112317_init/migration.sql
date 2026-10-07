-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "courseName" TEXT,
    "internshipRole" TEXT,
    "department" TEXT,
    "durationValue" TEXT NOT NULL,
    "durationType" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "organization" TEXT,
    "issueDate" TEXT NOT NULL,
    "completionDate" TEXT,
    "templateId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Valid',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
