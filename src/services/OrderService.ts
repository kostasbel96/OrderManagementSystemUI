import type {Customer, OrderItem, OrderRequest, SelectedProduct} from "../types/Types.ts";
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

export const getOrders = (limit: number = 0) => {
    if (limit) return orders.slice(0, limit);
    return  orders;
}

export const searchOrderByCustomerName = (name: string) => {
    return orders.filter(order => (`${order.customer?.name} ${order.customer?.lastName}`.toLowerCase().includes(name.toLowerCase())));

}