import { create } from 'zustand';
import { API_URL } from '@/config/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  checkAuth: async () => {
    if (!API_URL) { set({ isAuthenticated: false, isLoading: false }); return; }
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
      if (res.ok) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
  login: async (password: string) => {
    if (!API_URL) return false;
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      });
      if (res.ok) {
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  logout: async () => {
    try {
      if (API_URL) {
        await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      }
      set({ isAuthenticated: false });
    } catch (e) {
      console.error(e);
    }
  },
}));
