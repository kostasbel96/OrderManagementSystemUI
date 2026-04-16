import {
    TextField,
    Button,
    Paper,
    Stack,
    Grid, Box
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import { addCustomer } from "../../services/customerService.ts";
import useCustomerFormValidation, {
    type FormValues
} from "../../hooks/useCustomerFormValidation.ts";

interface FormCustomerProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const initialValues: FormValues = {
    name: "",
    lastName: "",
    phoneNumber1: "",
    phoneNumber2: "",
    email: ""
};

const FormCustomer = ({
                          setSubmitted,
                          setSuccess,
                          setPopUpMessage
                      }: FormCustomerProps) => {

    const [values, setValues] = useState<FormValues>(initialValues);

    const {
        validateCustomerForm,
        customerErrors,
        setCustomerErrors
    } = useCustomerFormValidation(values);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateCustomerForm()) {
            addCustomer({
                name: values.name,
                lastName: values.lastName,
                phoneNumber1: values.phoneNumber1,
                phoneNumber2: values.phoneNumber2,
                email: values.email,
                balance: 0
            })
                .then(() => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage("Customer added successfully.");
                    setValues(initialValues);
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
        setCustomerErrors({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        setCustomerErrors((prev) => ({
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
                maxWidth: 800,
                margin: "0 auto"
            }}
        >
            <form onSubmit={handleOnSubmit} onReset={handleOnReset}>

                <Grid container spacing={2}>

                    {/* Title section */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 18, fontWeight: 600 }}>
                            Create Customer
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={Boolean(customerErrors?.name)}
                            helperText={customerErrors?.name}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            error={Boolean(customerErrors?.lastName)}
                            helperText={customerErrors?.lastName}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone 1"
                            name="phoneNumber1"
                            value={values.phoneNumber1}
                            onChange={handleChange}
                            error={Boolean(customerErrors?.phoneNumber1)}
                            helperText={customerErrors?.phoneNumber1}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone 2"
                            name="phoneNumber2"
                            value={values.phoneNumber2}
                            onChange={handleChange}
                            error={Boolean(customerErrors?.phoneNumber2)}
                            helperText={customerErrors?.phoneNumber2}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            error={Boolean(customerErrors?.email)}
                            helperText={customerErrors?.email}
                        />
                    </Grid>

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
            </form>
        </Paper>
    );
};

export default FormCustomer;