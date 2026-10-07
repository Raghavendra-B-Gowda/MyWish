import { create } from 'zustand';

export type DurationType = 'hours' | 'months';
export type CertificateType = 'course' | 'internship';

export interface CertificateData {
  type: CertificateType;
  templateId: string;
  recipientName: string;
  email: string;
  companyId?: string;
  organization: string;
  
  description?: string;
  
  directorName: string;
  directorSignature?: string;
  directorSignatureFont: string;
  
  studentSignatureMode: "manual" | "ai";
  studentSignature?: string;
  
  issueDate: string;
  
  // Course specific
  courseName?: string;
  
  // Internship specific
  internshipRole?: string;
  department?: string;
  
  durationType: DurationType;
  durationValue: string;
  completionDate?: string;
  
  // Design configuration
  certificateColor: string;
  accentColor: string;
  textColor: string;
  font: string;
  logoType: string;
  image?: string;
  showBadge?: boolean;
  badgeType?: 'seal' | 'academic' | 'none';
  backgroundPattern?: string; // Keep for backward compatibility
  backgroundPatterns?: string[];
  combineWatermarks?: boolean;
}

interface CertificateStore {
  data: CertificateData;
  isLoading: boolean;
  error: string | null;
  generatedId: string | null;
  activeCompanyOverride: { name?: string; image?: string; loading?: boolean; hidden?: boolean } | null;
  setActiveCompanyOverride: (company: { name?: string; image?: string; loading?: boolean; hidden?: boolean } | null) => void;
  updateData: (updates: Partial<CertificateData>) => void;
  reset: () => void;
  generateCertificate: () => Promise<boolean>;
}

const initialData: CertificateData = {
  type: 'course',
  templateId: 'modern-1',
  recipientName: '',
  email: '',
  companyId: undefined,
  organization: '',
  description: '',
  directorName: 'Dr. Arjun Rao',
  directorSignature: '',
  directorSignatureFont: 'Mrs Saint Delafield',
  studentSignatureMode: 'manual',
  studentSignature: '',
  issueDate: new Date().toISOString().split('T')[0],
  courseName: '',
  durationType: 'hours',
  durationValue: '',
  completionDate: '',
  
  certificateColor: '#FFFFFF',
  accentColor: '#1769E0',
  textColor: '#152238',
  font: 'Inter',
  logoType: 'skillzo',
  showBadge: true,
  badgeType: 'seal',
  backgroundPattern: 'none',
  backgroundPatterns: [],
  combineWatermarks: false
};

export const useCertificateStore = create<CertificateStore>((set, get) => ({
  data: initialData,
  isLoading: false,
  error: null,
  generatedId: null,
  activeCompanyOverride: null,
  setActiveCompanyOverride: (company) => set({ activeCompanyOverride: company }),
  updateData: (updates) => set((state) => ({ 
    data: { ...state.data, ...updates } 
  })),
  reset: () => set({ data: initialData, generatedId: null, error: null }),
  generateCertificate: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentData = get().data;
      
      // Ensure required fields have valid data for the backend Zod validation
      const dataToSubmit = {
        ...currentData,
        recipientName: currentData.recipientName || "Demo Student",
        email: currentData.email || "demo@example.com",
        durationValue: currentData.durationValue || "1"
      };

      const response = await fetch('http://localhost:3000/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.errors) {
          const messages = errorData.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
          throw new Error(`Validation failed: ${messages}`);
        }
        throw new Error(errorData?.error || 'Failed to connect to the backend server.');
      }
      
      const result = await response.json();
      set({ generatedId: result.id, isLoading: false });
      return true;
    } catch (err: any) {
      console.error("Backend generation failed:", err);
      set({ error: err.message || "Failed to generate certificate", isLoading: false });
      return false;
    }
  }
}));
