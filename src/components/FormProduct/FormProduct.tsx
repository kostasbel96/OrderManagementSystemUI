import { type FormEvent, useEffect, useState } from "react";
import { addProduct } from "../../services/productService.ts";
import { Box, TextField, Button, Stack, Paper, Grid } from "@mui/material";
import useProductFormValidation, {
    type FormValues
} from "../../hooks/useProductFormValidation.ts";

interface FormProductProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const initialValues: FormValues = {
    name: "",
    description: "",
    quantity: 1,
    price: 1
};

const FormProduct = ({
                         setSubmitted,
                         setSuccess,
                         setPopUpMessage
                     }: FormProductProps) => {

    const [values, setValues] = useState<FormValues>(() => {
        const saved = localStorage.getItem("productDraft");
        return saved ? JSON.parse(saved) : initialValues;
    });

    useEffect(() => {
        localStorage.setItem("productDraft", JSON.stringify(values));
    }, [values]);

    const {
        validateProductForm,
        productErrors,
        setProductErrors
    } = useProductFormValidation(values);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateProductForm()) {
            addProduct({
                name: values.name,
                description: values.description,
                quantity: Number(values.quantity),
                price: Number(values.price)
            })
                .then((data) => {
                    setSuccess(true);
                    setSubmitted(true);
                    setPopUpMessage("Product created successfully");
                    console.log(data);
                })
                .catch((error) => {
                    setPopUpMessage(error.message);
                    setSubmitted(true);
                    setSuccess(false);
                });

            localStorage.removeItem("productDraft");
            setValues(initialValues);
            setProductErrors({});
        } else {
            setSubmitted(true);
            setSuccess(false);
        }
        setPopUpMessage("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        setProductErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        localStorage.removeItem("productDraft");
        setValues(initialValues);
        setProductErrors({});
        setPopUpMessage("");
        setSubmitted(false);
    };

    const OMSLabel = ({text, required = false}: { text: string, required?: boolean} ) => {
        return (
            <Box
                sx={{
                    width: "fit-content",
                    padding: "6px",
                    border: "1px solid #bdbdbd",
                    borderRadius: "8px 0px 0px 8px",
                    height: "32px",
                    fontSize: 12,
                    textAlign: "right",
                    bgcolor: "#f5f5f5",
                    whiteSpace: "nowrap"
                }}
            >
                {text}

                {required && (
                    <Box
                        component="span"
                        sx={{
                            color: "#d32f2f",
                            marginLeft: 0.5,
                            fontSize: 12,
                        }}
                    >
                        *
                    </Box>
                )}
            </Box>
        );
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
            <Box component="form" onSubmit={handleOnSubmit} onReset={handleOnReset}>
                <Grid container spacing={2}>

                    {/* TITLE */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                            Create Product
                        </Box>
                    </Grid>

                    {/* NAME */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <OMSLabel text="Product Name" required />

                            <TextField
                                fullWidth
                                size="small"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                error={Boolean(productErrors?.name)}
                                helperText={productErrors?.name || " "}
                                placeholder="Enter product name..."
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* DESCRIPTION */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <OMSLabel text="Description" required />

                            <TextField
                                fullWidth
                                size="small"
                                name="description"
                                placeholder="Enter product description..."
                                value={values.description}
                                onChange={handleChange}
                                error={Boolean(productErrors?.description)}
                                helperText={productErrors?.description || " "}
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* QUANTITY */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <OMSLabel text="Quantity"/>

                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                inputProps={{ min: 1 }}
                                name="quantity"
                                value={values.quantity}
                                onChange={handleChange}
                                error={Boolean(productErrors?.quantity)}
                                helperText={productErrors?.quantity || " "}
                                sx={inputSx}
                            />
                        </Stack>
                    </Grid>

                    {/* PRICE */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <OMSLabel text="Price"/>

                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                inputProps={{ min: 0, step: "0.01" }}
                                name="price"
                                value={values.price}
                                onChange={handleChange}
                                error={Boolean(productErrors?.price)}
                                helperText={productErrors?.price || " "}
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
            </Box>
        </Paper>
    );
};

export default FormProduct;