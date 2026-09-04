import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderHistoryItem {
  id: string;
  type: 'menu' | 'ai';
  title: string;
  description: string;
  timestamp: number;
}

interface UserState {
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
  activeSessionId: string | null;
  activeMachineId: string | null;
  lastActivityAt: number | null;
  history: OrderHistoryItem[];
  
  setSession: (sessionId: string, machineId?: string | null) => void;
  setUser: (name: string, email: string) => void;
  updateActivity: () => void;
  clearSession: () => void;
  logout: () => void;
  addHistory: (item: OrderHistoryItem) => void;
  clearHistory: () => void;
  checkTimeout: () => boolean; // Returns true if timed out
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userName: null,
      userEmail: null,
      activeSessionId: null,
      activeMachineId: null,
      lastActivityAt: null,
      history: [],

      setSession: (sessionId, machineId) => set((state) => ({ 
        activeSessionId: sessionId,
        activeMachineId: machineId || state.activeMachineId,
        lastActivityAt: Date.now()
      })),

      setUser: (name, email) => set({
        isLoggedIn: true,
        userName: name,
        userEmail: email
      }),

      updateActivity: () => {
        if (get().activeSessionId) {
          set({ lastActivityAt: Date.now() });
        }
      },

      clearSession: () => set({ activeSessionId: null, activeMachineId: null, lastActivityAt: null }),

      logout: () => set({ 
        isLoggedIn: false, 
        userName: null, 
        userEmail: null,
        history: [] // Opsional: Hapus history lokal saat logout
      }),

      addHistory: (item) => set((state) => ({
        history: [item, ...state.history] // Prepend new items
      })),

      clearHistory: () => set({ history: [] }),

      checkTimeout: () => {
        const state = get();
        if (!state.activeSessionId || !state.lastActivityAt) return false;
        
        // 5 minutes = 300,000 ms
        const isExpired = Date.now() - state.lastActivityAt > 300000;
        if (isExpired) {
          set({ activeSessionId: null, activeMachineId: null, lastActivityAt: null });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'ramu-user-storage',
    }
  )
);
