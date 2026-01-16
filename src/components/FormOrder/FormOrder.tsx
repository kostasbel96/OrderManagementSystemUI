import {
    Box,
    Button,
    TextField,
    Divider,
    Stack,
} from "@mui/material";
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
            <Box
                component="form"
                onSubmit={handleOnSubmit}
                onReset={handleOnReset}
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <MySelect
                    myValue="Products"
                    isMultiValue={true}
                    products={products}
                    selectedProductsWithQty={selectedProductsWithQty}
                    setSelectedProductsWithQty={setSelectedProductsWithQty}
                />

                <MySelect
                    myValue="Customers"
                    isMultiValue={false}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                />

                <Divider sx={{ width: 300 }} />

                <TextField className="rounded"
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ width: 250,
                          backgroundColor: "white",
                          color: "black",
                        '& .MuiInputLabel-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px"
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'gray',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px",
                        }

                    }}

                />

                <Stack direction="row" spacing={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Create
                    </Button>

                    <Button
                        type="reset"
                        variant="contained"
                        color="error"
                    >
                        Reset
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

export default FormOrder;