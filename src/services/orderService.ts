import type {
    Customer,
    OrderItem,
    OrderRequest,
    OrderResponse,
    OrderResponseDto,
    SelectedProduct
} from "../types/Types.ts";

interface OrderProps{
    products: SelectedProduct[];
    customer: Customer | null;
    address: string;
    date?: string;
}

const API_URL = "http://localhost:8080/api";

export const orders: OrderItem[] = [];

export async function addOrder({products, customer, address}: OrderProps): Promise<OrderItem>{
    const orderRequest: OrderRequest = {
        address: address,
        customerId: customer?.id,
        items: products.map(p=>({productId: p.product.id, quantity: p.quantity}))
    }
    const res = await fetch(`${API_URL}/orders/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest),
    });
    if (!res.ok) throw new Error("Failed to create Customer");
    return await res.json();
}


export async function getOrders(page: number = 0, pageSize: number = 5): Promise<OrderResponseDto> {
    const url = `${API_URL}/orders?page=${page}&size=${pageSize}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch orders.");
    const data = await res.json();
    console.log(data.content);
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchOrderByCustomerName(name: string) :Promise<OrderResponse> {
    let firstName = "";
    let lastName = "";
    if(name.includes(" ")){
        [firstName, lastName] = name.split(" ");
    } else {
        [firstName, lastName] = [name, name];
    }
    const res = await fetch(`${API_URL}/orders/search?name=${firstName}&lastName=${lastName}`);
    if (!res.ok) throw new Error("Failed to search orders.");
    return await res.json();
}

export async function getOrder(id: number): Promise<OrderResponse> {
    const url = `${API_URL}/orders/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch order with id: " + id);
    return await res.json();
}