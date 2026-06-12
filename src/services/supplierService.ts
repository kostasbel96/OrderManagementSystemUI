import type {ResponseDTO, SearchRequest, Supplier, SupplierResponseDto} from "../types/Types.ts";
import {fetchWithAuth} from "../api/fetchWithAuth.ts";
import {useUIStore} from "../hooks/store/useUIStore.ts";


export async function addSupplier(newSupplier: Omit<Supplier, "id">): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const res = await fetchWithAuth(`${API_URL}/suppliers/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorResponse.message);
    return data.customer;
}

export async function searchSuppliers(request: SearchRequest): Promise<SupplierResponseDto> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const res = await fetchWithAuth(`${API_URL}/suppliers/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            page: request.page,
            pageSize: request.pageSize,
            globalSearch: request.globalSearch ?? "",
            filters: request.filters ?? [],
            sort: {
                field: request.sortBy ?? "name",
                sort: request.sortDirection ?? "asc"
            }
        })
    });

    if (!res.ok) throw new Error("Failed to search suppliers");

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function updateSupplier(supplier: Supplier): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/suppliers/update`;
    const res = await fetchWithAuth(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier)
    });
    if (!res.ok) throw new Error("Failed to update supplier");
    return await res.json();
}

export async function deleteSupplier(supplier: Supplier): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/suppliers/delete`;
    const res = await fetchWithAuth(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
    });
    if (!res.ok) throw new Error("Failed to delete supplier");
    return await res.json();
}