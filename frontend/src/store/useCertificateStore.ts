import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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
  backgroundPattern?: string;
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
      
      const dataToSubmit: any = {
        ...currentData,
        recipientName: currentData.recipientName || "Demo Student",
        email: currentData.email || "demo@example.com",
        durationValue: currentData.durationValue || "1"
      };

      // Convert arrays to JSON strings for Prisma/Supabase compatibility if needed
      if (dataToSubmit.backgroundPatterns) {
        dataToSubmit.backgroundPatterns = JSON.stringify(dataToSubmit.backgroundPatterns);
      }
      
      // Clean up frontend-only fields
      delete dataToSubmit.image;
      delete dataToSubmit.showBadge;
      delete dataToSubmit.badgeType;
      
      // Replace undefined with null
      Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] === undefined) dataToSubmit[key] = null;
      });

      const year = new Date().getFullYear();
      const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(3)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join('');
      const localId = `MW-${year}-${randomHex}`;

      const { error } = await supabase
        .from('Certificate')
        .insert([{ 
          id: localId, 
          status: 'Valid', 
          updatedAt: new Date().toISOString(),
          ...dataToSubmit 
        }]);

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
      }

      set({ generatedId: localId, isLoading: false });
      return true;
    } catch (err: any) {
      console.error("Certificate generation failed:", err);
      // Fallback for offline mode if Supabase fails (e.g. RLS errors)
      const year = new Date().getFullYear();
      const localId = `MW-${year}-XXXX`;
      set({ generatedId: localId, isLoading: false, error: err.message });
      return false;
    }
  }
}));
