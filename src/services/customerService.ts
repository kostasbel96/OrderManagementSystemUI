import type {Customer, CustomerResponseDto} from "../types/Types.ts";

const API_URL = "http://192.168.1.2:8080/api";

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
    const url = `${API_URL}/customers?page=${page}&size=${pageSize}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch customers.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function searchCustomerByName(name: string, page: number = 0, pageSize: number = 5) :Promise<CustomerResponseDto> {
    let firstName = "";
    let lastName = "";
    if(name.includes(" ")){
        [firstName, lastName] = name.split(" ");
    } else {
        [firstName, lastName] = [name, name];
    }
    const res = await fetch(`${API_URL}/customers/search?name=${firstName}&lastName=${lastName}&page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error("Failed to search customers");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function getCustomer(id: number): Promise<Customer> {
    const url = `${API_URL}/customers/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch customer with id: " +id);
    return await res.json();
}

export async function updateCustomer(customer: Customer): Promise<Response> {
    const url = `${API_URL}/customers/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return await res.json();
}

export async function deleteCustomer(customer: Customer): Promise<Response> {
    const url = `${API_URL}/customers/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return await res.json();
}