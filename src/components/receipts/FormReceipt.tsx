import {Box, Button, Grid, Paper, Stack} from "@mui/material";
import OMSLabel from "../ui/OMSLabel.tsx";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";
import type {Customer, Supplier} from "../../types/Types.ts";
import LabeledField from "../ui/LabeledField.tsx";
import {type FormEvent, useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import {useCustomerSearch} from "../../hooks/useCustomerSearch.ts";
import useReceiptFormValidation from "../../hooks/useReceiptFormValidation.ts";
import {addReceipt} from "../../services/receiptService.ts";
import OrdersView from "../orders/OrdersView.tsx";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import {useSupplierSearch} from "../../hooks/useSupplierSearch.ts";
import OMSSelect from "../ui/OMSSelect.tsx";
import * as React from "react";
import {addPayment} from "../../services/paymentService.ts";
import {useUIStore} from "../../hooks/store/useUIStore.ts";

interface FormReceiptProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FormReceipt = ({setSubmitted, setSuccess, setPopUpMessage}: FormReceiptProps) => {
    const { incrementRefreshKey } = useUIStore();
    const [selectValue, setSelectValue] = useState<string>("orderCustomer");
    const [inputValue, setInputValue] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });
    const { customers, loading: loadingCustomer } = useCustomerSearch(inputValue);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { suppliers, loading: loadingSupplier } = useSupplierSearch(inputValue);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
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
        person: selectValue === "orderCustomer" ? selectedCustomer : selectedSupplier,
        amount
    });
    const { t } = useTranslation();

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPopUpMessage("");

        if (validateReceiptForm()) {
            if (selectValue === "orderCustomer"){
                addReceipt({
                    amount,
                    customer: selectedCustomer,
                    notes,
                    orderIds: selectionModel.ids.size ? Array.from(selectionModel.ids).map(Number) : null
                })
                    .then((data) => {
                        setSuccess(true);
                        setSubmitted(true);
                        setPopUpMessage(t('messages_ext.savedGeneric', { item: t('typeNames.receipt') }));
                        console.log(data);
                        incrementRefreshKey();
                    })
                    .catch((error) => {
                        setPopUpMessage(error.message);
                        setSubmitted(true);
                        setSuccess(false);
                    });
                setAmount("");
                setSelectedCustomer(null);
                setNotes("");
            } else if (selectValue === "orderSupplier") {
                addPayment({
                    amount,
                    supplier: selectedSupplier,
                    notes,
                    orderIds: selectionModel.ids.size ? Array.from(selectionModel.ids).map(Number) : null
                })
                    .then((data) => {
                        setSuccess(true);
                        setSubmitted(true);
                        setPopUpMessage(t('messages_ext.savedGeneric', { item: t('typeNames.payment') }));
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
            }
        } else {
            setSubmitted(true);
            setSuccess(false);
        }

    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();
        value = value.replace(',', '.');
        setAmount(value);
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
        if (selectValue === "orderCustomer") {
            setSearchTerm(selectedCustomer?.id ? String(selectedCustomer.id) : "");
        } else if (selectValue === "orderSupplier") {
            setSearchTerm(selectedSupplier?.id ? String(selectedSupplier.id) : "");
        }
    }, [selectedCustomer, selectedSupplier, selectValue]);

    const renderCustomer = () => {
        if (selectValue === "orderCustomer")
            return (
                <Grid size={{ xs: 12 }}>
                    <Stack direction="row"
                           alignItems="stretch"
                           spacing={0}>
                        <OMSLabel
                            required
                            label={t('form.order.customer')}
                        />
                        <Box sx={{ flex: 1 }}>
                            <AppAutocomplete<Customer>
                                options={customers}
                                value={selectedCustomer}
                                inputValue={inputValue}
                                loading={loadingCustomer}
                                placeholder={t('search2.searchCustomer')}
                                getOptionLabel={(c) => `${c.name} ${c.lastName} #${c.id}`}
                                onChange={setSelectedCustomer}
                                onInputChange={setInputValue}
                                helperText={receiptErrors?.person}
                                error={Boolean(receiptErrors?.person)}
                            />
                        </Box>
                    </Stack>
                </Grid>
            )
    }

    const renderSupplier = () => {
        if (selectValue === "orderSupplier")
            return (
                <Grid size={{ xs: 12 }}>
                    <Stack direction="row"
                           alignItems="stretch"
                           spacing={0}>
                        <OMSLabel
                            required
                            label={t('form.order.supplier')}
                        />
                        <Box sx={{ flex: 1 }}>
                            <AppAutocomplete<Supplier>
                                options={suppliers}
                                value={selectedSupplier}
                                inputValue={inputValue}
                                loading={loadingSupplier}
                                   placeholder={t('search2.searchSupplier')}
                                getOptionLabel={(c) => `${c.name} #${c.id}`}
                                onChange={setSelectedSupplier}
                                onInputChange={setInputValue}
                                helperText={receiptErrors?.person}
                                error={Boolean(receiptErrors?.person)}
                            />
                        </Box>
                    </Stack>
                </Grid>
            )
    }

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
                            {t('form.payment.title')}
                        </Box>
                    </Grid>

                    {/* TYPE OF PAYMENT */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <OMSLabel
                                label={t('form.payment.typeOfPayment')}
                            />
                            <OMSSelect
                                options={[{"orderCustomer": t('form.payment.paymentFromCustomer')},
                                    {"orderSupplier": t('form.payment.paymentToSupplier')}]}
                                selectValue={selectValue}
                                setSelectValue={setSelectValue}
                            />

                        </Stack>
                    </Grid>

                    {renderCustomer()}
                    {renderSupplier()}

                    {/* NOTES */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            label={t('form.payment.notes')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>

                    {/* AMOUNT */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            required
                            label={t('form.payment.amount')}
                            value={amount}
                            onChange={handleAmountChange}
                            error={Boolean(receiptErrors?.amount)}
                            helperText={receiptErrors?.amount || " "}
                        />
                    </Grid>

                    {/* LINK TO ORDER */}
                    <Grid size={{xs: 12}}>
                        <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                            <OMSLabel label={t('form.payment.linkToOrder')} />
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
                                {showOrders ? t('form.payment.hideOrders') : t('form.payment.selectOrder')}
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
                                orderType={selectValue as "orderCustomer" | "orderSupplier"}
                            />
                        </Grid>
                    )}

                    {/* ACTIONS */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button type="reset" variant="outlined" color="error" size="small">
                                {t('actions.reset')}
                            </Button>

                            <Button type="submit" variant="contained" size="small">
                                {t('actions.create')}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );

}

export default FormReceipt;