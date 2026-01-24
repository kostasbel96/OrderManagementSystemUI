export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
}

export interface Customer {
    id: number | undefined;
    name: string;
    lastName: string;
    phoneNumber1: string;
    phoneNumber2: string | undefined | null;
    email: string;
}

export interface OrderItem {
    id?: number;
    products: SelectedProduct[];
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
    quantity: number | string;
    address: string;
    date?: string;
}

