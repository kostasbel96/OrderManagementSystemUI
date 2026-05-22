import {getApiUrl} from "../helper/IpHelper.ts";
import {fetchWithAuth} from "../api/fetchWithAuth.ts";
import type {StockItem} from "../types/Types.ts";

const API_URL = getApiUrl();

export async function getStockLevels(threshold: number): Promise<StockItem[]> {
    const url = `${API_URL}/dashboard/stockLevels/${threshold}`;
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error("Failed to fetch stock levels");
    return await res.json();
}