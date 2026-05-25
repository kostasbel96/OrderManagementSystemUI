import { create } from "zustand";

type UIStore = {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;
    toggleSidebar: () => void;
    lowStockThreshold: number;
    setLowStockThreshold: (v: number) => void;
    refreshKey: number;
    incrementRefreshKey: () => void;
    currency: string;
    setCurrency: (v: string) => void;
    locale: string;
    setLocale: (v: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
    sidebarCollapsed: false,

    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    lowStockThreshold: Number(localStorage.getItem("lowStockThreshold")) || 10,
    setLowStockThreshold: (v) => set({ lowStockThreshold: v }),

    refreshKey: 0,
    incrementRefreshKey: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    currency: 'EUR',
    setCurrency: (v) => set({ currency: v }),

    locale: 'el-GR',
    setLocale: (v) => set({ locale: v }),
}));