import type {
    ErrorResponse, PaymentRequest, PaymentResponseDto,
    ResponseDTO,
    SearchRequest, Supplier
} from "../types/Types.ts";
import {fetchWithAuth} from "../api/fetchWithAuth.ts";
import {useUIStore} from "../hooks/store/useUIStore.ts";


interface ReceiptProps{
    amount: string;
    supplier: Supplier | null;
    notes: string;
    orderIds: number[] | null;
}

export async function addPayment({amount, supplier, notes, orderIds}: ReceiptProps): Promise<ResponseDTO>{
    const paymentRequest: PaymentRequest = {
        amount: amount,
        supplierId: supplier?.id ?? null,
        orderIds: orderIds,
        notes: notes ?? ""
    }
    const { url } = useUIStore.getState();
    const API_URL = url;
    const res = await fetchWithAuth(`${API_URL}/payments/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentRequest),
    });
    if (!res.ok) throw new Error("Failed to create payment");
    return await res.json();
}

export async function getPayment(id: number): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/payments/${id}`;
    const res = await fetchWithAuth(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch payment with id: " + id);
    return await res.json();
}

export async function searchPayments(
    request: SearchRequest
): Promise<PaymentResponseDto> {

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
    const { url } = useUIStore.getState();
    const API_URL = url;
    const res = await fetchWithAuth(`${API_URL}/payments/search`, {
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

export async function deletePayment(id: number): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/payments/delete`;
    const res = await fetchWithAuth(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id: id}),
    });
    if (!res.ok) throw new Error("Failed to delete payment");
    return await res.json();
}
