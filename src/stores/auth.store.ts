import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  
  // Actions
  setUser: (user: User, token: string) => void;
  logout: () => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login',
      
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      openAuthModal: (tab = 'login') => {
        set({
          isAuthModalOpen: true,
          authModalTab: tab,
        });
      },
      
      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },
      
      setAuthModalTab: (tab) => {
        set({ authModalTab: tab });
      },
    }),
    {
      name: 'qbolacel-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
