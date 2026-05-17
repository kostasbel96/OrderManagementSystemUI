import type {
    PurchaseOrderItem, PurchaseOrderItemResponseDto,
    PurchaseOrderRequest, SearchRequest,
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