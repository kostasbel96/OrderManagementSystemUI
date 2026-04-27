import type {
    Customer,
    OrderItem,
    OrderRequest,
    OrderResponseDto,
    SelectedProduct, ResponseDTO, SearchRequest,
} from "../types/Types.ts";
import {getApiUrl} from "../helper/IpHelper.ts";

interface OrderProps{
    products: SelectedProduct[];
    customer: Customer | null;
    address: string;
    date?: string;
}

const API_URL = getApiUrl();


export async function addOrder({products, customer, address}: OrderProps): Promise<OrderItem>{
    const orderRequest: OrderRequest = {
        address: address,
        customerId: customer?.id,
        items: products
            .map(p=>(
                {productId: p.product?.id, quantity: p.quantity, price: p.price.toString()}
            ))
    }
    const res = await fetch(`${API_URL}/orders/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return await res.json();
}


export async function getOrders(page: number = 0, pageSize: number = 10, sortBy: string = "date", sortDirection: string = "desc"): Promise<OrderResponseDto> {
    const url = `${API_URL}/orders?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch orders.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchOrders(request: SearchRequest): Promise<OrderResponseDto> {
    const res = await fetch(`${API_URL}/orders/search`, {
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

    if (!res.ok) throw new Error("Failed to search orders");

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function getOrder(id: number): Promise<ResponseDTO> {
    const url = `${API_URL}/orders/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch order with id: " + id);
    return await res.json();
}

export async function updateOrder(order: OrderItem): Promise<ResponseDTO> {
    const url = `${API_URL}/orders/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to update order.");
    return await res.json();
}

export async function deleteOrder(order: OrderItem): Promise<ResponseDTO> {
    const url = `${API_URL}/orders/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return await res.json();
}