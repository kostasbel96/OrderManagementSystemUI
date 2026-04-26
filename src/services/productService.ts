import type {Product, ProductResponseDto, ResponseDTO, SearchRequest} from "../types/Types.ts";

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

const API_URL = import.meta.env.VITE_API_URL;

export async function addProduct(newProduct: Omit<Product, "id">): Promise<ResponseDTO> {
    const res = await fetch(`${API_URL}/products/save`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });
    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        const errorMessage = data?.errorResponse?.message || "Failed to create product";
        throw new Error(errorMessage);
    }

    return data?.productDto;
}

export async function searchProducts(request: SearchRequest): Promise<ProductResponseDto> {

    const res = await fetch(`${API_URL}/products/search`, {
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

    if (!res.ok) throw new Error("Failed to search products");

    const data = await res.json();

    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export async function getProducts(page: number = 0, pageSize: number = 10, sortBy: string = "name", sortDirection: string = "desc"): Promise<ProductResponseDto> {
    const url = `${API_URL}/products?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`

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

export async function updateProduct(product: Product): Promise<ResponseDTO> {
    const url = `${API_URL}/products/update`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
}

export async function deleteProduct(product: Product): Promise<ResponseDTO> {
    const url = `${API_URL}/products/delete`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return await res.json();
}