import type {Product, ProductResponseDto} from "../types/Types.ts";

export let products: Product[];
// products = [
//     { id: 1, name: "iPhone 15", description: "test", quantity: 1},
//     { id: 2, name: "Samsung Galaxy S24", description: "test", quantity: 19 },
//     { id: 3, name: "MacBook Pro", description: "test", quantity: 19 },
//     {id: 4, name: "Laptop", description: "test", quantity: 19 },
//     { id: 5, name: "iPhone1 15", description: "test", quantity: 19 },
//     { id: 6, name: "Samsung1 Galaxy S24", description: "test", quantity: 19 },
//     { id: 7, name: "MacBook1 Pro", description: "test", quantity: 19 },
//     {id: 8, name: "Laptop1", description: "test", quantity: 19 },
// ]

const API_URL = "http://localhost:8080/api";

export async function addProduct(newProduct: Omit<Product, "id">): Promise<Product> {
    const res = await fetch(`${API_URL}/products/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return await res.json();
}

export async function searchProductByName(name: string) :Promise<Product[]> {
    const res = await fetch(`${API_URL}/products/search?name=${name}`);
    if (!res.ok) throw new Error("Failed to search product");
    return await res.json();
}

export async function getProducts(page: number = 0, pageSize: number = 5): Promise<ProductResponseDto> {
    const url = `${API_URL}/products?page=${page}&size=${pageSize}`

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch products.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function getProductByName(name: string): Promise<Product> {
    const url = `${API_URL}/products/${name}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch product with name: " + name);
    return await res.json();
}