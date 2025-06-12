import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware'

interface NavigationState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeTab: '',
      setActiveTab: (tab) => set({ activeTab: tab })
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);