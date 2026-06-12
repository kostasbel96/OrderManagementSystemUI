import {fetchWithAuth} from "../api/fetchWithAuth.ts";
import type {KpiCardResponse, StockItem} from "../types/Types.ts";
import {useUIStore} from "../hooks/store/useUIStore.ts";


export async function getStockLevels(threshold: number): Promise<StockItem[]> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/dashboard/stockLevels/${threshold}`;
    const res = await fetchWithAuth(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch stock levels");
    return await res.json();
}

export const getKpiCard = async (threshold: number = 10): Promise<KpiCardResponse> => {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/dashboard/kpiCard/${threshold}`;
    const response = await fetchWithAuth(apiUrl);

    if (!response.ok) {
        throw new Error("Failed to fetch KPI card");
    }

    return response.json();
};