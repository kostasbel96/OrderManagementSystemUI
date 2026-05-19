import type {
    PurchaseOrderItem, PurchaseOrderItemResponseDto,
    PurchaseOrderRequest, ResponseDTO, SearchRequest,
    SelectedProduct,
    Supplier
} from "../types/Types.ts";
import {getApiUrl} from "../helper/IpHelper.ts";

interface OrderProps{
    products: SelectedProduct[];
    supplier: Supplier | null;
    address?: string;
    date?: string;
}

const API_URL = getApiUrl();

export async function addPurchaseOrder({products, supplier}: OrderProps): Promise<PurchaseOrderItem>{
    const orderRequest: PurchaseOrderRequest = {
        supplierId: supplier?.id,
        items: products
            .map(p=>(
                {productId: p.product?.id, quantity: p.quantity, price: p.price.toString()}
            ))
    }
    const res = await fetch(`${API_URL}/purchaseOrders/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest),
    });
    if (!res.ok) throw new Error("Failed to create purchase order");
    return await res.json();
}

export async function searchSupplierOrders(request: SearchRequest): Promise<PurchaseOrderItemResponseDto> {
    const res = await fetch(`${API_URL}/purchaseOrders/search`, {
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
                field: request.sortBy ?? "date",
                sort: request.sortDirection ?? "asc"
            }
        })
    });

    if (!res.ok) throw new Error("Failed to search purchase orders");

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function getPurchaseOrder(id: number): Promise<ResponseDTO> {
    const url = `${API_URL}/purchaseOrders/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch purchase order with id: " + id);
    return await res.json();
}

export async function updatePurchaseOrder(order: PurchaseOrderItem): Promise<ResponseDTO> {
    const url = `${API_URL}/purchaseOrders/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to update purchase order.");
    return await res.json();
}

export async function deletePurchaseOrder(order: PurchaseOrderItem): Promise<ResponseDTO> {
    const url = `${API_URL}/purchaseOrders/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to delete purchase order");
    return await res.json();
}