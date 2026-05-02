import {getApiUrl} from "../helper/IpHelper.ts";
import type {OrderRow, ResponseDTO, Route, RouteRequest, RouteResponseDto, SearchRequest} from "../types/Types.ts";

const API_URL = getApiUrl();

interface MyRouteProps {
    name: string;
    notes: string;
    driverId: number | undefined | null;
    orders: OrderRow[];
}

export async function addRoute({
                                   name,
                                   notes,
                                   driverId,
                                   orders
                               }: MyRouteProps): Promise<ResponseDTO> {

    if (!driverId) {
        throw new Error("Driver is required");
    }

    const routeRequest: RouteRequest = {
        name,
        notes,
        driverId,
        orderIds: orders.map(order => order.id)
    };
    const res = await fetch(`${API_URL}/routes/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(routeRequest),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => null);
        throw new Error(errorText || "Failed to create route");
    }

    return await res.json();
}

export async function searchRoutes(
    request: SearchRequest
): Promise<RouteResponseDto> {

    const payload = {
        page: request.page,
        pageSize: request.pageSize,
        globalSearch: request.globalSearch ?? "",
        filters: request.filters ?? [],
        sort: {
            field: request.sortBy ?? "date",
            sort: request.sortDirection ?? "asc"
        }
    };

    const res = await fetch(`${API_URL}/routes/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => null);
        throw new Error(errorText || "Failed to search routes");
    }

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function updateRoute(route: Route): Promise<ResponseDTO> {

    const res = await fetch(`${API_URL}/routes/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: route.id,
            name: route.name,
            notes: route.notes,
            status: route.status,
            driverId: route.driver?.id,
            orderIds: route.orders.map(order => order.id)
        }),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => null);
        throw new Error(errorText || "Failed to update route.");
    }

    return await res.json();
}

export async function getRoute(id: number): Promise<ResponseDTO> {
    const url = `${API_URL}/routes/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch route with id: " + id);
    return await res.json();
}

export async function deleteRoute(route: Route): Promise<ResponseDTO> {

    const res = await fetch(`${API_URL}/routes/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(route),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => null);
        throw new Error(errorText || "Failed to delete route.");
    }

    return await res.json();
}