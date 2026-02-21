import {
    Box,
    Button,
    TextField,
    Divider,
    Stack,
} from "@mui/material";
import MySelect from "./MySelect.tsx";
import {type FormEvent, useEffect, useState} from "react";
import type {Customer, Product, SelectedProduct} from "../../types/Types.ts";
import {addOrder} from '../../services/orderService.ts'
import {getCustomers} from "../../services/customerService.ts";
import {getProducts} from "../../services/productService.ts";
import useOrderFormValidation from "../../hooks/useOrderFormValidation.ts";

interface FormOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormOrder = ({setSubmitted, setSuccess}: FormOrderProps) => {
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null >(null);
    const [address, setAddress] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const {validateOrderForm, orderErrors, setOrderErrors} = useOrderFormValidation({selectedProductsWithQty, selectedCustomer, address});



    const handleOnSubmit = ((e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateOrderForm()) {
            console.log(selectedProductsWithQty);
            addOrder(
                {
                    products:selectedProductsWithQty,
                    customer:selectedCustomer,
                    address:address
                }
            ).then((data) => {
                setSuccess(true);
                setSubmitted(true);
                console.log(data);
            }).catch(()=>{
                    setSubmitted(true);
                    setSuccess(false);
                });
            setSelectedProductsWithQty([]);
            setSelectedCustomer(null);
            setAddress("");
        } else {
            setSubmitted(true);
            setSuccess(false);
        }
    })

    const handleOnReset = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSelectedProductsWithQty([]);
        setSelectedCustomer(null);
        setAddress("");
        setOrderErrors({});
        setSubmitted(false);
    }

    useEffect(() => {
        getCustomers(0, 100)
            .then(data=>{
                setCustomers(data.content);
            });
        getProducts(0, 100)
            .then(data=>{
                setProducts(data.content);
            });
    },[])

    return (
            <Box
                component="form"
                onSubmit={handleOnSubmit}
                onReset={handleOnReset}
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <MySelect
                    myValue="Products"
                    isMultiValue={true}
                    products={products}
                    selectedProductsWithQty={selectedProductsWithQty}
                    setSelectedProductsWithQty={setSelectedProductsWithQty}
                />
                {orderErrors && (<p className="text-sm text-red-900">{orderErrors.products || orderErrors.quantity}</p>)}

                <MySelect
                    myValue="Customers"
                    isMultiValue={false}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                />
                {orderErrors && (<p className="text-sm text-red-900">{orderErrors.customer}</p>)}

                <Divider sx={{ width: 300 }} />

                <TextField
                    className="rounded"
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
                {orderErrors && (<p className="text-sm text-red-900">{orderErrors.address}</p>)}

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
    );
}

export default FormOrder;