import { create } from 'zustand';
import { API_URL } from '@/config/api';

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
      
      // Ensure required fields have valid data
      const dataToSubmit = {
        ...currentData,
        recipientName: currentData.recipientName || "Demo Student",
        email: currentData.email || "demo@example.com",
        durationValue: currentData.durationValue || "1"
      };

      // Try backend first, fall back to local generation
      if (API_URL) {
        try {
          const response = await fetch(`${API_URL}/api/certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dataToSubmit)
          });
          
          if (response.ok) {
            const result = await response.json();
            set({ generatedId: result.id, isLoading: false });
            return true;
          }
        } catch {
          // Backend unavailable, fall through to local generation
          console.warn("Backend unavailable, generating certificate locally.");
        }
      }

      // Local fallback: generate a unique certificate ID
      const year = new Date().getFullYear();
      const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(3)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join('');
      const localId = `MW-${year}-${randomHex}`;
      
      set({ generatedId: localId, isLoading: false });
      return true;
    } catch (err: any) {
      console.error("Certificate generation failed:", err);
      set({ error: err.message || "Failed to generate certificate", isLoading: false });
      return false;
    }
  }
}));
