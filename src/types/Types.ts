export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
}

export interface Customer {
    id: number | undefined | null;
    name: string;
    lastName: string;
    phoneNumber1: string;
    phoneNumber2: string | undefined | null;
    email?: string;
}

export interface OrderItem {
    id?: number;
    items: SelectedProduct[];
    customer: Customer | null;
    address: string;
    date: string;
}

export interface SelectedProduct {
    product: Product;
    quantity: number;
}

export interface OrderRow {
    id?: number;
    customer: string;
    products: string;
    quantity: string;
    address: string;
    date?: string;
}

export interface ProductResponseDto {
    content: Product[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface OrderResponseDto {
    content: OrderItem[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface CustomerResponseDto {
    content: Customer[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface TableRowsType {
    rows: (Product | Customer | OrderRow)[];
}

export interface Item{
    productId: number;
    quantity: number;
}

export interface OrderRequest{
    address: string;
    customerId: number | undefined | null;
    items: Item[];
}