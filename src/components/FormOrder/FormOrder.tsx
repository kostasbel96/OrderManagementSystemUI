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
import ProductsTableInsert from "./ProductsTableInsert.tsx";
import {useCustomerSearch} from "../../hooks/useCustomerSearch.ts";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";

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

    const [inputValue, setInputValue] = useState("");

    const { customers, loading } = useCustomerSearch(inputValue);

    const [selectedProductsWithQty, setSelectedProductsWithQty] =
        useState<SelectedProduct[]>(() => {
            const saved = localStorage.getItem("selectedProductsWithQty");
            return saved ? JSON.parse(saved) : [];
        });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).selectedCustomer : null;
    });

    const [address, setAddress] = useState<string>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).address : "";
    });

    const [deposit, setDeposit] = useState<string>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).deposit : "";
    });

    useEffect(() => {
        localStorage.setItem(
            "orderDraft",
            JSON.stringify({
                selectedCustomer,
                address,
                deposit,
            })
        );
    }, [selectedCustomer, address, deposit]);

    useEffect(() => {
        localStorage.setItem(
            "selectedProductsWithQty",
            JSON.stringify(selectedProductsWithQty)
        );
    }, [selectedProductsWithQty]);

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
        setPopUpMessage("");

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
        setPopUpMessage("");
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

    const labelSx = {
        width: "auto",
        padding: "6px",
        border: "1px solid #bdbdbd",
        borderRadius: "8px 0px 0px 8px",
        height: "100%",
        fontSize: 12,
        textAlign: "right",
        bgcolor: "#f5f5f5",
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 1,
                width: "100%",
                minHeight: "79vh",
                mx: "auto",
                backgroundColor: "#fafafa",
            }}
        >
            <Box component="form" onSubmit={handleOnSubmit} onReset={handleOnReset}>
                <Grid container spacing={1.5}>

                    {/* HEADER */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                            Create Order
                        </Box>
                    </Grid>

                    {/* CUSTOMER */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <Box sx={labelSx}>
                                Customer<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <AppAutocomplete<Customer>
                                    options={customers}
                                    value={selectedCustomer}
                                    inputValue={inputValue}
                                    loading={loading}
                                    placeholder="Search customer..."
                                    getOptionLabel={(c) => `${c.name} ${c.lastName}`}
                                    onChange={setSelectedCustomer}
                                    onInputChange={setInputValue}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    {/* ADDRESS */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack
                            direction="row"
                            alignItems="stretch"
                            spacing={0}
                        >
                            <Box sx={labelSx}>
                                Address<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>
                            </Box>

                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={Boolean(orderErrors?.address)}
                                helperText={orderErrors?.address ?? " "}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        height: 32,
                                        borderRadius: "0 8px 8px 0", // ✅ εδώ σωστά

                                        "& fieldset": {
                                            borderColor: "#e0e0e0",
                                        },

                                        "&:hover fieldset": {
                                            borderColor: "#bdbdbd",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                        },
                                    },
                                }}
                            />
                        </Stack>
                    </Grid>

                    {/* DEPOSIT */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <Box sx={labelSx}>
                                Deposit
                            </Box>

                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="Enter deposit..."
                                value={deposit}
                                onChange={handleDepositChange}
                                error={Boolean(orderErrors?.deposit)}
                                helperText={orderErrors?.deposit ?? " "}
                                inputProps={{
                                    step: 0.01,
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        height: 32,
                                        borderRadius: "0 8px 8px 0",

                                        "& fieldset": {
                                            borderColor: "#e0e0e0",
                                        },

                                        "&:hover fieldset": {
                                            borderColor: "#bdbdbd",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                        },
                                    },
                                }}
                            />
                        </Stack>
                    </Grid>

                    {/* TABLE */}
                    <Grid size={{ xs: 12 }}>
                        <ProductsTableInsert
                            deposit={deposit}
                            selectedProductsWithQty={selectedProductsWithQty}
                            setSelectedProductsWithQty={setSelectedProductsWithQty}
                        />

                        <Box sx={{ minHeight: 18 }}>
                            {(orderErrors?.products ||
                                orderErrors?.productQuantity ||
                                orderErrors?.productPrice ||
                                orderErrors?.stockError) && (
                                <Typography color="error" fontSize={11}>
                                    {orderErrors.products ||
                                        orderErrors.productQuantity ||
                                        orderErrors.productPrice ||
                                        orderErrors.stockError}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* ACTIONS */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button type="reset" variant="outlined" color="error" size="small">
                                Reset
                            </Button>

                            <Button type="submit" variant="contained" size="small">
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