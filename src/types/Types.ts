export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Customer extends Person {
    balance: number | undefined | null;
    email?: string;
}

export interface RouteDetails {
    name: string;
    notes: string;
    driver: Driver | null;
    stops: OrderRow[];
}

interface Person {
    id: number | undefined | null;
    name: string;
    lastName: string;
    phoneNumber1: string;
    phoneNumber2?: string;
}

export interface Driver extends Person{}

export interface ResponseDTO {
    orderItems: OrderItem[];
    orderItem: OrderItem;
    productDto: Product;
    driver: Driver;
    errorResponse: ErrorResponse;
    customer: Customer;
}

export interface ErrorResponse{
    message: string;
}

export interface OrderItem {
    id: number;
    items: SelectedProduct[];
    customer?: Customer;
    address: string;
    date: string;
    total?: string;
}

export interface SelectedProduct {
    id?: number;
    product?: Product;
    quantity: number;
    price: number;
}

export interface SearchRequest {
    page: number;
    pageSize: number;
    globalSearch?: string;
    filters?: any[];
    sortBy?: string;
    sortDirection?: string;
}

export interface Route {
    id: number;
    orders: OrderItem[];
    driver: Driver;
    notes: string;
    routeName: string;
}

export interface OrderRow {
    id: number;
    customer?: Customer;
    products: SelectedProduct[];
    address: string;
    total: number;
    date?: string | Date;
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


export interface DriverResponseDto {
    content: Driver[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface TableRowsType {
    rows: (Product | Customer | OrderRow)[];
}

export interface Item{
    productId?: number;
    quantity: number;
    price: string;
}

export interface OrderRequest{
    address: string;
    customerId: number | undefined | null;
    items: Item[];
}