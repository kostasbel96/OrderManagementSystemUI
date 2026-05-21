import {
    Button,
    Paper,
    Stack,
    Grid, Box
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import useDriverFormValidation, {
    type FormDriverValues
} from "../../../hooks/useDriverFormValidation.ts";
import LabeledField from "../../ui/LabeledField.tsx";
import {addDriver} from "../../../services/driverService.ts";

interface FormCustomerProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const initialValues: FormDriverValues = {
    name: "",
    lastName: "",
    phoneNumber1: "",
    phoneNumber2: "",
};

const FormDriver = ({
                          setSubmitted,
                          setSuccess,
                          setPopUpMessage,
                      }: FormCustomerProps) => {

    const [values, setValues] = useState<FormDriverValues>(() => {
        const saved = localStorage.getItem("driverDraft");
        return saved ? JSON.parse(saved) : initialValues;
    });

    useEffect(() => {
        localStorage.setItem("driverDraft", JSON.stringify(values));
    }, [values]);

    const {
        validateDriverForm,
        driverErrors,
        setDriverErrors
    } = useDriverFormValidation(values);
    const { t } = useTranslation();

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateDriverForm()) {
            addDriver({
                name: values.name,
                lastName: values.lastName,
                phoneNumber1: values.phoneNumber1,
                phoneNumber2: values.phoneNumber2,
            })
                .then(() => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage("Driver added successfully.");
                    setValues(initialValues);
                    localStorage.removeItem("driverDraft");
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
    };

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValues(initialValues);
        setSubmitted(false);
        setDriverErrors({});
        setPopUpMessage("");
        localStorage.removeItem("driverDraft");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        setDriverErrors((prev) => ({
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
                            {t('form.driver.title')}
                        </Box>
                    </Grid>

                    {/* NAME */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name="name"
                            label={t('form.driver.name')}
                            value={values.name}
                            onChange={handleChange}
                            error={Boolean(driverErrors?.name)}
                            helperText={driverErrors?.name}
                            required
                        />
                    </Grid>

                    {/* LAST NAME */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"lastName"}
                            label={t('form.driver.lastName')}
                            value={values.lastName}
                            onChange={handleChange}
                            error={Boolean(driverErrors?.lastName)}
                            helperText={driverErrors?.lastName}
                            required
                        />
                    </Grid>

                    {/* PHONE 1 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"phoneNumber1"}
                            label={t('form.driver.phone1')}
                            value={values.phoneNumber1}
                            onChange={handleChange}
                            error={Boolean(driverErrors?.phoneNumber1)}
                            helperText={driverErrors?.phoneNumber1}
                            required
                        />
                    </Grid>

                    {/* PHONE 2 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"phoneNumber2"}
                            label={t('form.driver.phone2')}
                            value={values.phoneNumber2}
                            onChange={handleChange}
                            error={Boolean(driverErrors?.phoneNumber2)}
                            helperText={driverErrors?.phoneNumber2}
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

export default FormDriver;