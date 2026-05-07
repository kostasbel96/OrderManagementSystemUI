import {Box, Button, Grid, Paper, Stack} from "@mui/material";
import OMSLabel from "../ui/OMSLabel.tsx";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";
import type {Customer} from "../../types/Types.ts";
import LabeledField from "../ui/LabeledField.tsx";
import {type FormEvent, useEffect, useState} from "react";
import {useCustomerSearch} from "../../hooks/useCustomerSearch.ts";
import useReceiptFormValidation from "../../hooks/useReceiptFormValidation.ts";
import {addReceipt} from "../../services/receiptService.ts";
import OrdersView from "../orders/OrdersView.tsx";
import type {GridRowSelectionModel} from "@mui/x-data-grid";

interface FormReceiptProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FormReceipt = ({setSubmitted, setSuccess, setPopUpMessage}: FormReceiptProps) => {
    const [inputValue, setInputValue] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });

    const { customers, loading } = useCustomerSearch(inputValue);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [notes, setNotes] = useState("");
    const [amount, setAmount] = useState("");
    const [showOrders, setShowOrders] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectionModel, setSelectionModel] =
        useState<GridRowSelectionModel>({
            type: "include",
            ids: new Set(),
        });

    const filters={ items: [{ field: "paymentStatus", operator: "not", id: 18617, value: "PAID" }] };

    const {
        validateReceiptForm,
        receiptErrors,
        setReceiptErrors
    } = useReceiptFormValidation({
        customer: selectedCustomer,
        amount
    });

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPopUpMessage("");

        if (validateReceiptForm()) {
            addReceipt({
                amount,
                customer: selectedCustomer,
                notes,
                orderIds: selectionModel.ids.size ? Array.from(selectionModel.ids).map(Number) : null
            })
                .then((data) => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage("Receipt created successfully");
                    console.log(data);
                })
                .catch((error) => {
                    setPopUpMessage(error.message);
                    setSubmitted(true);
                    setSuccess(false);
                });
            setAmount("");
            setSelectedCustomer(null);
            setNotes("");
        } else {
            setSubmitted(true);
            setSuccess(false);
        }
    };

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSelectedCustomer(null);
        setNotes("");
        setAmount("");
        setPopUpMessage("");
        setSubmitted(false);
        setReceiptErrors({});
    };

    useEffect(() => {
        setPopUpMessage("");
    }, []);

    useEffect(() => {
        setSearchTerm(String(selectedCustomer?.id));
    }, [selectedCustomer]);

    return (
        <Paper
            elevation={6}
            sx={{
                p: 3,
                borderRadius: 2,
                width: "100%",
                margin: "0 auto",
                minHeight: "79vh",
                backgroundColor: "#fafafa",
            }}
        >
            <Box component="form" onSubmit={handleOnSubmit} onReset={handleOnReset}>
                <Grid container spacing={1.5}>

                    {/* HEADER */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                            Create Receipt
                        </Box>
                    </Grid>

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
                                    loading={loading}
                                    placeholder="Search customer..."
                                    getOptionLabel={(c) => `${c.name} ${c.lastName} #${c.id}`}
                                    onChange={setSelectedCustomer}
                                    onInputChange={setInputValue}
                                    helperText={receiptErrors?.customer}
                                    error={Boolean(receiptErrors?.customer)}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    {/* NOTES */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>

                    {/* AMOUNT */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            required
                            label="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            error={Boolean(receiptErrors?.amount)}
                            helperText={receiptErrors?.amount || " "}
                        />
                    </Grid>

                    {/* LINK TO ORDER */}
                    <Grid size={{xs: 12}}>
                        <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                            <OMSLabel label="Link to Order" />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowOrders(!showOrders)}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: 12,
                                    height: 32,
                                    borderRadius: "0 8px 8px 0", // ✅ εδώ σωστά
                                    alignItems: "center",
                                }}
                            >
                                {showOrders ? 'Hide Orders' : 'Select Order'}
                            </Button>
                        </Box>
                    </Grid>

                    {/* ORDERS - Show only if button clicked */}
                    {showOrders && (
                        <Grid size={{xs: 12}}>
                            <OrdersView
                                showSearchBar={false}
                                selection={true}
                                width={200}
                                height={"36vh"}
                                searchTerm={searchTerm}
                                columnVisibility={columnVisibility}
                                setColumnVisibility={setColumnVisibility}
                                selectionModel={selectionModel}
                                setSelectionModel={setSelectionModel}
                                filters={filters}
                            />
                        </Grid>
                    )}

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

}

export default FormReceipt;