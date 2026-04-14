import type {
    Customer,
    OrderItem,
    OrderRequest,
    OrderResponseDto,
    SelectedProduct, ResponseDTO,
} from "../types/Types.ts";

interface OrderProps{
    products: SelectedProduct[];
    customer: Customer | null;
    address: string;
    date?: string;
    deposit: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export const orders: OrderItem[] = [];

export async function addOrder({products, customer, address, deposit}: OrderProps): Promise<OrderItem>{
    const orderRequest: OrderRequest = {
        address: address,
        customerId: customer?.id,
        deposit: deposit,
        items: products
            .map(p=>(
                {productId: p.product.id, quantity: p.quantity, price: p.price.toString()}
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


export async function getOrders(page: number = 0, pageSize: number = 5, sortBy: string = "date", sortDirection: string = "desc"): Promise<OrderResponseDto> {
    const url = `${API_URL}/orders?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch orders.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchOrderByCustomerName(name: string, page: number = 0, pageSize: number = 5, sortBy: string = "date", sortDirection: string = "desc") :Promise<OrderResponseDto> {
    let firstName = "";
    let lastName = "";
    if(name.includes(" ")){
        [firstName, lastName] = name.split(" ");
    } else {
        [firstName, lastName] = [name, name];
    }
    const res = await fetch(`${API_URL}/orders/search?name=${firstName}&lastName=${lastName}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
    if (!res.ok) throw new Error("Failed to search orders.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
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