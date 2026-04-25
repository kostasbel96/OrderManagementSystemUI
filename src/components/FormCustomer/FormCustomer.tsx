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

    const [values, setValues] = useState<FormValues>(() => {
        const saved = localStorage.getItem("customerDraft");
        return saved ? JSON.parse(saved) : initialValues;
    });

    useEffect(() => {
        localStorage.setItem("customerDraft", JSON.stringify(values));
    }, [values]);

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
                    localStorage.removeItem("customerDraft");
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
        setCustomerErrors({});
        setPopUpMessage("");
        localStorage.removeItem("customerDraft");
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

    const labelSx = {
        width: "fit-content",
        padding: "6px",
        border: "1px solid #bdbdbd",
        borderRadius: "8px 0px 0px 8px",
        height: "32px",
        fontSize: 12,
        textAlign: "right",
        bgcolor: "#f5f5f5",
        whiteSpace: "nowrap"
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            fontSize: 12,
            height: 32,
            borderRadius: "0 8px 8px 0", // ✅ εδώ σωστά
            alignItems: "center",

            "& fieldset": {
                borderColor: "#e0e0e0",
            },

            "&:hover fieldset": {
                borderColor: "#bdbdbd",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
            },
            "& .MuiInputBase-input": {
                padding: "0 8px",
                height: "100%",
                display: "flex",
                alignItems: "center",
            },
        }
    };

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
                            Create Customer
                        </Box>
                    </Grid>

                    {/* NAME */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row"
                               alignItems="stretch"
                               spacing={0}>
                            <Box sx={labelSx}>Name<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span></Box>

                            <TextField
                                fullWidth
                                placeholder="Enter name..."
                                size="small"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                error={Boolean(customerErrors?.name)}
                                helperText={customerErrors?.name ?? " "}
                                sx={inputSx}
                            />
                        </Stack>

                    </Grid>

                    {/* LAST NAME */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <Box sx={labelSx}>Last Name<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span></Box>

                            <TextField
                                fullWidth
                                placeholder="Enter Last name..."
                                size="small"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                error={Boolean(customerErrors?.lastName)}
                                helperText={customerErrors?.lastName ?? " "}
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* PHONE 1 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <Box sx={labelSx}>Phone 1<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span></Box>

                            <TextField
                                placeholder="Enter phone number..."
                                fullWidth
                                size="small"
                                name="phoneNumber1"
                                value={values.phoneNumber1}
                                onChange={handleChange}
                                error={Boolean(customerErrors?.phoneNumber1)}
                                helperText={customerErrors?.phoneNumber1 ?? " "}
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* PHONE 2 */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <Box sx={labelSx}>Phone 2</Box>

                            <TextField
                                fullWidth
                                placeholder="Enter phone number..."
                                size="small"
                                name="phoneNumber2"
                                value={values.phoneNumber2}
                                onChange={handleChange}
                                error={Boolean(customerErrors?.phoneNumber2)}
                                helperText={customerErrors?.phoneNumber2 ?? " "}
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* EMAIL */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <Box sx={labelSx}>Email</Box>

                            <TextField
                                placeholder="Enter email..."
                                fullWidth
                                size="small"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                error={Boolean(customerErrors?.email)}
                                helperText={customerErrors?.email ?? " "}
                                sx={inputSx}
                            />
                        </Stack>
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
            </form>
        </Paper>
    );
};

export default FormCustomer;