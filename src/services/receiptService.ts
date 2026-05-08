import type {
    Customer,
    ErrorResponse,
    ReceiptRequest, ReceiptResponseDto,
    ResponseDTO,
    SearchRequest
} from "../types/Types.ts";
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

export async function getReceipt(id: number): Promise<ResponseDTO> {
    const url = `${API_URL}/receipts/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch receipt with id: " + id);
    return await res.json();
}

export async function searchReceipts(
    request: SearchRequest
): Promise<ReceiptResponseDto> {

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

    const res = await fetch(`${API_URL}/receipts/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error: ErrorResponse = await res.json();
        throw new Error(error.message);
    }

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function deleteReceipt(id: number): Promise<ResponseDTO> {
    const url = `${API_URL}/receipts/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id: id}),
    });
    if (!res.ok) throw new Error("Failed to delete receipt");
    return await res.json();
}
