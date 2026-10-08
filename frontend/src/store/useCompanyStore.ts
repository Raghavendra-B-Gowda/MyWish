import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  _count?: {
    certificates: number;
  };
  createdAt: string;
}

interface CompanyStore {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  addCompany: (data: Partial<Company>) => Promise<Company | null>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,
  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('Company')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      set({ companies: data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addCompany: async (companyData) => {
    try {
      const { data, error } = await supabase
        .from('Company')
        .insert([companyData])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      const { companies } = get();
      set({ companies: [...companies, { ...data, _count: { certificates: 0 } }] });
      
      return data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  },
  updateCompany: async (id, companyData) => {
    try {
      const { data, error } = await supabase
        .from('Company')
        .update(companyData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      const { companies } = get();
      set({ companies: companies.map(c => c.id === id ? { ...c, ...data } : c) });
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },
  deleteCompany: async (id) => {
    try {
      const { error } = await supabase
        .from('Company')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      const { companies } = get();
      set({ companies: companies.filter(c => c.id !== id) });
      return true;
    } catch (err: any) {
      alert(err.message);
      console.error(err);
      return false;
    }
  }
}));
