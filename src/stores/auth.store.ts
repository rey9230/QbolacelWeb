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
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  
  // Actions
  setUser: (user: User, token: string, refreshToken: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
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
      refreshToken: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login',
      
      setUser: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },
      
      updateTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // Clear cart from localStorage on logout
        localStorage.removeItem('qbolacel-cart');
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
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
