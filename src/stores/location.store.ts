import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationStore {
  municipality: string | null;
  province: string | null;
  
  // Actions
  setLocation: (municipality: string, province: string) => void;
  clearLocation: () => void;
  hasLocation: () => boolean;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      municipality: null,
      province: null,
      
      setLocation: (municipality, province) => {
        set({ municipality, province });
      },
      
      clearLocation: () => {
        set({ municipality: null, province: null });
      },
      
      hasLocation: () => {
        return !!get().municipality;
      },
    }),
    {
      name: 'qbolacel-location',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
