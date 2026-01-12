import {Form} from "react-bootstrap";
import Select, {type MultiValue, type SingleValue} from "react-select";
import {useState} from "react";
import type {Customer, Product} from "../../types/Types.ts";

interface SelectProps {
    myValue: string;
    isMultiValue: boolean;
    products: Product[];
    customers: Customer[];
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const MySelect = ({myValue, isMultiValue, products, customers} : SelectProps) => {
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const productOptions = products.map((p) => ({
        value: p.id,
        label: p.name,
    }));
    const customersOptions = customers.map((p) => ({
        value: p.id,
        label: `${p.name} ${p.lastName}`,
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
            <Form.Group className="mb-3 flex justify-center" controlId="control">
                <Form.Label className="p-2">{isMultiValue ? myValue : myValue.slice(0, -1)}:</Form.Label><br/>
                <Select className="text-black"
                        placeholder={`Select ${myValue === "Products" ? myValue : myValue.slice(0, -1)}...`}
                        isMulti={isMultiValue}
                        options={myValue === "Products" ? productOptions : customersOptions}
                        value={myValue === "Products"
                            ? selectedProductsWithQty.map(p => ({
                                value: p.product.id,
                                label: p.product.name,
                            }))
                            : myValue === "Customers" && selectedCustomer
                                ? [{
                                    value: selectedCustomer.id,
                                    label: `${selectedCustomer.name} ${selectedCustomer.lastName}`,
                                }]
                                : []}
                        onChange={(selected: SingleValue<any> | MultiValue<any>) => {
                            if (myValue === "Products") {
                                const selectedArray = selected as { value: number; label: string }[];
                                setSelectedProductsWithQty(
                                    selectedArray.map((s) => {
                                        const existing = selectedProductsWithQty.find((p) => p.product.id === s.value);
                                        return existing || { product: products.find((p) => p.id === s.value)!, quantity: 1 };
                                    })
                                );
                            } else {
                                if (selected) {
                                    const customer = customers.find((p) => p.id === selected.value);
                                    setSelectedCustomer(customer || null);
                                } else {
                                    setSelectedCustomer(null);
                                }
                            }
                        }}
                        styles={{ container: (base) => ({ ...base, width: 200 }) }}
                />
            </Form.Group>
                {(myValue === "Products") && selectedProductsWithQty.map((item, index) => (
                    <Form.Group className="mb-3 flex justify-center" key={item.product.id}>
                        <Form.Label className="w-24 text-center me-3">{item.product.name}:</Form.Label>
                        <Form.Control
                            className="bg-white text-black px-2"
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            style={{ width: "100px" }}
                        />
                    </Form.Group>
                ))}
        </>
    )
}

export default MySelect;
