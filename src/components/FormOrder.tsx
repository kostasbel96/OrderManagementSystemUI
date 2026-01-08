import {Button, Form} from "react-bootstrap";
import Select from "react-select";
import {useState} from "react";

interface Product {
    id: number;
    name: string;
}
interface Customer {
    id: number;
    name: string;
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const FormOrder = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);

    const products: Product[] = [
        { id: 1, name: "iPhone 15" },
        { id: 2, name: "Samsung Galaxy S24" },
        { id: 3, name: "MacBook Pro" },
        {id: 4, name: "Laptop1" },
        { id: 5, name: "iPhone1 15" },
        { id: 6, name: "Samsung1 Galaxy S24" },
        { id: 7, name: "MacBook1 Pro" },
        {id: 8, name: "Laptop1" },
    ];
    const customers: Customer[] = [
        { id: 1, name: "Mpamps" },
        { id: 2, name: "Souls" },
        { id: 3, name: "tasos" },
        {id: 4, name: "giorgos" },
    ];
    const productOptions = products.map((p) => ({
        value: p.id,
        label: p.name,
    }));
    const customersOptions = customers.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const handleQuantityChange = (index: number, quantity: number) => {
        setSelectedProductsWithQty((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], quantity };
            return copy;
        });
    };

    return (
        <>
            <Form className="p-5">
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">Products:</Form.Label><br/>
                    <Select className="text-black"
                        isMulti
                        options={productOptions}
                        value={selectedProductsWithQty.map((p) => ({
                            value: p.product.id,
                            label: p.product.name,
                        }))}
                        onChange={(selected) => {
                            const selectedArray = selected as { value: number; label: string }[];
                            setSelectedProductsWithQty(
                                selectedArray.map((s) => {
                                    const existing = selectedProductsWithQty.find((p) => p.product.id === s.value);
                                    return existing || { product: products.find((p) => p.id === s.value)!, quantity: 1 };
                                })
                            );
                        }}
                        placeholder="Select Products..."
                        styles={{ container: (base) => ({ ...base, width: 250 }) }}
                    />
                </Form.Group>
                {selectedProductsWithQty.map((item, index) => (
                    <Form.Group className="mb-3 flex justify-end" key={item.product.id}>
                        <Form.Label className="w-32 text-end me-3">{item.product.name}:</Form.Label>
                        <Form.Control
                            className="bg-white text-black px-2"
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            style={{ minWidth: "250px" }}
                        />
                    </Form.Group>
                ))}
                <div className="border-b-2 mb-5 mt-5"></div>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Customer:</Form.Label>
                    <Select className="text-black"
                            options={customersOptions}
                            value={
                                selectedCustomer
                                    ? { value: selectedCustomer.id, label: selectedCustomer.name }
                                    : null
                            }
                            onChange={(option) => {
                                if (option) {
                                    const customer = customers.find((p) => p.id === option.value);
                                    setSelectedCustomer(customer || null);
                                } else {
                                    setSelectedCustomer(null);
                                }
                            }}
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    width: 250,
                                }),
                            }}
                            placeholder="Search Customer..."
                    />
                </Form.Group>
                <div className="space-x-2 text-center ml-16">
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