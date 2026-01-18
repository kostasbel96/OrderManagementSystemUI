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

