import {
    Box,
    Button,
    Stack,
    Paper,
    Grid,
    Typography,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import type {Customer, SelectedProduct, Supplier} from "../../../types/Types.ts";
import { addOrder } from "../../../services/orderService.ts";
import useOrderFormValidation from "../../../hooks/useOrderFormValidation.ts";
import ProductsTableInsert from "./ProductsTableInsert.tsx";
import {useCustomerSearch} from "../../../hooks/useCustomerSearch.ts";
import {AppAutocomplete} from "../../ui/AppAutocomplete.tsx";
import LabeledField from "../../ui/LabeledField.tsx";
import OMSLabel from "../../ui/OMSLabel.tsx";
import OMSSelect from "../../ui/OMSSelect.tsx";
import * as React from "react";
import {useSupplierSearch} from "../../../hooks/useSupplierSearch.ts";

interface FormOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FormOrder = ({
                       setSubmitted,
                       setSuccess,
                       setPopUpMessage,
                   }: FormOrderProps) => {

    const [selectValue, setSelectValue] = React.useState("orderCustomer");

    const [inputValue, setInputValue] = useState("");

    const { customers, loading: customersLoading } = useCustomerSearch(inputValue);
    const { suppliers, loading: suppliersLoading } = useSupplierSearch(inputValue);

    const [selectedProductsWithQty, setSelectedProductsWithQty] =
        useState<SelectedProduct[]>(() => {
            const saved = localStorage.getItem("selectedProductsWithQty");
            return saved ? JSON.parse(saved) : [];
        });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).selectedCustomer : null;
    });
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).selectedCustomer : null;
    });

    const [address, setAddress] = useState<string>(() => {
        const saved = localStorage.getItem("orderDraft");
        return saved ? JSON.parse(saved).address : "";
    });

    useEffect(() => {
        localStorage.setItem(
            "orderDraft",
            JSON.stringify({
                selectedCustomer,
                address,
            })
        );
    }, [selectedCustomer, address]);

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
        address
    });

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPopUpMessage("");

        if (validateOrderForm()) {
            addOrder({
                products: selectedProductsWithQty,
                customer: selectedCustomer,
                address
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
        setOrderErrors({});
        setPopUpMessage("");
        setSubmitted(false);
    };

    useEffect(() => {
        setPopUpMessage("");
    }, []);

    const renderCustomersFields = () => {
        if (selectValue === "orderCustomer") {
            return (
                <>
                    {/* CUSTOMER */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <OMSLabel
                                required
                                label="Customer"
                            />
                            <Box sx={{ flex: 1 }}>
                                <AppAutocomplete<Customer>
                                    options={customers}
                                    value={selectedCustomer}
                                    inputValue={inputValue}
                                    loading={customersLoading}
                                    placeholder="Search customer..."
                                    getOptionLabel={(c) => `${c.name} ${c.lastName} #${c.id}`}
                                    onChange={setSelectedCustomer}
                                    onInputChange={setInputValue}
                                    helperText={orderErrors?.customer}
                                    error={Boolean(orderErrors?.customer)}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    {/* ADDRESS */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={Boolean(orderErrors?.address)}
                            helperText={orderErrors?.address ?? " "}
                            required
                        />
                    </Grid>
                </>
            )
        }
    }

    const renderSuppliersFields = () => {
        if (selectValue === "orderSupplier") {
            return (
                <>
                    {/* SUPPLIER */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <OMSLabel
                                required
                                label="Supplier"
                            />
                            <Box sx={{ flex: 1 }}>
                                <AppAutocomplete<Supplier>
                                    options={suppliers}
                                    value={selectedSupplier}
                                    inputValue={inputValue}
                                    loading={suppliersLoading}
                                    placeholder="Search supplier..."
                                    getOptionLabel={(c) => `${c.name} #${c.id}`}
                                    onChange={setSelectedSupplier}
                                    onInputChange={setInputValue}
                                    helperText={orderErrors?.customer}
                                    error={Boolean(orderErrors?.customer)}
                                />
                            </Box>
                        </Stack>
                    </Grid>
                </>
            )
        }
    }


    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 2,
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

                    {/* TYPE OF ORDER */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <OMSLabel
                                required
                                label="Type of order"
                            />
                            <OMSSelect
                                selectValue={selectValue}
                                setSelectValue={setSelectValue}
                            />

                        </Stack>
                    </Grid>

                    <Grid
                        size={{ xs: 12 }}
                        sx={{
                            minHeight: 110,
                        }}
                    >
                        {renderCustomersFields()}
                        {renderSuppliersFields()}
                    </Grid>

                    {/* TABLE */}
                    <Grid size={{ xs: 12 }}>
                        <ProductsTableInsert
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