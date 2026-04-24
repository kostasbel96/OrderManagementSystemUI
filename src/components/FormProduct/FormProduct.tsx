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
                margin: "0 auto"
            }}
        >
            <Box
                component="form"
                onSubmit={handleOnSubmit}
                onReset={handleOnReset}
            >
                <Grid container spacing={2}>

                    {/* Title section */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ fontSize: 18, fontWeight: 600 }}>
                            Create Product
                        </Box>
                    </Grid>

                    {/* Name */}
                    <Grid size={{ xs: 12}}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={Boolean(productErrors?.name)}
                            helperText={productErrors?.name}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12}}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            error={Boolean(productErrors?.description)}
                            helperText={productErrors?.description}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* Quantity + Price */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            inputProps={{ min: 1 }}
                            name="quantity"
                            value={values.quantity}
                            onChange={handleChange}
                            error={Boolean(productErrors?.quantity)}
                            helperText={productErrors?.quantity}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            inputProps={{ min: 0, step: "0.01"}}
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            error={Boolean(productErrors?.price)}
                            helperText={productErrors?.price}
                        />
                    </Grid>

                    {/* Buttons */}
                    <Grid size={{ xs: 12 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                type="reset"
                                variant="outlined"
                                color="error"
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                            >
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