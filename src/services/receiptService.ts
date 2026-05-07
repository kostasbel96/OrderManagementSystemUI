import type {Customer, ReceiptRequest, ResponseDTO} from "../types/Types.ts";
import {getApiUrl} from "../helper/IpHelper.ts";


const API_URL = getApiUrl();

interface ReceiptProps{
    amount: string;
    customer: Customer | null;
    notes: string;
    orderIds: number[] | null;
}

export async function addReceipt({amount, customer, notes, orderIds}: ReceiptProps): Promise<ResponseDTO>{
    const receiptRequest: ReceiptRequest = {
        amount: amount,
        customerId: customer?.id ?? null,
        orderIds: orderIds,
        notes: notes ?? ""
    }
    const res = await fetch(`${API_URL}/receipts/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiptRequest),
    });
    if (!res.ok) throw new Error("Failed to create receipt");
    return await res.json();
}