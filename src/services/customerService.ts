import type {Customer} from "../types/Types.ts";

export let customers: Customer[] = [
    { id: 1, name: "Mpamps", lastName: "test", email: "test@te.gr", phoneNumber1: "6948675678", phoneNumber2: "6948675678"},
    { id: 2, name: "Souls", lastName: "test", email: "test@te.gr", phoneNumber1: "6948675678", phoneNumber2: "6948675678" },
    { id: 3, name: "tasos", lastName: "test", email: "test@te.gr", phoneNumber1: "6948675678", phoneNumber2: "6948675678" },
    {id: 4, name: "giorgos", lastName: "test", email: "test@te.gr", phoneNumber1: "6948675678", phoneNumber2: "6948675678" },
];

export const addCustomer = (newCustomer: Customer): void => {
    const customerToAdd: Customer = {
        ...newCustomer, id: new Date().getTime()
    }
    console.log(customerToAdd);

    customers = [...customers, customerToAdd];
}

export const getCustomers = (limit: number = 0) => {
    if (limit) return customers.slice(0, limit);
    return  customers;
}

export const searchCustomer = (name: string)=>{
    return customers.filter(customer => (`${customer.name} ${customer.lastName}`.toLowerCase().includes(name.toLowerCase())));
}