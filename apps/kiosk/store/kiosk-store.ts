import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface KioskState {
  isRegistered: boolean
  machineId: string | null
  registrationCode: string | null
  locationName: string | null
  
  // Actions
  registerMachine: (id: string, code: string, location: string | null) => void
  resetMachine: () => void
}

export const useKioskStore = create<KioskState>()(
  persist(
    (set) => ({
      isRegistered: false,
      machineId: null,
      registrationCode: null,
      locationName: null,

      registerMachine: (id, code, location) => 
        set({ 
          isRegistered: true, 
          machineId: id, 
          registrationCode: code,
          locationName: location
        }),

      resetMachine: () => 
        set({ 
          isRegistered: false, 
          machineId: null, 
          registrationCode: null,
          locationName: null
        }),
    }),
    {
      name: 'ramu-kiosk-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
