import { create } from 'zustand';

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
      const res = await fetch('http://localhost:3000/api/companies', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      set({ companies: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addCompany: async (companyData) => {
    try {
      const res = await fetch('http://localhost:3000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(companyData),
      });
      if (!res.ok) throw new Error('Failed to add company');
      const newCompany = await res.json();
      
      // Update local state
      const { companies } = get();
      set({ companies: [...companies, { ...newCompany, _count: { certificates: 0 } }] });
      
      return newCompany;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  },
  updateCompany: async (id, companyData) => {
    try {
      const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(companyData),
      });
      if (!res.ok) throw new Error('Failed to update company');
      const updatedCompany = await res.json();
      
      const { companies } = get();
      set({ companies: companies.map(c => c.id === id ? { ...c, ...updatedCompany } : c) });
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },
  deleteCompany: async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to delete company');
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
