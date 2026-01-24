import type {Customer, OrderItem, SelectedProduct} from "../types/Types.ts";
interface OrderProps{
    products: SelectedProduct[];
    customer: Customer | null;
    address: string;
    date?: string;
}

export let orders: OrderItem[] = [];

export const addOrder = ({products, customer, address}: OrderProps) => {
    const newOrder: OrderItem = {
        id: new Date().getTime(),
        products,
        customer,
        address,
        date: new Date().toLocaleDateString()
    };

    orders = [...orders, newOrder];
};

export const getOrders = (limit: number = 0) => {
    if (limit) return orders.slice(0, limit);
    return  orders;
}

export const searchOrderByCustomerName = (name: string) => {
    return orders.filter(order => (`${order.customer?.name} ${order.customer?.lastName}`.toLowerCase().includes(name.toLowerCase())));

}