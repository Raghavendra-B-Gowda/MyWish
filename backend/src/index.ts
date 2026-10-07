import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { z } from "zod";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const app = express(); // Trigger watcher to reload .env
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Auth Middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback");
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};

// --- Auth Endpoints ---
app.post("/api/auth/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }

    const isValid = await bcrypt.compare(password, hash);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "fallback", { expiresIn: "8h" });
    
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", authMiddleware, (req: Request, res: Response) => {
  res.json({ authenticated: true, role: "admin" });
});

// Validation schema for creating a certificate
const certificateSchema = z.object({
  recipientName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  type: z.enum(["course", "internship"]),
  companyId: z.string().max(100).optional().nullable(),
  courseName: z.string().max(200).optional().nullable(),
  internshipRole: z.string().max(200).optional().nullable(),
  department: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  durationValue: z.string().max(50),
  durationType: z.enum(["hours", "months"]),
  directorName: z.string().min(1).max(100),
  directorSignature: z.string().optional().nullable(),
  directorSignatureFont: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  studentSignatureMode: z.enum(["manual", "ai"]).optional().nullable(),
  studentSignature: z.string().optional().nullable(),
  issueDate: z.string(),
  completionDate: z.string().optional().nullable(),
  templateId: z.string(),
  certificateColor: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  font: z.string().optional().nullable(),
  logoType: z.string().optional().nullable(),
  backgroundPattern: z.string().optional().nullable(),
  backgroundPatterns: z.array(z.string()).optional().nullable(),
  combineWatermarks: z.boolean().optional().nullable(),
});

// Create Certificate
app.post("/api/certificates", async (req: Request, res: Response) => {
  try {
    const validatedData = certificateSchema.parse(req.body);
    
    // Generate unique ID like MW-2026-XXXXX
    const year = new Date().getFullYear();
    const shortId = nanoid(6).toUpperCase();
    const id = `MW-${year}-${shortId}`;

    // Convert undefined to null for Prisma types
    const prismaData: any = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [key, value === undefined ? null : value])
    );
    
    if (prismaData.backgroundPatterns) {
      prismaData.backgroundPatterns = JSON.stringify(prismaData.backgroundPatterns);
    }

    const certificate = await prisma.certificate.create({
      data: {
        id,
        ...prismaData,
        status: "Valid",
      } as any,
      include: {
        company: true
      }
    });

    if (certificate.backgroundPatterns) {
      try {
        (certificate as any).backgroundPatterns = JSON.parse(certificate.backgroundPatterns as string);
      } catch(e) {}
    }

    res.status(201).json(certificate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
  }
});

// Get Certificate for Verification
app.get("/api/certificates/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (certificate.backgroundPatterns) {
      try {
        (certificate as any).backgroundPatterns = JSON.parse(certificate.backgroundPatterns as string);
      } catch(e) {}
    }

    // Increment verification count if valid
    await prisma.certificate.update({
      where: { id },
      data: { verificationCount: { increment: 1 } }
    });

    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List Certificates for Dashboard
app.get("/api/certificates", authMiddleware, async (req: Request, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
      include: { company: true }
    });
    
    certificates.forEach(cert => {
      if (cert.backgroundPatterns) {
        try {
          (cert as any).backgroundPatterns = JSON.parse(cert.backgroundPatterns as string);
        } catch(e) {}
      }
    });

    res.json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Revoke Certificate
app.patch("/api/certificates/:id/revoke", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { status: "Revoked" },
      include: { company: true }
    });
    
    if (certificate.backgroundPatterns) {
      try {
        (certificate as any).backgroundPatterns = JSON.parse(certificate.backgroundPatterns as string);
      } catch(e) {}
    }

    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Unrevoke Certificate
app.patch("/api/certificates/:id/unrevoke", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { status: "Valid" },
      include: { company: true }
    });
    
    if (certificate.backgroundPatterns) {
      try {
        (certificate as any).backgroundPatterns = JSON.parse(certificate.backgroundPatterns as string);
      } catch(e) {}
    }

    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Certificate
app.delete("/api/certificates/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.certificate.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard Stats
app.get("/api/stats", authMiddleware, async (req: Request, res: Response) => {
  try {
    const total = await prisma.certificate.count();
    const valid = await prisma.certificate.count({ where: { status: "Valid" } });
    const revoked = await prisma.certificate.count({ where: { status: "Revoked" } });
    
    // Calculate total verifications across all certificates
    const verificationData = await prisma.certificate.aggregate({
      _sum: {
        verificationCount: true
      }
    });
    const verifications = verificationData._sum.verificationCount || 0;

    // Get time-series data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCertificates = await prisma.certificate.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    // We'll return the raw recent cert dates and let the frontend format it for the chart
    res.json({ 
      total, 
      valid, 
      revoked, 
      verifications,
      recentCertificates: recentCertificates.map(c => c.createdAt)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Company Endpoints ---

// Get all companies
app.get("/api/companies", authMiddleware, async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { certificates: true }
        }
      }
    });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create company
app.post("/api/companies", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, website, logo } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const company = await prisma.company.create({
      data: { name, website, logo }
    });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update company
app.put("/api/companies/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, website, logo } = req.body;
    
    const company = await prisma.company.update({
      where: { id },
      data: { name, website, logo }
    });
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete company
app.delete("/api/companies/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Check if certificates exist
    const count = await prisma.certificate.count({ where: { companyId: id } });
    if (count > 0) {
      return res.status(400).json({ error: "Cannot delete company with existing certificates. Delete certificates first." });
    }

    await prisma.company.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
