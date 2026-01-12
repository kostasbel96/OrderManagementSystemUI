import {Button, Form} from "react-bootstrap";
import MySelect from "./MySelect.tsx";
import {useEffect, useState} from "react";
import type {Customer, Product} from "../../types/Types.ts";
import {customers as customersList} from "../../services/customerService.ts"
import {products as productsList} from "../../services/productService.ts"

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const FormOrder = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null >(null);

    useEffect(() => {
        setCustomers(customersList);
        setProducts(productsList);
    },[]);


    return (
        <>
            <Form className="p-5 flex flex-col items-center">
                <MySelect
                    myValue="Products"
                    isMultiValue={true}
                    products={products}
                    selectedProductsWithQty={selectedProductsWithQty}
                    setSelectedProductsWithQty={setSelectedProductsWithQty}
                ></MySelect>
                <div className="border-b-2 mb-3 w-80"></div>
                <MySelect
                    myValue="Customers"
                    isMultiValue={false}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                ></MySelect>
                <div className="space-x-2 text-center">
                    <Button className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer">
                        Create
                    </Button>
                    <Button className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer">
                        Reset
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default FormOrder;