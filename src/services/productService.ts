import type {Product} from "../types/Types.ts";

export let products: Product[];
products = [
    { id: 1, name: "iPhone 15", description: "test", quantity: 19},
    { id: 2, name: "Samsung Galaxy S24", description: "test", quantity: 19 },
    { id: 3, name: "MacBook Pro", description: "test", quantity: 19 },
    {id: 4, name: "Laptop", description: "test", quantity: 19 },
    { id: 5, name: "iPhone1 15", description: "test", quantity: 19 },
    { id: 6, name: "Samsung1 Galaxy S24", description: "test", quantity: 19 },
    { id: 7, name: "MacBook1 Pro", description: "test", quantity: 19 },
    {id: 8, name: "Laptop1", description: "test", quantity: 19 },
]
export const addProduct = (newProduct: Product): void => {
    const productToAdd: Product = {
        ...newProduct, id: new Date().getMilliseconds()
    }
    console.log(productToAdd);

    products = [...products, productToAdd];
}