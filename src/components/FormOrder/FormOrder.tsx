import {
    Box,
    Button,
    TextField,
    Divider,
    Stack,
} from "@mui/material";
import MySelect from "./MySelect.tsx";
import {type FormEvent, useState} from "react";
import type {Customer, SelectedProduct} from "../../types/Types.ts";
import {customers} from "../../services/customerService.ts"
import {products} from "../../services/productService.ts"
import {addOrder} from '../../services/OrderService.ts'
import {z} from "zod";

interface FormOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number(),
});

const selectedProductSchema = z.object({
    product: productSchema,
    quantity: z
        .number()
        .min(1, "Quantity must be at least 1")
});

const orderSchema = z.object({
    customer: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: "You must select a customer",
        }),

    products: z
        .array(selectedProductSchema)
        .min(1, "You must select at least 1 product"),

    address: z
        .string()
        .min(2, "Address is required"),
})

type FormErrors = {
    products?: string;
    customer?: string;
    address?: string;
    quantity?: string;
}

const FormOrder = ({setSubmitted, setSuccess}: FormOrderProps) => {
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null >(null);
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState<FormErrors>({})

    const validQuantity = (): boolean => {
        return selectedProductsWithQty.every(
            p => p.quantity <= p.product.quantity
        );
    }

    const isValid = (): boolean => {

        const result = orderSchema.safeParse({
            customer: selectedCustomer,
            products: selectedProductsWithQty,
            address: address
        });

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormErrors;
                newErrors[fieldName] = error.message;
            })
            setErrors(newErrors);
            return false;
        }
        if (!validQuantity()) {
            setErrors({
                quantity: "Quantity in stock is less than you requested."
            });
            return false;
        }
        setErrors({})
        return true;
    }

    const handleOnSubmit = ((e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid()) {
            console.log(selectedProductsWithQty);
            addOrder({products:selectedProductsWithQty, customer:selectedCustomer, address:address});
            decreaseQuantityOfProduct();
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

    const decreaseQuantityOfProduct = () => {
        products.map(p=> {
            const product = selectedProductsWithQty.find(pr => {
                return pr.product.id === p.id;
            });
            return product ? p.quantity -= product.quantity : p;
        });
    }

    const handleOnReset = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSelectedProductsWithQty([]);
        setSelectedCustomer(null);
        setAddress("");
        setErrors({});
        setSubmitted(false);
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
                    gap: 2,
                }}
            >
                <MySelect
                    myValue="Products"
                    isMultiValue={true}
                    selectedProductsWithQty={selectedProductsWithQty}
                    setSelectedProductsWithQty={setSelectedProductsWithQty}
                />
                {errors && (<p className="text-sm text-red-900">{errors.products || errors.quantity}</p>)}

                <MySelect
                    myValue="Customers"
                    isMultiValue={false}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                />
                {errors && (<p className="text-sm text-red-900">{errors.customer}</p>)}

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
                {errors && (<p className="text-sm text-red-900">{errors.address}</p>)}

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