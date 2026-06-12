import type {Product, ProductResponseDto, ResponseDTO, SearchRequest} from "../types/Types.ts";
import {fetchWithAuth} from "../api/fetchWithAuth.ts";
import {useUIStore} from "../hooks/store/useUIStore.ts";



export async function addProduct(newProduct: Omit<Product, "id">): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const res = await fetchWithAuth(`${API_URL}/products/save`,{
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
    const { url } = useUIStore.getState();
    const API_URL = url;

    const res = await fetchWithAuth(`${API_URL}/products/search`, {
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
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/products?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`

    const res = await fetchWithAuth(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch products.");
    const data = await res.json();
    return {content: data.content, totalElements: data.totalElements, pageNumber: page, pageSize: pageSize};
}

export async function getProductByName(name: string): Promise<Product> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/products/${name}`;
    const res = await fetchWithAuth(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch product with name: " + name);
    return await res.json();
}

export async function updateProduct(product: Product): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/products/update`;
    const res = await fetchWithAuth(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
}

export async function deleteProduct(product: Product): Promise<ResponseDTO> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const apiUrl = `${API_URL}/products/delete`;
    const res = await fetchWithAuth(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return await res.json();
}