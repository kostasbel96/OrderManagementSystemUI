import type {Dayjs} from "dayjs";

export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export interface StockItem {
    productName: string;
    quantity: number;
    pct: number;
}

export interface Customer extends Person {
    balance: number | undefined | null;
    email?: string;
}

export interface RouteDetails {
    id: number;
    name: string;
    notes: string;
    driver: Driver | null;
    stops: OrderRow[];
    date: Dayjs;
    status: string;
}

export interface Supplier {
    id: number | undefined | null;
    name: string;
    email?: string;
    phoneNumber1: string;
    phoneNumber2?: string;
    address?: string;
    vat: string;
    balance: number | undefined | null;
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
    purchaseOrderItem: PurchaseOrderItem;
    purchaseOrderItems: PurchaseOrderItem[];
    route: Route;
    supplier: Supplier;
    driver: Driver;
    routes: Route[];
    receipt: Receipt;
    payment: Payment;
    errorResponse: ErrorResponse;
    customer: Customer;
}

export interface Receipt {
    id: number;
    amount: number | string;
    customer: Customer;
    notes: string;
    date: string | Date | Dayjs;
}

export interface Payment {
    id: number;
    amount: number | string;
    supplier: Supplier;
    notes: string;
    date: string | Date | Dayjs;
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
    status: string;
    total?: string;
    paidAmount?: string;
    paymentStatus?: string;
}

export interface PurchaseOrderItem {
    id: number;
    items: SelectedProduct[];
    supplier?: Supplier;
    date: string;
    status: string;
    total?: string;
    paidAmount?: string;
    paymentStatus?: string;
}

export interface SelectedProduct {
    id?: number;
    product?: Product;
    quantity: number;
    price: number;
    priceInput?: string;
}

export interface ReceiptRequest {
    customerId: number | null;
    orderIds: number[] | null;
    notes: string;
    amount: string;
}

export interface PaymentRequest {
    supplierId: number | null;
    orderIds: number[] | null;
    notes: string;
    amount: string;
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
    name: string;
    date?: string | Date | Dayjs;
    orders: OrderItem[];
    driver: Driver | null;
    notes: string;
    status: string;
}

export interface OrderRow {
    id: number;
    customer?: Customer;
    supplier?: Supplier;
    products: SelectedProduct[];
    address?: string;
    status: string;
    total: number;
    paidAmount?: number;
    paymentStatus?: string;
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

export interface PurchaseOrderItemResponseDto {
    content: PurchaseOrderItem[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface RouteResponseDto {
    content: Route[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface ReceiptResponseDto {
    content: Receipt[];
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface PaymentResponseDto {
    content: Payment[];
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

export interface SupplierResponseDto {
    content: Supplier[];
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
    rows: (Product | Customer | OrderRow | Route | Driver)[];
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

export interface PurchaseOrderRequest {
    supplierId: number | undefined | null;
    items: Item[];
}

export interface RouteRequest{
    notes: string;
    name: string;
    driverId: number | undefined | null;
    orderIds: number[];
    date: string;
}