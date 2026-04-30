import {getApiUrl} from "../helper/IpHelper.ts";
import type {Driver, DriverResponseDto, ResponseDTO, SearchRequest} from "../types/Types.ts";

const API_URL = getApiUrl();

export async function addDriver(newDriver: Omit<Driver, "id">): Promise<ResponseDTO> {
    const res = await fetch(`${API_URL}/drivers/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorResponse.message);
    return data.customer;
}

export async function searchDrivers(request: SearchRequest): Promise<DriverResponseDto> {
    const res = await fetch(`${API_URL}/drivers/search`, {
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

    if (!res.ok) throw new Error("Failed to search drivers");

    const data = await res.json();
    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function updateDriver(driver: Driver): Promise<ResponseDTO> {
    const url = `${API_URL}/drivers/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driver)
    });
    if (!res.ok) throw new Error("Failed to update driver");
    return await res.json();
}

export async function deleteDriver(driver: Driver): Promise<ResponseDTO> {
    const url = `${API_URL}/drivers/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driver),
    });
    if (!res.ok) throw new Error("Failed to delete driver");
    return await res.json();
}
