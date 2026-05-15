import type {
    PurchaseOrderItem,
    PurchaseOrderRequest,
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
    const res = await fetch(`${API_URL}/purchase-orders/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest),
    });
    if (!res.ok) throw new Error("Failed to create purchase order");
    return await res.json();
}