import {getApiUrl} from "../helper/IpHelper.ts";
import type {ResponseDTO, Supplier} from "../types/Types.ts";

const API_URL = getApiUrl();

export async function addSupplier(newSupplier: Omit<Supplier, "id">): Promise<ResponseDTO> {
    const res = await fetch(`${API_URL}/suppliers/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorResponse.message);
    return data.customer;
}