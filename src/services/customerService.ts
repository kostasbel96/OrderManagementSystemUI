import type {Customer, CustomerResponseDto, ResponseDTO, SearchRequest} from "../types/Types.ts";

const API_URL = import.meta.env.VITE_API_URL;

export async function addCustomer(newCustomer: Omit<Customer, "id">): Promise<ResponseDTO> {
    const res = await fetch(`${API_URL}/customers/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorResponse.message);
    return data.customer;
}

export async function getCustomers(page: number = 0, pageSize: number = 5, sortBy: string = "name", sortDirection: string = "desc"): Promise<CustomerResponseDto> {
    const url = `${API_URL}/customers?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch customers.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchCustomers(request: SearchRequest): Promise<CustomerResponseDto> {
    const res = await fetch(`${API_URL}/customers/search`, {
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
                field: request.sortBy ?? "name",
                sort: request.sortDirection ?? "asc"
            }
        })
    });

    if (!res.ok) throw new Error("Failed to search customers");

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function getCustomer(id: number): Promise<Customer> {
    const url = `${API_URL}/customers/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch customer with id: " +id);
    return await res.json();
}

export async function updateCustomer(customer: Customer): Promise<ResponseDTO> {
    const url = `${API_URL}/customers/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return await res.json();
}

export async function deleteCustomer(customer: Customer): Promise<ResponseDTO> {
    const url = `${API_URL}/customers/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return await res.json();
}