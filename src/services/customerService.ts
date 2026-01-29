import type {Customer, CustomerResponseDto} from "../types/Types.ts";

const API_URL = "http://localhost:8080/api";

export async function addCustomer(newCustomer: Omit<Customer, "id">): Promise<Customer> {
    const res = await fetch(`${API_URL}/customers/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
    });
    if (!res.ok) throw new Error("Failed to create Customer");
    return await res.json();
}

export async function getCustomers(page: number = 0, pageSize: number = 5): Promise<CustomerResponseDto> {
    let url = `${API_URL}/customers?page=${page}&size=${pageSize}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch customers.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchCustomerByName(name: string) :Promise<Customer[]> {
    const res = await fetch(`${API_URL}/customers/search?name=${name}&lastName=${name}`);
    if (!res.ok) throw new Error("Failed to search customers");
    return await res.json();
}