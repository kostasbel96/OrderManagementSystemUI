import {
    Button,
    Paper,
    Stack,
    Grid, Box
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import LabeledField from "../../ui/LabeledField.tsx";
import {addSupplier} from "../../../services/supplierService.ts";
import useSupplierFormValidation, {type SupplierFormValues} from "../../../hooks/useSupplierFormValidation.ts";
import {useTranslation} from "react-i18next";
import {useUIStore} from "../../../hooks/store/useUIStore.ts";

interface FormSupplierProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const initialValues: SupplierFormValues = {
    name: "",
    phoneNumber1: "",
    phoneNumber2: "",
    address: "",
    vat: "",
    email: "",
};

const FormSupplier = ({
                          setSubmitted,
                          setSuccess,
                          setPopUpMessage,
                      }: FormSupplierProps) => {
    const { t } = useTranslation();
    const { incrementRefreshKey } = useUIStore();

    const [values, setValues] = useState<SupplierFormValues>(() => {
        const saved = localStorage.getItem("supplierDraft");
        return saved ? JSON.parse(saved) : initialValues;
    });

    useEffect(() => {
        localStorage.setItem("supplierDraft", JSON.stringify(values));
    }, [values]);

    const {
        validateSupplierForm,
        supplierErrors,
        setSupplierErrors
    } = useSupplierFormValidation(values);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateSupplierForm()) {
            addSupplier({
                name: values.name,
                phoneNumber1: values.phoneNumber1,
                phoneNumber2: values.phoneNumber2,
                email: values.email,
                address: values.address,
                vatNumber: values.vat,
                balance: 0
            })
                .then(() => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage(t('messages.supplierAdded'));
                    setValues(initialValues);
                    localStorage.removeItem("supplierDraft");
                    incrementRefreshKey();
                })
                .catch((error) => {
                    setPopUpMessage(error.message);
                    setSubmitted(true);
                    setSuccess(false);
                });
        } else {
            setSubmitted(true);
            setSuccess(false);
        }
        setPopUpMessage("");
    };

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValues(initialValues);
        setSubmitted(false);
        setSupplierErrors({});
        setPopUpMessage("");
        localStorage.removeItem("supplierDraft");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        setSupplierErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    useEffect(() => {
        setPopUpMessage("");
    }, []);

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
            <form onSubmit={handleOnSubmit} onReset={handleOnReset}>

                <Grid container spacing={2}>

                    {/* TITLE */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                            {t('form.supplier.title')}
                        </Box>
                    </Grid>

                    {/* NAME */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name="name"
                            label={t('form.supplier.name')}
                            value={values.name}
                            onChange={handleChange}
                            error={Boolean(supplierErrors?.name)}
                            helperText={supplierErrors?.name}
                            required
                        />
                    </Grid>

                    {/* VAT NUMBER */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"vat"}
                            label={t('form.supplier.vat')}
                            value={values.vat}
                            onChange={handleChange}
                            error={Boolean(supplierErrors?.vat)}
                            helperText={supplierErrors?.vat}
                            required
                        />
                    </Grid>

                    {/* PHONE 1 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"phoneNumber1"}
                            label={t('form.supplier.phone1')}
                            value={values.phoneNumber1}
                            onChange={handleChange}
                            error={Boolean(supplierErrors?.phoneNumber1)}
                            helperText={supplierErrors?.phoneNumber1}
                            required
                        />
                    </Grid>

                    {/* PHONE 2 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"phoneNumber2"}
                            label={t('form.supplier.phone2')}
                            value={values.phoneNumber2}
                            onChange={handleChange}
                            error={Boolean(supplierErrors?.phoneNumber2)}
                            helperText={supplierErrors?.phoneNumber2}
                        />
                    </Grid>

                    {/* EMAIL */}
                    <Grid size={{ xs: 12 }}>
                        <LabeledField
                            name={"email"}
                            label={t('form.supplier.email')}
                            value={values.email}
                            onChange={handleChange}
                            helperText={supplierErrors?.email}
                            error={Boolean(supplierErrors?.email)}
                        />
                    </Grid>

                    {/* ADDRESS */}
                    <Grid size={{ xs: 12 }}>
                        <LabeledField
                            name={"address"}
                            label={t('form.supplier.address')}
                            value={values.address}
                            onChange={handleChange}
                            helperText={supplierErrors?.address}
                            error={Boolean(supplierErrors?.address)}
                        />
                    </Grid>

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
            </form>
        </Paper>
    );
};

export default FormSupplier;