import {Button, Form} from "react-bootstrap";
import MySelect from "./MySelect.tsx";
import {type FormEvent, useEffect, useState} from "react";
import type {Customer, Product} from "../../types/Types.ts";
import {customers} from "../../services/customerService.ts"
import {products} from "../../services/productService.ts"

interface FormOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

interface OrderItem {
    products: SelectedProduct[];
    customer: Customer | null;
    address: string;
}

const FormOrder = ({setSubmitted, setSuccess}: FormOrderProps) => {
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null >(null);
    const [address, setAddress] = useState("");
    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);

    const validQuantity = (): boolean => {
        const p = selectedProductsWithQty.
            find(p => p.quantity <=  p.product.quantity)
        return !!p;

    }

    const handleOnSubmit = ((e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validQuantity()){
            setOrderItem((prev: OrderItem[]) => {
                return [
                    ...prev,
                    {
                        products: [...selectedProductsWithQty],
                        customer: selectedCustomer,
                        address: address
                    }
                ]
            });
            setSelectedProductsWithQty([]);
            setSelectedCustomer(null);
            setAddress("");
            setSubmitted(true);
            setSuccess(true);
        } else {
            console.log("Not enough quantity selected");
            setSubmitted(true);
            setSuccess(false);
        }
    })

    useEffect(() => {
        console.log(orderItem);
    },[orderItem]);

    const handleOnReset = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSelectedProductsWithQty([]);
        setSelectedCustomer(null);
        setAddress("");

    }

    return (
        <>
            <Form
                className="p-5 flex flex-col items-center"
                onSubmit={(e) => {handleOnSubmit(e)}}
                onReset={(e) => {handleOnReset(e)}}
            >
                <MySelect
                    myValue="Products"
                    isMultiValue={true}
                    products={products}
                    selectedProductsWithQty={selectedProductsWithQty}
                    setSelectedProductsWithQty={setSelectedProductsWithQty}
                ></MySelect>
                <MySelect
                    myValue="Customers"
                    isMultiValue={false}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                ></MySelect>
                <div className="border-b-2 mb-3 w-80"></div>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Address:</Form.Label>
                    <Form.Control
                        type="text"
                        value={address}
                        placeholder="Address"
                        className="p-2 bg-white text-black focus:outline-none rounded w-50 ml-2"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                <div className="space-x-2 text-center">
                    <Button
                        className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer"
                        type="submit"
                    >
                        Create
                    </Button>
                    <Button
                        className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer"
                        type="reset"
                    >
                        Reset
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default FormOrder;