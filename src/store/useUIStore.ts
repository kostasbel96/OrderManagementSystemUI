import { create } from "zustand";

type UIStore = {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;
    toggleSidebar: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
    sidebarCollapsed: false,

    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));