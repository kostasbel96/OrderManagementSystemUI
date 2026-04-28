import { type FormEvent, useEffect, useState } from "react";
import { addProduct } from "../../services/productService.ts";
import { Box, Button, Stack, Paper, Grid } from "@mui/material";
import useProductFormValidation, {
    type FormValues
} from "../../hooks/useProductFormValidation.ts";
import LabeledField from "../ui/LabeledField.tsx";

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
                        <LabeledField
                            label="Product Name"
                            value={values.name}
                            onChange={handleChange}
                            error={Boolean(productErrors?.name)}
                            helperText={productErrors?.name || " "}
                            required
                            name={"name"}
                        />
                    </Grid>

                    {/* DESCRIPTION */}
                    <Grid size={{ xs: 12 }}>
                        <LabeledField
                            name={"description"}
                            label="Description"
                            value={values.description}
                            onChange={handleChange}
                            error={Boolean(productErrors?.description)}
                            helperText={productErrors?.description || " "}
                            required
                        />
                    </Grid>

                    {/* QUANTITY */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"quantity"}
                            label="Quantity"
                            value={values.quantity}
                            onChange={handleChange}
                            error={Boolean(productErrors?.quantity)}
                            helperText={productErrors?.quantity || " "}
                        />
                    </Grid>

                    {/* PRICE */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabeledField
                            name={"price"}
                            label="Price"
                            value={values.price}
                            onChange={handleChange}
                            error={Boolean(productErrors?.price)}
                            helperText={productErrors?.price || " "}
                        />
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