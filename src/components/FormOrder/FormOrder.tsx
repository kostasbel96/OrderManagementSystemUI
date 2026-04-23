import {
    Box,
    Button,
    TextField,
    Stack,
    Paper,
    Grid,
    Typography,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import type {Customer, SelectedProduct} from "../../types/Types.ts";
import { addOrder } from "../../services/orderService.ts";
import useOrderFormValidation from "../../hooks/useOrderFormValidation.ts";
import CustomersAutocomplete from "./CustomersAutocomplete.tsx";
import ProductsTableInsert from "./ProductsTableInsert.tsx";

interface FormOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FormOrder = ({
                       setSubmitted,
                       setSuccess,
                       setPopUpMessage
                   }: FormOrderProps) => {

    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [address, setAddress] = useState("");
    const [deposit, setDeposit] = useState<string>("");

    const {
        validateOrderForm,
        orderErrors,
        setOrderErrors
    } = useOrderFormValidation({
        selectedProductsWithQty,
        selectedCustomer,
        address,
        deposit
    });

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateOrderForm()) {
            addOrder({
                products: selectedProductsWithQty,
                customer: selectedCustomer,
                address,
                deposit
            })
                .then((data) => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage("Order created successfully");
                    console.log(data);
                })
                .catch((error) => {
                    setPopUpMessage(error.message);
                    setSubmitted(true);
                    setSuccess(false);
                });

            setSelectedProductsWithQty([]);
            setSelectedCustomer(null);
            setAddress("");
            setDeposit("");
        } else {
            setSubmitted(true);
            setSuccess(false);
        }
    };

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSelectedProductsWithQty([]);
        setSelectedCustomer(null);
        setAddress("");
        setDeposit("");
        setOrderErrors({});
        setSubmitted(false);
    };

    const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setDeposit(value.toString());
    };

    useEffect(() => {
        setPopUpMessage("");
    }, []);

    useEffect(() => {
        console.log(orderErrors);
    }, [orderErrors]);

    return (
        <Paper
            elevation={6}
            sx={{
                p: 3,
                borderRadius: 2,
                width: "100%",
                margin: "0 auto"
            }}
        >
            <Box component="form" onSubmit={handleOnSubmit} onReset={handleOnReset}>

                <Grid container spacing={2}>

                    {/* Title section */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 18, fontWeight: 600 }}>
                            Create Order
                        </Box>
                    </Grid>

                    {/* CUSTOMER */}
                    <Grid size={{ xs: 12 }}>
                        <CustomersAutocomplete
                            selectedCustomer={selectedCustomer}
                            setSelectedCustomer={setSelectedCustomer}
                        />
                        {orderErrors?.customer && (
                            <Typography color="error" fontSize={12}>
                                {orderErrors.customer}
                            </Typography>
                        )}
                    </Grid>

                    {/* ADDRESS */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={Boolean(orderErrors?.address)}
                            helperText={orderErrors?.address}
                        />
                    </Grid>

                    {/* DEPOSIT */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Deposit"
                            type="number"
                            value={deposit}
                            onChange={handleDepositChange}
                            error={Boolean(orderErrors?.deposit)}
                            helperText={orderErrors?.deposit}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Stack spacing={2}>
                            <ProductsTableInsert
                                selectedProductsWithQty={selectedProductsWithQty}
                                setSelectedProductsWithQty={setSelectedProductsWithQty}
                            />
                        </Stack>
                        {orderErrors && (
                            <Typography color="error" fontSize={12}>
                                {orderErrors.products || orderErrors.productQuantity
                                    || orderErrors.productPrice || orderErrors.stockError}
                            </Typography>
                        )}
                    </Grid>

                    {/* BUTTONS */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button type="reset" variant="outlined" color="error">
                                Reset
                            </Button>

                            <Button type="submit" variant="contained">
                                Create
                            </Button>
                        </Stack>
                    </Grid>

                </Grid>
            </Box>
        </Paper>
    );
};

export default FormOrder;